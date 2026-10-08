import { NextStudio } from "next-sanity/studio";
import { sanityConfigured } from "@/lib/sanity/env";
import config from "../../../sanity.config";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!sanityConfigured) {
    return (
      <p style={{ padding: 24, fontFamily: "sans-serif" }}>
        Sanity belum dikonfigurasi: isi NEXT_PUBLIC_SANITY_PROJECT_ID lalu build ulang.
      </p>
    );
  }
  return <NextStudio config={config} />;
}
