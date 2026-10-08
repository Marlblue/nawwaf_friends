import { revalidateTag } from "next/cache";
import { parseBody } from "next-sanity/webhook";
import { ARTICLE_TAG } from "@/lib/sanity/queries";

/**
 * Webhook Sanity -> cache artikel langsung dibuang, jadi artikel yang baru dipublish tampil
 * tanpa menunggu revalidate 60 detik.
 *
 * Dibuat di sanity.io/manage -> project -> API -> Webhooks:
 * URL https://nawwafresto.com/api/revalidate, filter `_type == "article"`, trigger
 * create/update/delete, secret = SANITY_REVALIDATE_SECRET (diisi di env cPanel).
 */
export async function POST(request: Request) {
  // Ditolak sebelum parseBody: tanpa secret, parseBody tidak memeriksa tanda tangan sama sekali.
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    console.error("SANITY_REVALIDATE_SECRET belum di-set; webhook revalidate ditolak.");
    return new Response("Revalidate not configured", { status: 503 });
  }

  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(
      request as Parameters<typeof parseBody>[0],
      secret,
    );
    if (isValidSignature === null) return new Response("Missing signature", { status: 401 });
    if (!isValidSignature) return new Response("Invalid signature", { status: 401 });
    if (!body?._type) return new Response("Bad Request", { status: 400 });

    revalidateTag(ARTICLE_TAG, "max");
    return Response.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    console.error("Sanity revalidate webhook gagal:", err);
    return new Response("Revalidate failed", { status: 500 });
  }
}
