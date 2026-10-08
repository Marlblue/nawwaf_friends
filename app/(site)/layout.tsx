import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import { site } from "@/lib/site";

// Metadata situs di sini, bukan di layout akar, supaya /studio tidak mewarisi judul restoran.
export const metadata: Metadata = {
  title: {
    default: `${site.name} - ${site.tagline} | Delivery Order Online`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
};

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return <SiteShell>{children}</SiteShell>;
}
