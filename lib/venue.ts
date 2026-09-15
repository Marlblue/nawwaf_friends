// Katalog venue. Kapasitas, fasilitas, dan foto masih perlu dikonfirmasi
// dengan tim outlet — ganti isinya sesuai kondisi ruangan sebenarnya.
// Set `enabled: false` untuk menyembunyikan ruang dari halaman venue.

export type VenueRoom = {
  id: string;
  name: string;
  tag: string;
  summary: string;
  capacity: string;
  facilities: string[];
  idealFor: string[];
  image: string;
  enabled: boolean;
};

export const rooms: VenueRoom[] = [
  {
    id: "ruang-meeting",
    name: "Ruang Meeting",
    tag: "Baru",
    summary:
      "Ruang tertutup untuk rapat kantor, presentasi, atau diskusi komunitas — lengkap dengan hidangan Arabian food langsung dari dapur kami.",
    capacity: "Konfirmasi ke admin",
    facilities: ["Ruang ber-AC", "Meja & kursi meeting", "Colokan listrik", "Paket makan & minum"],
    idealFor: ["Rapat kantor", "Workshop kecil", "Arisan & komunitas"],
    image: "/images/menu/mix-full.webp",
    enabled: true,
  },
  {
    id: "private-room",
    name: "Private Room",
    tag: "Opsional",
    summary:
      "Ruang privat untuk makan bersama keluarga atau tamu penting. Nikmati nampan mandhi & kebuli dengan suasana lebih tenang.",
    capacity: "Konfirmasi ke admin",
    facilities: ["Ruang privat ber-AC", "Penyajian nampan", "Pelayan khusus", "Dekorasi sederhana (by request)"],
    idealFor: ["Makan keluarga", "Syukuran & aqiqah", "Jamuan tamu"],
    image: "/images/menu/kebuli-full-kambing.webp",
    enabled: true,
  },
];

export const venuePackages = [
  {
    name: "Sewa Ruang",
    desc: "Pakai ruang sesuai durasi, menu dipesan terpisah dari katalog.",
  },
  {
    name: "Ruang + Nampan",
    desc: "Ruang plus paket nampan ayam, kambing, atau mix untuk seluruh tamu.",
  },
  {
    name: "Ruang + Catering",
    desc: "Untuk acara lebih besar: prasmanan, nasi box, dan arabian snack.",
  },
];
