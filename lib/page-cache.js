import fs from 'fs/promises';
import path from 'path';
import prisma from "@/lib/prisma";

const CACHE_DIR = path.join(process.cwd(), 'data', 'cache', 'pages');

async function ensureCacheDir() {
  try {
    await fs.access(CACHE_DIR);
  } catch {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  }
}

export async function getPageWithFallback(slug) {
  // Ignore static assets and uploads
  if (
    slug.toString().includes('uploads/') ||
    slug.toString().includes('leaders/') ||
    slug.toString().match(/\.(jpg|jpeg|png|gif|svg|ico|css|js)$/i)
  ) {
    return null;
  }

  await ensureCacheDir();
  const cacheKey = String(slug).toLowerCase().replace(/[^a-z0-9-]/g, '_');
  const cachePath = path.join(CACHE_DIR, `${cacheKey}.json`);

  try {
    // 1. Try to fetch from DB
    const page = await prisma.page.findUnique({
      where: { slug },
      include: {
        sections: {
          orderBy: { order: "asc" },
        },
        seo: true,
      },
    });

    if (page) {
      // 2. If success, write to cache
      await fs.writeFile(cachePath, JSON.stringify(page, null, 2));
      return page;
    }
  } catch (error) {
    console.warn(`⚠️ DB fetch failed for page '${slug}', trying file cache: ${error.message}`);
  }

  // 3. If DB failed or returned null (though if null we might not want to cache null?), 
  // or if we are here after catch: try to read from cache
  try {
    const cacheContent = await fs.readFile(cachePath, 'utf-8');
    const cachedPage = JSON.parse(cacheContent);
    console.log(`📦 Served page '${slug}' from file cache`);
    return cachedPage;
  } catch (fsError) {
    console.warn(`⚠️ File cache miss for page '${slug}': ${fsError.message}`);
    return null;
  }
}
