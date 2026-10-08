import { defineArrayMember, defineField, defineType } from "sanity";

export const article = defineType({
  name: "article",
  title: "Artikel",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Judul",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (untuk URL)",
      type: "slug",
      description: "Huruf kecil, kata dipisah tanda hubung. Klik Generate untuk membuat dari judul.",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "string",
      description: "Tampil di atas judul, mis. Kuliner, Info Order, Catering, Budaya.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Ringkasan",
      type: "text",
      rows: 3,
      description: "Tampil di kartu artikel dan sebagai deskripsi di Google. Maks. 240 karakter.",
      validation: (rule) => rule.required().max(240),
    }),
    defineField({
      name: "coverImage",
      title: "Gambar Sampul",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Deskripsi singkat isi gambar, untuk pembaca layar dan SEO.",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "content",
      title: "Isi Artikel",
      type: "array",
      // Style dibatasi ke yang punya perender di app/(site)/artikel/[slug]/page.tsx; style lain
      // akan tampil sebagai paragraf biasa di situs walaupun terlihat beda di Studio.
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading", value: "h2" },
            { title: "Sub Heading", value: "h3" },
            { title: "Kutipan", value: "blockquote" },
          ],
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Tanggal Terbit",
      type: "datetime",
      description: "Kosongkan untuk memakai tanggal artikel ini dibuat. Isi hanya kalau perlu tanggal lain.",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "Tampil besar di paling atas halaman /artikel. Kalau tidak ada, artikel terbaru yang dipakai.",
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: "Tanggal terbit, terbaru",
      name: "publishedAtDesc",
      by: [
        { field: "publishedAt", direction: "desc" },
        { field: "_createdAt", direction: "desc" },
      ],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "coverImage" },
  },
});
