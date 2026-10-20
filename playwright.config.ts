import { defineConfig, devices } from "@playwright/test";

// Tes browser terhadap build produksi (`pnpm build` dulu, lalu `pnpm test:e2e`). Berkas ini
// sama persis di ketiga repo; ubah ketiganya bersamaan.
const PORT = 3930;
// Di laptop memakai Chrome yang terpasang, supaya tidak perlu mengunduh browser Playwright.
const channel = process.env.CI ? undefined : "chrome";

export default defineConfig({
  testDir: "e2e",
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: { baseURL: `http://127.0.0.1:${PORT}`, trace: "retain-on-failure" },
  projects: [
    { name: "hp", use: { ...devices["Pixel 7"], channel } },
    { name: "desktop", use: { ...devices["Desktop Chrome"], channel } },
  ],
  webServer: {
    command: "node scripts/e2e-server.mjs",
    url: `http://127.0.0.1:${PORT}`,
    env: { PORT: String(PORT) },
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
