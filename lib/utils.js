import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

import DOMPurify from 'isomorphic-dompurify';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function sanitize(html) {
  if (typeof html !== 'string') return html;
  return DOMPurify.sanitize(html);
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
  const isSindhi = lang === 'sd';
  const isRtl = isUrdu || isSindhi;
  const resolved = { ...item };

  keys.forEach(key => {
    const urKey = `${key}Ur`;
    const sdKey = `${key}Sd`;
    if (isUrdu && item[urKey]) {
      resolved[key] = item[urKey];
    } else if (lang === 'sd' && item[sdKey]) {
      resolved[key] = item[sdKey];
    }
  });

  return resolved;
}

export function recursivelyLocalizeContent(content, lang) {
  if (lang !== 'ur' && lang !== 'sd') return content;
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

      // Only apply Ur if lang is 'ur'
      if (lang === 'ur' && newContent[key]) {
        newContent[baseKey] = newContent[key];
      }
    }

    // If we find a key ending in 'Sd' (e.g. titleSd)
    if (key.endsWith('Sd') && key.length > 2) {
      const baseKey = key.slice(0, -2); // e.g. title

      // Only apply Sd if lang is 'sd'
      if (lang === 'sd' && newContent[key]) {
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
