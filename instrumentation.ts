import type { Instrumentation } from "next";

// Error server (render, route handler, server action) dikabarkan ke grup Telegram lewat
// webhook yang sama dengan alert form dan deploy. Sebelumnya error seperti ini cuma
// tercatat di log Passenger, dan uptime.yml hanya tahu beranda masih hidup.
export const onRequestError: Instrumentation.onRequestError = async (err, request, context) => {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { ringkasErrorServer } = await import("./lib/server-error-alert");
  const { alertOps } = await import("./lib/ops-alert");
  const ringkasan = ringkasErrorServer(err, request, context);
  if (ringkasan) alertOps(ringkasan.key, ringkasan.pesan);
};
