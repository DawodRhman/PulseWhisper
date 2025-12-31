const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Fetching Water Today Updates...");
        const updates = await prisma.waterTodayUpdate.findMany({
            orderBy: { publishedAt: 'desc' },
            include: { media: true },
        });
        console.log(`Found ${updates.length} updates.`);
        updates.forEach(u => {
            console.log(`- [${u.status}] ${u.title} (Published: ${u.publishedAt})`);
        });
    } catch (e) {
        console.error("Error fetching updates:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
