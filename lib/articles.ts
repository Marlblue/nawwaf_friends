export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  body: { heading?: string; paragraphs: string[] }[];
};

export const articles: Article[] = [
  {
    slug: "cara-pesan-delivery-nawwaf-friends",
    title: "Cara Pesan Delivery di Nawwaf & Friends",
    excerpt:
      "Lapar tapi malas keluar? Pesan nasi mandhi, kebuli, atau nampan favoritmu langsung dari website dalam beberapa langkah.",
    image: "/images/menu/nasi-mandhi-ayam.webp",
    date: "2026-09-15",
    category: "Info Order",
    body: [
      {
        paragraphs: [
          "Sekarang semua menu Nawwaf & Friends bisa dipesan antar langsung dari website. Tidak perlu mengetik ulang pesanan satu per satu — cukup pilih menu, isi alamat, dan pesanan otomatis terkirim ke WhatsApp admin kami.",
        ],
      },
      {
        heading: "1. Pilih menu dari katalog",
        paragraphs: [
          "Buka halaman Menu, pilih kategori seperti Porsian, Nampan, atau Minuman. Untuk menu yang punya pilihan (misalnya dengan atau tanpa es teh), pilih variannya lalu tekan tombol tambah.",
        ],
      },
      {
        heading: "2. Cek keranjang",
        paragraphs: [
          "Ikon keranjang di kanan bawah menampilkan jumlah item dan total harga. Kamu bisa menambah atau mengurangi jumlah sebelum checkout.",
        ],
      },
      {
        heading: "3. Isi data pengiriman",
        paragraphs: [
          "Di halaman checkout, isi nama, nomor WhatsApp, alamat lengkap, dan waktu pengantaran. Pilih juga metode pembayaran yang kamu inginkan.",
        ],
      },
      {
        heading: "4. Kirim ke WhatsApp",
        paragraphs: [
          "Tekan tombol kirim pesanan. WhatsApp akan terbuka dengan detail pesanan yang sudah rapi. Admin akan mengonfirmasi ketersediaan, ongkos kirim, dan total pembayaran.",
        ],
      },
    ],
  },
  {
    slug: "nasi-mandhi-vs-nasi-kebuli",
    title: "Nasi Mandhi vs Nasi Kebuli: Apa Bedanya?",
    excerpt:
      "Sama-sama nasi rempah khas Timur Tengah, tapi rasa, warna, dan cara memasaknya berbeda. Yuk kenali keduanya.",
    image: "/images/menu/mix-half.webp",
    date: "2026-09-10",
    category: "Kuliner",
    body: [
      {
        paragraphs: [
          "Di menu kami, nasi mandhi dan nasi kebuli sering jadi pilihan yang bikin bingung. Keduanya sama-sama nasi berbumbu yang disajikan bersama ayam atau kambing, tapi karakternya cukup berbeda.",
        ],
      },
      {
        heading: "Nasi Mandhi",
        paragraphs: [
          "Nasi mandhi berasal dari Yaman, khususnya wilayah Hadramaut. Ciri khasnya adalah daging yang dimasak dengan panas tertutup sehingga empuk dan beraroma asap, sementara nasinya lebih ringan dengan warna kuning-putih dari rempah seperti kapulaga dan kunyit.",
          "Rasanya cenderung lebih lembut dan wangi, cocok untuk yang suka rasa rempah yang tidak terlalu berat.",
        ],
      },
      {
        heading: "Nasi Kebuli",
        paragraphs: [
          "Nasi kebuli dikenal luas di Indonesia melalui komunitas keturunan Arab. Nasinya dimasak dengan kaldu daging dan minyak samin, sehingga warnanya cokelat keemasan dan rasanya lebih gurih serta kaya rempah.",
        ],
      },
      {
        heading: "Bingung pilih? Coba Mix",
        paragraphs: [
          "Kalau makan rame-rame, menu Nasi Mix Mandhi & Kebuli jadi jalan tengah: satu nampan berisi dua jenis nasi dengan potongan ayam dan kambing. Tidak heran menu ini jadi best seller kami.",
        ],
      },
    ],
  },
  {
    slug: "tradisi-makan-nampan",
    title: "Makan Nampan: Tradisi Makan Bersama ala Timur Tengah",
    excerpt:
      "Satu nampan besar untuk dinikmati bersama. Lebih dari sekadar makan, ini tentang kebersamaan.",
    image: "/images/menu/mandhi-full-ayam.webp",
    date: "2026-09-05",
    category: "Budaya",
    body: [
      {
        paragraphs: [
          "Di banyak negara Timur Tengah, makan bersama dari satu nampan besar adalah hal biasa. Nasi ditata di atas nampan, lauk diletakkan di atasnya, lalu keluarga atau teman duduk melingkar dan menikmatinya bersama.",
        ],
      },
      {
        heading: "Pilih ukuran nampan",
        paragraphs: [
          "Nawwaf & Friends menyediakan ukuran ½ nampan dengan 5 potong lauk dan 1 nampan dengan 10 potong lauk. Pilihan lauknya ayam, kambing, atau campuran keduanya.",
          "Setiap nampan bisa dipesan dengan tambahan es teh pitcher supaya semua kebagian minum.",
        ],
      },
      {
        heading: "Cocok untuk berbagai acara",
        paragraphs: [
          "Nampan cocok untuk buka puasa bersama, arisan, syukuran, sampai makan siang kantor. Pesan antar ke rumah atau nikmati langsung di ruang private kami.",
        ],
      },
    ],
  },
  {
    slug: "mengenal-ummu-ali",
    title: "Mengenal Ummu Ali, Dessert Legendaris dari Mesir",
    excerpt:
      "Puding roti susu hangat dengan kacang dan kismis — penutup sempurna setelah menyantap nasi kebuli.",
    image: "/images/menu/ummu-ali.webp",
    date: "2026-08-28",
    category: "Kuliner",
    body: [
      {
        paragraphs: [
          "Ummu Ali adalah dessert tradisional Mesir yang terbuat dari potongan pastry atau roti yang direndam susu, lalu diberi kacang-kacangan dan kismis sebelum dipanggang hingga permukaannya keemasan.",
        ],
      },
      {
        heading: "Asal nama Ummu Ali",
        paragraphs: [
          "Nama Ummu Ali berarti \"ibunya Ali\". Kisah populer menyebut hidangan ini dibuat untuk merayakan sebuah kemenangan pada masa Kesultanan Mamluk, lalu dibagikan kepada rakyat hingga dikenal luas.",
        ],
      },
      {
        heading: "Cara terbaik menikmatinya",
        paragraphs: [
          "Ummu Ali paling nikmat disantap hangat. Padukan dengan secangkir Arabian tea atau teh adeni untuk pengalaman makan khas Timur Tengah yang lengkap.",
        ],
      },
    ],
  },
  {
    slug: "tips-pesan-catering-aqiqah",
    title: "Tips Memesan Catering & Aqiqah untuk Acara Keluarga",
    excerpt:
      "Mulai dari menentukan jumlah tamu hingga memilih paket all in one. Panduan singkat agar acara berjalan lancar.",
    image: "/images/menu/kebuli-full-kambing.webp",
    date: "2026-08-20",
    category: "Catering",
    body: [
      {
        paragraphs: [
          "Nawwaf & Friends menerima pesanan catering menu racikan Arab, prasmanan, nasi box, dan aneka arabian snack untuk acara kantor, pesta, hingga pernikahan. Kami juga melayani paket aqiqah all in one: menyembelih sekaligus memasak daging aqiqah.",
        ],
      },
      {
        heading: "Tentukan jumlah tamu lebih awal",
        paragraphs: [
          "Jumlah tamu menentukan pilihan format — nampan, prasmanan, atau nasi box. Semakin cepat kamu mengabari kami, semakin mudah menyiapkan menu dan jadwalnya.",
        ],
      },
      {
        heading: "Sesuaikan dengan budget",
        paragraphs: [
          "Sampaikan budget acara kepada admin. Kami akan membantu menyusun kombinasi menu yang pas tanpa mengorbankan rasa.",
        ],
      },
      {
        heading: "Hubungi kami",
        paragraphs: [
          "Untuk informasi dan pemesanan catering maupun aqiqah, hubungi 021-22962656 atau WhatsApp 0818 0744 7714.",
        ],
      },
    ],
  },
];

export function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
