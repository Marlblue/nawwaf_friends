"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { SANITY_API_VERSION, SANITY_DATASET, SANITY_PROJECT_ID } from "@/lib/sanity/env";
import { schemaTypes } from "@/sanity/schemaTypes";

export default defineConfig({
  name: "nawwaf-friends",
  title: "Nawwaf & Friends",
  basePath: "/studio",
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  plugins: [structureTool(), visionTool({ defaultApiVersion: SANITY_API_VERSION })],
  schema: { types: schemaTypes },
});
