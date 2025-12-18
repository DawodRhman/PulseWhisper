/**
 * Lightweight auto-translation helper.
 * If TRANSLATE_API_URL and TRANSLATE_API_KEY are provided, it will POST text for translation.
 * Otherwise, it simply echoes the source text so Urdu fields are at least populated.
 */

const TRANSLATE_API_URL = process.env.TRANSLATE_API_URL;
const TRANSLATE_API_KEY = process.env.TRANSLATE_API_KEY;
const TRANSLATE_API_MODEL = process.env.TRANSLATE_API_MODEL || "generic";

const canTranslate = Boolean(TRANSLATE_API_URL && TRANSLATE_API_KEY);

async function translateText(text, targetLang = "ur") {
  if (!text || typeof text !== "string") return text;
  if (!canTranslate) return text; // No external translator configured; return source.

  try {
    const res = await fetch(TRANSLATE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TRANSLATE_API_KEY}`,
      },
      body: JSON.stringify({
        text,
        targetLang,
        model: TRANSLATE_API_MODEL,
      }),
    });

    if (!res.ok) {
      return text;
    }

    const data = await res.json();
    return data?.translatedText || data?.translation || text;
  } catch (err) {
    console.warn("[autoTranslate] translation failed, falling back to source text:", err?.message || err);
    return text;
  }
}

async function translateNode(node, targetLang = "ur") {
  if (node == null) return node;

  if (Array.isArray(node)) {
    const mapped = [];
    for (const item of node) {
      mapped.push(await translateNode(item, targetLang));
    }
    return mapped;
  }

  if (typeof node === "object") {
    const cloned = { ...node };
    for (const [key, value] of Object.entries(cloned)) {
      if (typeof value === "string" && value.trim() && !key.endsWith("Ur")) {
        const urKey = `${key}Ur`;
        if (!cloned[urKey]) {
          cloned[urKey] = await translateText(value, targetLang);
        }
      } else if (typeof value === "object" && value !== null) {
        cloned[key] = await translateNode(value, targetLang);
      }
    }
    return cloned;
  }

  return node;
}

export async function autoTranslatePayload(payload, targetLang) {
  if (targetLang !== "ur") return payload;
  return translateNode(payload, targetLang);
}
