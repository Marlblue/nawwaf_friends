import { catatJendelaBaru, expect, jendelaDibuka, test } from "./bantu";

test("beranda tampil", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Nawwaf & Friends/);
  await expect(page.locator("h1")).toHaveCount(1);
});

test("menu: tab dan kata kunci dari URL terbaca", async ({ page }) => {
  await page.goto("/menu?kategori=aqiqah");
  await expect(page.locator('[aria-pressed="true"]').first()).toHaveText("Aqiqah");

  await page.goto("/menu?q=mandhi");
  await expect(page.getByRole("searchbox").or(page.locator("input[type=search]")).first()).toHaveValue("mandhi");
  await expect(page.getByRole("button", { name: /^Tambah Nasi Mandhi Omelet/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /^Tambah Nasi Kebuli Omelet/ })).toHaveCount(0);
});

test("pesan: dari menu sampai pesan WhatsApp tersusun", async ({ page }) => {
  await catatJendelaBaru(page);
  await page.goto("/menu");
  await page.getByRole("button", { name: "Tambah Nasi Mandhi Omelet ke keranjang" }).click();
  await expect(page.getByRole("button", { name: "Keranjang, 1 item" })).toBeVisible();

  await page.goto("/order");
  await page.locator("#name").fill("Tes Otomatis");
  await page.locator("#phone").fill("081234567890");
  await page.locator("#address").fill("Jl. Tes No. 1");
  await page.getByRole("button", { name: "Kirim Pesanan via WhatsApp" }).click();

  await expect(page.getByRole("heading", { name: /siap dikirim/ })).toBeVisible();
  const [wa] = await jendelaDibuka(page);
  const pesan = new URL(wa).searchParams.get("text") ?? "";
  expect(wa).toMatch(/^https:\/\/(wa\.me|api\.whatsapp\.com)\//);
  expect(pesan).toContain("*Nama:* Tes Otomatis");
  expect(pesan).toContain("Nasi Mandhi Omelet x1");
  // Keranjang dikosongkan setelah pesanan terkirim.
  await expect(page.getByRole("button", { name: "Keranjang, 0 item" })).toBeVisible();
});

test("artikel tampil", async ({ page }) => {
  await page.goto("/artikel");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
