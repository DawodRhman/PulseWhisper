"use strict";

// Seed only navigation metadata (no table resets)
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const NAV_ENTRIES = [
  { slug: "whatwedo", navLabel: "What We Do", navGroup: null, showInNavbar: true },
  { slug: "ourservices", navGroup: "whatwedo", showInNavbar: true },
  { slug: "portfolio", navGroup: "whatwedo", showInNavbar: true },
  { slug: "workwithus", navGroup: "whatwedo", showInNavbar: true },
  { slug: "news", navGroup: "whatwedo", showInNavbar: true, navLabel: "News & Updates" },
  { slug: "right-to-information", navGroup: "whatwedo", showInNavbar: true, navLabel: "Right to Information" },

  { slug: "aboutus", navLabel: "About Us", navGroup: null, showInNavbar: true },
  { slug: "watertodaysection", navGroup: "aboutus", showInNavbar: true, navLabel: "Water Today" },
  { slug: "achievements", navGroup: "aboutus", showInNavbar: true },
  { slug: "ourleadership", navGroup: "aboutus", showInNavbar: true, navLabel: "Our Leadership" },
  { slug: "careers", navGroup: "aboutus", showInNavbar: true },
  { slug: "faqs", navGroup: "aboutus", showInNavbar: true },

  { slug: "tenders", navGroup: null, showInNavbar: true },
  { slug: "education", navGroup: null, showInNavbar: true },
  { slug: "contact", navGroup: null, showInNavbar: true },
];

async function seedNav() {
  console.log("Seeding navbar metadata (non-destructive)...");

  for (const entry of NAV_ENTRIES) {
    const { slug, navLabel, navGroup, showInNavbar } = entry;
    const page = await prisma.page.findUnique({ where: { slug } });
    if (!page) {
      console.warn(`- Skipped missing page '${slug}'`);
      continue;
    }

    await prisma.page.update({
      where: { id: page.id },
      data: {
        showInNavbar: showInNavbar ?? page.showInNavbar,
        navLabel: navLabel ?? page.navLabel ?? null,
        navGroup: navGroup ?? page.navGroup ?? null,
      },
    });

    console.log(`- Updated nav for /${slug} (${navGroup ? `group: ${navGroup}` : "top-level"})`);
  }

  console.log("Navbar seed completed.");
}

seedNav()
  .catch((err) => {
    console.error("Navbar seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
