// Bungkus hasil `next build` (output: "standalone") jadi deploy/nawwaf-cpanel.zip
// untuk cPanel > Setup Node.js App. pnpm membuat node_modules standalone berisi
// symlink ke path Windows, jadi semuanya disalin sebagai file asli (dereference).
import { cpSync, existsSync, lstatSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
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
// sharp & dependensinya dilewati: tidak dipakai (images.unoptimized) dan binary-nya
// khusus OS tempat build.
const SKIP = new Set(["sharp", "detect-libc", "semver"]);
const skip = (name) => SKIP.has(name) || name.startsWith("@img/");
const pnpmDir = path.join(standalone, "node_modules", ".pnpm");
const packages = new Map();
for (const id of readdirSync(pnpmDir)) {
  const nm = path.join(pnpmDir, id, "node_modules");
  if (!existsSync(nm)) continue;
  for (const entry of readdirSync(nm)) {
    const names = entry.startsWith("@") ? readdirSync(path.join(nm, entry)).map((n) => `${entry}/${n}`) : [entry];
    for (const name of names) {
      const src = path.join(nm, name);
      if (skip(name) || lstatSync(src).isSymbolicLink()) continue;
      if (packages.has(name)) throw new Error(`Paket ganda dengan versi berbeda: ${name}`);
      packages.set(name, src);
    }
  }
}
for (const [name, src] of packages) {
  cpSync(src, path.join(app, "node_modules", name), { recursive: true });
}
console.log(`node_modules: ${[...packages.keys()].sort().join(", ")}`);

// Zip dengan separator "/" supaya aman diekstrak File Manager cPanel (Linux).
// Di Windows pakai tar bawaan (bsdtar); tar milik Git Bash tidak bisa menulis zip.
if (process.platform === "win32") {
  const tar = path.join(process.env.SystemRoot ?? "C:\Windows", "System32", "tar.exe");
  execFileSync(tar, ["-a", "-c", "-f", zip, "-C", app, "."], { stdio: "inherit" });
} else {
  execFileSync("zip", ["-qr", zip, "."], { cwd: app, stdio: "inherit" });
}
console.log(`Siap upload: ${path.relative(root, zip)}`);
