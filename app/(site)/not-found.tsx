import NotFoundView from "@/components/NotFoundView";

// Untuk notFound() dari halaman di dalam (site), misalnya /artikel/slug-yang-tidak-ada. Di sini
// layout (site) sudah memasang SiteShell; kalau jatuh ke app/not-found.tsx, header dan footer
// tampil dua kali karena file itu memasang SiteShell sendiri.
export default function NotFound() {
  return <NotFoundView />;
}
