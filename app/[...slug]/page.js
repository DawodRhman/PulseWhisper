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

export default async function DynamicPage({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  if (!slug) {
    console.error("DynamicPage: slug is missing in params", resolvedParams);
    notFound();
  }

  const page = await getPage(slug);

  if (!page || !page.isPublished) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <PageRenderer sections={page.sections} />
    </main>
  );
}
