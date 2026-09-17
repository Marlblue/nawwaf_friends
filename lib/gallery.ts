// Slide galeri di beranda. Tambah foto dokumentasi acara cukup dengan menambah item di sini.
// Foto sementara diambil dari menu; ganti dengan foto asli acara / catering kalau sudah ada.

export type GallerySlide = {
  image: string;
  badge: string;
  title: string;
  text?: string;
  tags?: string[];
};

export const gallery: GallerySlide[] = [
  {
    image: "/images/menu/mix-full.webp",
    badge: "Live Carving Kambing Guling",
    title: "Prasmanan Sultan & Kambing Guling Utuh",
    text: "Pengalaman live cooking & carving langsung di hadapan para tamu dengan aroma rempah khas Arab yang memikat.",
    tags: ["Siap Saji di Lokasi", "Chef Berpengalaman"],
  },
  {
    image: "/images/menu/nasi-kebuli-ayam.webp",
    badge: "Nasi Box Siap Kirim",
    title: "Distribusi Nasi Box Skala Besar & Korporat",
    text: "Kemasan bersegel higienis menjaga aroma kebuli dan kelembutan daging tetap prima hingga sampai di acara Anda.",
    tags: ["Pesanan Jumlah Besar", "Armada Berpenghangat"],
  },
  {
    image: "/images/menu/kebuli-full-kambing.webp",
    badge: "Royal Banquet Mandhi & Kebuli",
    title: "Jamuan Nampan Kambing untuk Keluarga Besar",
    text: "Nampan mandhi & kebuli dengan kambing empuk, disajikan untuk makan bersama ala Timur Tengah.",
    tags: ["Porsi Berbagi", "Rempah Autentik"],
  },
  {
    image: "/images/menu/mandhi-full-ayam.webp",
    badge: "Suasana Kehangatan Keluarga & Tamu",
    title: "Perjamuan Tradisional & Suasana Hangat Perayaan",
    text: "Cocok untuk syukuran, tasyakuran keluarga besar, hingga pertemuan kehormatan.",
    tags: ["Pelayanan Lengkap", "Momen Penuh Berkah"],
  },
];
