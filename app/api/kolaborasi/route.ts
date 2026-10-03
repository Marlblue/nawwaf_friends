import { COLLAB_SCRIPT_URL } from "@/lib/forms/env";
import { handleFormSubmission } from "@/lib/forms/handler";
import { NAME_PATTERN, PHONE_PATTERN, normalizeIdPhone, type FieldRules } from "@/lib/forms/validate";

// Harus tetap sinkron dengan atribut input di components/CollaborationForm.tsx.
const RULES: FieldRules = {
  name: { required: true, minLength: 3, maxLength: 60, pattern: NAME_PATTERN },
  phone: { required: true, pattern: PHONE_PATTERN, normalize: normalizeIdPhone },
  // Bisa teks bebas saat pengaju memilih "Lainnya".
  platform: { required: true, minLength: 2, maxLength: 40 },
  username: { required: true, pattern: /^@[A-Za-z0-9._]{2,30}$/ },
  followers: { required: true, maxLength: 20, pattern: /^[0-9]+([.,][0-9]+)?\s?(k|rb|jt|m)?$/i },
  domicile: { required: true, minLength: 3, maxLength: 60 },
  message: { required: true, minLength: 10, maxLength: 1000 },
};

export async function POST(request: Request) {
  return handleFormSubmission(request, {
    label: "kolaborasi",
    scriptUrl: COLLAB_SCRIPT_URL,
    thankYou: "kolaborasi-kol",
    rules: RULES,
  });
}
