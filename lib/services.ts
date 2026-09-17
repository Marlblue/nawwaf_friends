// Layanan utama. Dipakai kartu layanan di beranda dan tab di halaman menu (/menu?kategori=<id>).
// Foto sementara diambil dari menu; ganti dengan foto asli nasi box / aqiqah / prasmanan kalau sudah ada

export type ServiceId = "delivery" | "nasi-box" | "aqiqah" | "kambing-guling" | "dine-in";

export type Service = {
  id: ServiceId;
  title: string;
  badge: string;
  text: string;
  note: string;
  image: string;
  // Poin & pesan WhatsApp untuk panel di halaman menu (Delivery langsung menampilkan daftar menu)
  points: string[];
  waText: string;
};

export const services: Service[] = [
  {
    id: "delivery",
    title: "Delivery",
    badge: "Siap Kirim Cepat",
    text: "Santap hangat langsung di rumah. Paket nampan kebuli & mandhi lengkap sambal dan acar segar.",
    note: "Mulai 45k / porsi",
    image: "/images/menu/nasi-mandhi-kambing.webp",
    points: [],
    waText: "Halo Nawwaf & Friends, saya mau pesan antar.",
  },
  {
    id: "nasi-box",
    title: "Nasi Box",
    badge: "Kemasan Eksklusif",
    text: "Paket bento premium elegan berpartisi khusus untuk rapat kantor, gathering, dan syukuran berkelas.",
    note: "Mulai 35k / box",
    image: "/images/menu/nasi-kebuli-ayam.webp",
    points: ["Pilihan nasi mandhi atau kebuli", "Untuk rapat kantor, pengajian & syukuran", "Bisa pesan dalam jumlah besar"],
    waText: "Halo Nawwaf & Friends, saya mau pesan nasi box.",
  },
  {
    id: "aqiqah",
    title: "Aqiqah",
    badge: "Syar'i & Higienis",
    text: "Layanan aqiqah syar'i terpercaya dengan olahan kambing lezat tanpa prengus, sertifikat, & dokumentasi.",
    note: "Paket Lengkap Siap Saji",
    image: "/images/menu/mandhi-full-kambing.webp",
    points: ["Aqiqah all in one package", "Menyembelih & memasak daging aqiqah", "Sertifikat & dokumentasi"],
    waText: "Halo Nawwaf & Friends, saya mau tanya paket aqiqah.",
  },
  {
    id: "kambing-guling",
    title: "Kambing Guling",
    badge: "Hajat & Prasmanan",
    text: "Penyelenggaraan prasmanan besar atau talam nampan bersama untuk resepsi, arisan agung, & haul akbar.",
    note: "Kapasitas s/d 1.000 Pax",
    image: "/images/menu/mix-full.webp",
    points: ["Kambing guling utuh untuk acara", "Prasmanan & nampan untuk rombongan", "Kapasitas hingga 1.000 pax"],
    waText: "Halo Nawwaf & Friends, saya mau tanya paket kambing guling / prasmanan.",
  },
  {
    id: "dine-in",
    title: "Dine In",
    badge: "Makan di Tempat",
    text: "Nikmati nasi mandhi, kebuli & nampan kambing langsung di resto kami, cocok untuk makan bersama keluarga.",
    note: "Buka setiap hari",
    image: "/images/menu/mix-half.webp",
    points: [],
    waText: "Halo Nawwaf & Friends, saya mau reservasi tempat untuk makan di resto.",
  },
];
