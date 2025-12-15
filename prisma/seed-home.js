const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Home Page...");

  const homePage = {
    title: "Home Page",
    slug: "home",
    isPublished: true,
    showInNavbar: false,
    sections: [
      {
        type: "HERO",
        order: 0,
        content: {
          title: "Committed to Deliver",
          subtitle: "Ensuring clean, safe water supply and efficient sewerage services for Karachi.",
          ctaLabel: "Learn About KW&SC",
          ctaHref: "/aboutus",
          backgroundImage: "/karachicharminar.gif"
        }
      }
    ]
  };

  const existing = await prisma.page.findUnique({ where: { slug: "home" } });

  if (existing) {
    console.log("⚠️ Home page already exists. Skipping.");
  } else {
    await prisma.page.create({
      data: {
        title: homePage.title,
        slug: homePage.slug,
        isPublished: homePage.isPublished,
        showInNavbar: homePage.showInNavbar,
        sections: {
          create: homePage.sections.map(s => ({
            type: s.type,
            order: s.order,
            content: s.content
          }))
        }
      }
    });
    console.log("✅ Home page created successfully.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
