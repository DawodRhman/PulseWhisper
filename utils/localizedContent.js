import { useTranslation } from "react-i18next";

// Pick a field from a multilingual item with fallbacks.
export function getLocalizedField(item, field, locale, fallbackLocale = "en") {
  if (!item) return "";

  // Preferred: locales object from API
  const locales = item.locales || {};
  const localizedValue = locales?.[locale]?.[field];
  if (localizedValue) return localizedValue;

  // Backward compatibility: flat Urdu keys like titleUr/descriptionUr
  if (locale === "ur" && item[`${field}Ur`]) return item[`${field}Ur`];

  // Fallback: default locale from locales object
  const fallbackValue = locales?.[fallbackLocale]?.[field];
  if (fallbackValue) return fallbackValue;

  // Last resort: base field if present
  return item[field] || "";
}

// Custom hook to extract multiple fields plus direction info.
export function useLocalizedFields(item, fields, fallbackLocale = "en") {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const dir = i18n.dir(locale);

  const localized = fields.reduce((acc, field) => {
    acc[field] = getLocalizedField(item, field, locale, fallbackLocale);
    return acc;
  }, {});

  return { locale, dir, ...localized };
}
