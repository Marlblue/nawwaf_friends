import { defineCliConfig } from "sanity/cli";

// Untuk perintah `pnpm sanity ...` di lokal (mis. `pnpm sanity cors add`), membaca .env.local.
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  },
});
