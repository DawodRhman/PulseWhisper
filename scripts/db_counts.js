const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const [serviceCategories, tenders, tenderCategories, newsArticles, careerOpenings, leadershipMembers, faqCount, socialLinks] =
    await Promise.all([
      prisma.serviceCategory.count(),
      prisma.tender.count(),
      prisma.tenderCategory.count(),
      prisma.newsArticle.count(),
      prisma.careerOpening.count(),
      prisma.leadershipMember.count(),
      prisma.faq.count(),
      prisma.socialLink.count(),
    ]);

  console.log({
    serviceCategories,
    tenders,
    tenderCategories,
    newsArticles,
    careerOpenings,
    leadershipMembers,
    faqCount,
    socialLinks,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
