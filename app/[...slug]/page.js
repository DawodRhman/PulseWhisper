import { notFound } from "next/navigation";
import { getPageWithFallback } from "@/lib/page-cache";
import PageRenderer from "@/components/PageBuilder/PageRenderer";
import { recursivelyLocalizeContent } from "@/lib/utils";

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

export async function generateMetadata({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const { slug } = resolvedParams;
  const lang = resolvedSearchParams?.lang || 'en';

  if (!slug) return {};

  const page = await getPage(slug);

  if (!page) return {};

  const localizedPage = recursivelyLocalizeContent(page, lang);

  return {
    title: localizedPage.seo?.title || localizedPage.title,
    description: localizedPage.seo?.description,
    // Add other SEO fields as needed
  };
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
  console.log(`[DynamicPage] Processing slug: ${slug}, lang: ${lang}`);

  const localizedSections = page.sections.map(section => {
    const localized = recursivelyLocalizeContent(section.content, lang);
    return {
      ...section,
      content: localized,
    };
  });

  return (
    <main className="min-h-screen bg-white">
      <PageRenderer sections={localizedSections} />
    </main>
  );
}
