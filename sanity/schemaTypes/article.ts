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
      name: "seo",
      title: "SEO",
      type: "object",
      description: "Semua opsional: yang kosong memakai Judul dan Ringkasan.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "seoTitle",
          title: "SEO Title",
          type: "string",
          description: "Judul di tab browser & hasil Google, tampil apa adanya (tanpa tambahan nama resto). Maks. 60 karakter.",
          validation: (rule) => rule.max(60).warning(),
        }),
        defineField({
          name: "metaDescription",
          title: "Meta Description",
          type: "text",
          rows: 2,
          description: "150-160 karakter. Kosongkan untuk memakai Ringkasan.",
          validation: (rule) => rule.max(160).warning(),
        }),
        defineField({ name: "focusKeyword", title: "Focus Keyword", type: "string" }),
        defineField({
          name: "secondaryKeywords",
          title: "Secondary Keywords",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
          options: { layout: "tags" },
        }),
        defineField({ name: "ogTitle", title: "OG Title (Facebook/WhatsApp)", type: "string" }),
        defineField({ name: "ogDescription", title: "OG Description (Facebook/WhatsApp)", type: "text", rows: 2 }),
        defineField({ name: "twitterTitle", title: "Twitter Title", type: "string" }),
        defineField({ name: "twitterDescription", title: "Twitter Description", type: "text", rows: 2 }),
        defineField({
          name: "faq",
          title: "FAQ",
          type: "array",
          description: "Tidak tampil di halaman; hanya dikirim sebagai FAQ schema untuk Google.",
          of: [
            defineArrayMember({
              type: "object",
              name: "faqItem",
              fields: [
                defineField({ name: "question", title: "Pertanyaan", type: "string", validation: (rule) => rule.required() }),
                defineField({ name: "answer", title: "Jawaban", type: "text", rows: 3, validation: (rule) => rule.required() }),
              ],
              preview: { select: { title: "question" } },
            }),
          ],
        }),
      ],
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
