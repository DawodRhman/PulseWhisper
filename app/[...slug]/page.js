import { notFound } from "next/navigation";
import { getPageWithFallback } from "@/lib/page-cache";
import PageRenderer from "@/components/PageBuilder/PageRenderer";

// Force dynamic rendering to ensure we get the latest content
export const dynamic = "force-dynamic";

async function getPage(slugArray) {
  if (!slugArray) {
    console.error("getPage called with undefined slugArray");
    return null;
  }
  const slug = slugArray.join("/");
  return await getPageWithFallback(slug);
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  if (!slug) return {};

  const page = await getPage(slug);
  
  if (!page) return {};

  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description,
    // Add other SEO fields as needed
  };
}

// Helper to localize content object recursively
function localizeContent(content, lang) {
  if (lang !== 'ur') return content;
  if (!content || typeof content !== 'object') return content;

  if (Array.isArray(content)) {
    return content.map(item => localizeContent(item, lang));
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
      newContent[key] = localizeContent(newContent[key], lang);
    }
  });

  return newContent;
}

export default async function DynamicPage({ params, searchParams }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  const resolvedSearchParams = await searchParams;

  if (!slug) {
    console.error("DynamicPage: slug is missing in params", resolvedParams);
    notFound();
  }

  const page = await getPage(slug);

  if (!page || !page.isPublished) {
    notFound();
  }

  // Handle localization
  const lang = resolvedSearchParams?.lang || 'en';
  const localizedSections = page.sections.map(section => ({
    ...section,
    content: localizeContent(section.content, lang),
  }));

  return (
    <main className="min-h-screen bg-white">
      <PageRenderer sections={localizedSections} />
    </main>
  );
}
