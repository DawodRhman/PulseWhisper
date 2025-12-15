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
      },
      {
        type: "SERVICES",
        order: 1,
        content: {
          title: "Our Services",
          subtitle: "Comprehensive water and sewerage services for the city."
        }
      }
    ]
  };

  const existing = await prisma.page.findUnique({
    where: { slug: "home" },
    include: { sections: true }
  });

  if (existing) {
    console.log("🔄 Updating existing Home page...");
    // Delete existing sections to replace them with the new structure
    await prisma.pageSection.deleteMany({
      where: { pageId: existing.id }
    });
    
    await prisma.page.update({
      where: { id: existing.id },
      data: {
        sections: {
          create: homePage.sections.map(s => ({
            type: s.type,
            order: s.order,
            content: s.content
          }))
        }
      }
    });
    console.log("✅ Home page updated successfully.");
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
