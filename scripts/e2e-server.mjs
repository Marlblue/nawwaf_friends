// Menjalankan build produksi (.next/standalone) untuk tes browser di e2e/. Next tidak
// menyalin .next/static dan public ke standalone, jadi disalin dulu di sini, persis seperti
// yang dikirim ke cPanel. Berkas ini sama persis di ketiga repo; ubah ketiganya bersamaan.
import { spawn } from "node:child_process";
import { cpSync, existsSync } from "node:fs";

const standalone = ".next/standalone";
if (!existsSync(`${standalone}/server.js`)) {
  console.error("Belum ada .next/standalone/server.js. Jalankan `pnpm build` dulu.");
  process.exit(1);
}
cpSync(".next/static", `${standalone}/.next/static`, { recursive: true });
if (existsSync("public")) cpSync("public", `${standalone}/public`, { recursive: true });

const server = spawn(process.execPath, [`${standalone}/server.js`], {
  stdio: "inherit",
  env: { ...process.env, HOSTNAME: "127.0.0.1" },
});
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => server.kill(signal));
server.on("exit", (code) => process.exit(code ?? 0));
