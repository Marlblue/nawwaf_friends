import { createClient } from "next-sanity";
import { SANITY_API_VERSION, SANITY_DATASET, SANITY_PROJECT_ID } from "./env";

export const sanityClient = createClient({
  // Placeholder hanya supaya createClient tidak melempar saat env belum diisi; query tidak
  // pernah dijalankan dalam kondisi itu (dicek sanityConfigured di queries.ts).
  projectId: SANITY_PROJECT_ID || "belum-diisi",
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: true,
  // Ditulis eksplisit supaya draft yang belum dipublish tidak ikut tampil di situs.
  perspective: "published",
});
