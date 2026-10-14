// Bungkus hasil `next build` (output: "standalone") jadi deploy/nawwaf-cpanel.zip
// untuk cPanel > Setup Node.js App. pnpm membuat node_modules standalone berisi
// symlink ke path Windows, jadi semuanya disalin sebagai file asli (dereference).
import { cpSync, existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, realpathSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const root = process.cwd();
const standalone = path.join(root, ".next", "standalone");
const out = path.join(root, "deploy");
const app = path.join(out, "app");
const zip = path.join(out, "nawwaf-cpanel.zip");

if (!existsSync(path.join(standalone, "server.js"))) {
  console.error("Belum ada .next/standalone/server.js — jalankan `pnpm build` dulu.");
  process.exit(1);
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

// Semua yang bukan node_modules disalin apa adanya.
for (const entry of readdirSync(standalone)) {
  if (entry === "node_modules") continue;
  cpSync(path.join(standalone, entry), path.join(app, entry), { recursive: true });
}
cpSync(path.join(root, "public"), path.join(app, "public"), { recursive: true });
cpSync(path.join(root, ".next", "static"), path.join(app, ".next", "static"), { recursive: true });

// node_modules standalone versi pnpm berisi symlink (di Windows: path absolut C:\...) yang
// tidak ikut terbawa ke server. Salinan paket hasil tracing (yang minimal) ada sebagai folder asli di
// .pnpm/<id>/node_modules/<nama>; ratakan jadi node_modules/<nama> ala npm.
//
// sharp ikut disalin karena optimizer gambar memakainya saat runtime. Binary-nya khusus OS
// tempat build, jadi bundel yang benar hanya yang dirakit di runner Linux (deploy.yml).
const pnpmDir = path.join(standalone, "node_modules", ".pnpm");
const packages = new Map();
for (const id of readdirSync(pnpmDir)) {
  const nm = path.join(pnpmDir, id, "node_modules");
  if (!existsSync(nm)) continue;
  for (const entry of readdirSync(nm)) {
    const names = entry.startsWith("@") ? readdirSync(path.join(nm, entry)).map((n) => `${entry}/${n}`) : [entry];
    for (const name of names) {
      let src = path.join(nm, name);
      if (lstatSync(src).isSymbolicLink()) continue;
      if (packages.has(name)) throw new Error(`Paket ganda dengan versi berbeda: ${name}`);
      // Tracing hanya membawa berkas yang di-require, jadi dari paket binary sharp yang ikut
      // cuma .node-nya, tanpa libvips (.so/.dll) yang dimuat .node itu. Paket @img diambil
      // utuh dari node_modules proyek, dengan id yang sama supaya versinya tidak bergeser.
      const utuh = path.join(root, "node_modules", ".pnpm", id, "node_modules", name);
      if (name.startsWith("@img/") && existsSync(utuh)) src = utuh;
      packages.set(name, src);
    }
  }
}
// Di Linux, libvips ada di paket tersendiri (@img/sharp-libvips-linux-x64) yang tidak pernah
// di-require dari JavaScript, jadi tracing tidak melihatnya sama sekali. Tarik dependensi @img
// dari paket @img yang sudah terbawa; di layout pnpm, dependensi itu ada di sebelahnya.
for (const [name, src] of [...packages]) {
  if (!name.startsWith("@img/")) continue;
  const pkg = JSON.parse(readFileSync(path.join(src, "package.json"), "utf8"));
  for (const dep of Object.keys({ ...pkg.dependencies, ...pkg.optionalDependencies })) {
    const sebelah = path.join(src, "..", "..", dep);
    if (dep.startsWith("@img/") && !packages.has(dep) && existsSync(sebelah)) {
      packages.set(dep, realpathSync(sebelah));
    }
  }
}
for (const [name, src] of packages) {
  cpSync(src, path.join(app, "node_modules", name), { recursive: true });
}
console.log(`node_modules: ${[...packages.keys()].sort().join(", ")}`);

// Kalau sharp gagal dimuat, Next tidak error: /_next/image diam-diam menyajikan berkas asli
// tanpa dikecilkan, dan build serta deploy tetap hijau. Jadi sharp dimuat sungguhan dari
// dalam bundel. Di runner Linux, ini bukti bahwa sharp akan jalan di server.
try {
  createRequire(path.join(app, "server.js"))("sharp");
} catch (err) {
  console.error(`sharp tidak bisa dimuat dari bundel: ${err.message.split("\n")[0]}`);
  process.exit(1);
}
console.log("sharp termuat dari bundel.");

// Zip dengan separator "/" supaya aman diekstrak File Manager cPanel (Linux).
// Di Windows pakai tar bawaan (bsdtar); tar milik Git Bash tidak bisa menulis zip.
if (process.platform === "win32") {
  const tar = path.join(process.env.SystemRoot ?? "C:\Windows", "System32", "tar.exe");
  execFileSync(tar, ["-a", "-c", "-f", zip, "-C", app, "."], { stdio: "inherit" });
} else {
  execFileSync("zip", ["-qr", zip, "."], { cwd: app, stdio: "inherit" });
}
console.log(`Siap upload: ${path.relative(root, zip)}`);
