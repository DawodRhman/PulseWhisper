import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const role = 1;

/**
 * Resolves localized content for an object.
 * Checks for `[key]Ur` if lang is 'ur', otherwise falls back to `[key]`.
 * @param {Object} item - The object containing data
 * @param {string} lang - The language code ('en' or 'ur')
 * @param {string[]} keys - The keys to resolve (default: title, summary, description, etc)
 */
export function resolveLocalizedContent(item, lang, keys = ['title', 'summary', 'description', 'heading', 'body', 'scope', 'eyebrow', 'subtitle', 'ctaLabel', 'designation', 'bio', 'question', 'answer', 'label', 'caption']) {
  if (!item) return item;
  const isUrdu = lang === 'ur';
  const resolved = { ...item };

  keys.forEach(key => {
    const urKey = `${key}Ur`;
    if (isUrdu && item[urKey]) {
      resolved[key] = item[urKey];
    }
  });

  return resolved;
}

export function recursivelyLocalizeContent(content, lang) {
  if (lang !== 'ur') return content;
  if (!content || typeof content !== 'object') return content;

  if (Array.isArray(content)) {
    return content.map(item => recursivelyLocalizeContent(item, lang));
  }

  const newContent = { ...content };
  const keys = Object.keys(newContent);

  keys.forEach(key => {
    // If we find a key ending in 'Ur' (e.g. titleUr)
    if (key.endsWith('Ur') && key.length > 2) {
      const baseKey = key.slice(0, -2); // e.g. title
      // Check if the base key exists or is intended (it usually is if Ur exists)
      // We overwrite the base key with the Ur value if it has content
      if (newContent[key]) {
        newContent[baseKey] = newContent[key];
      }
    }

    // Recursive call for nested objects/arrays
    if (typeof newContent[key] === 'object' && newContent[key] !== null) {
      newContent[key] = recursivelyLocalizeContent(newContent[key], lang);
    }
  });

  return newContent;
}
