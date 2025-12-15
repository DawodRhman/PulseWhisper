import crypto from "crypto";
import prisma from "@/lib/prisma";
import fs from 'fs/promises';
import path from 'path';

const DEFAULT_TTL_MS = Number(process.env.SNAPSHOT_TTL_MS || 1000 * 60 * 15);
const SNAPSHOT_DIR = path.join(process.cwd(), 'data', 'cache', 'snapshots');

async function ensureSnapshotDir() {
  try {
    await fs.access(SNAPSHOT_DIR);
  } catch {
    await fs.mkdir(SNAPSHOT_DIR, { recursive: true });
  }
}

export async function resolveWithSnapshot(module, fetcher) {
  await ensureSnapshotDir();
  const fileCachePath = path.join(SNAPSHOT_DIR, `${module}.json`);

  try {
    const data = await fetcher();
    const checksum = crypto
      .createHash("sha256")
      .update(JSON.stringify(data))
      .digest("hex");

    // Update DB Cache
    await prisma.cachedSnapshot.upsert({
      where: { module },
      update: {
        payload: data,
        checksum,
        fetchedAt: new Date(),
        expiresAt: new Date(Date.now() + DEFAULT_TTL_MS),
      },
      create: {
        module,
        payload: data,
        checksum,
        expiresAt: new Date(Date.now() + DEFAULT_TTL_MS),
      },
    }).catch(err => {
      console.warn(`⚠️ Failed to cache snapshot for ${module} in DB: ${err.message}`);
    });

    // Update File Cache
    await fs.writeFile(fileCachePath, JSON.stringify(data, null, 2)).catch(err => {
      console.warn(`⚠️ Failed to write file cache for ${module}: ${err.message}`);
    });

    return { data, stale: false };
  } catch (error) {
    console.warn(`⚠️ Fetcher failed for ${module}, trying caches...`);
    
    // 1. Try DB Cache
    try {
      const snapshot = await prisma.cachedSnapshot.findUnique({ where: { module } });
      if (snapshot?.payload) {
        return { data: snapshot.payload, stale: true, error };
      }
    } catch (dbError) {
      console.warn(`⚠️ Failed to retrieve DB cache for ${module}: ${dbError.message}`);
    }

    // 2. Try File Cache
    try {
      const fileContent = await fs.readFile(fileCachePath, 'utf-8');
      const fileData = JSON.parse(fileContent);
      console.log(`📦 Served ${module} from file cache`);
      return { data: fileData, stale: true, error };
    } catch (fsError) {
      console.warn(`⚠️ Failed to retrieve file cache for ${module}: ${fsError.message}`);
    }
    
    // If we are here, everything failed.
    throw error;
  }
}

export async function purgeSnapshot(module) {
  if (!module) return;
  await prisma.cachedSnapshot
    .delete({ where: { module } })
    .catch((error) => {
      if (error.code !== "P2025") {
        throw error;
      }
    });

  try {
    await ensureSnapshotDir();
    const fileCachePath = path.join(SNAPSHOT_DIR, `${module}.json`);
    await fs.unlink(fileCachePath);
  } catch {
    // Ignore if file cache does not exist or cannot be removed
  }
}
