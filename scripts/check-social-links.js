const { PrismaClient } = require("@prisma/client");

(async () => {
  const prisma = new PrismaClient();
  try {
    const count = await prisma.socialLink.count();
    const sample = await prisma.socialLink.findMany({
      orderBy: { order: "asc" },
      select: { title: true, platform: true },
    });
    console.log("socialLinks:", count, sample);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
})();
