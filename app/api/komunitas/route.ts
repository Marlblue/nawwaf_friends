import { COMMUNITY_SCRIPT_URL } from "@/lib/forms/env";
import { handleFormSubmission } from "@/lib/forms/handler";
import { COUNT_PATTERN, NAME_PATTERN, PHONE_PATTERN, normalizeIdPhone, type FieldRules } from "@/lib/forms/validate";

// Harus tetap sinkron dengan atribut input di components/CommunityForm.tsx.
const RULES: FieldRules = {
  communityName: { required: true, minLength: 3, maxLength: 80 },
  social: { required: true, minLength: 3, maxLength: 100 },
  domicile: { required: true, minLength: 3, maxLength: 60 },
  members: { required: true, pattern: COUNT_PATTERN },
  // Kategori & bentuk kolaborasi bisa teks bebas saat memilih "Lainnya".
  category: { required: true, minLength: 3, maxLength: 60 },
  picName: { required: true, minLength: 3, maxLength: 60, pattern: NAME_PATTERN },
  phone: { required: true, pattern: PHONE_PATTERN, normalize: normalizeIdPhone },
  activity: { required: true, minLength: 10, maxLength: 1000 },
  participants: { required: true, pattern: COUNT_PATTERN },
  eventDate: { maxLength: 10, pattern: /^\d{4}-\d{2}-\d{2}$/ },
  collabType: { required: true, minLength: 3, maxLength: 60 },
  concept: { required: true, minLength: 10, maxLength: 1000 },
};

export async function POST(request: Request) {
  return handleFormSubmission(request, {
    label: "komunitas",
    scriptUrl: COMMUNITY_SCRIPT_URL,
    thankYou: "komunitas",
    rules: RULES,
  });
}
