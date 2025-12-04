const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const pages = await prisma.page.findMany();
  console.log("Pages in DB:", pages.length);
  pages.forEach(p => console.log(`- ${p.title} (${p.slug})`));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
