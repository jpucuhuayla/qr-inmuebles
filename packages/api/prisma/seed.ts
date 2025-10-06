import { PrismaClient, PropertyType } from "@prisma/client";
import * as bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  try {
    const props = [
      { slug: "departamento-san-miguel", title: "Departamento San Miguel", type: "departamento", district: "San Miguel", price_usd: 0 },
      { slug: "departamento-surco", title: "Departamento Surco", type: "departamento", district: "Surco", price_usd: 0 },
      { slug: "departamento-surquillo", title: "Departamento Surquillo", type: "departamento", district: "Surquillo", price_usd: 0 },
      { slug: "estacionamientos-surquillo", title: "Estacionamientos Surquillo (22)", type: "estacionamiento", district: "Surquillo", price_usd: 0 },
    ];

    for (const p of props) {
      await prisma.property.upsert({
        where: { slug: p.slug },
        update: {},
        create: {
          slug: p.slug,
          title: p.title,
          type: p.type as PropertyType,
          district: p.district,
          price_usd: p.price_usd,
        },
      });
    }

    console.log("Seeding admin user...");

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await prisma.user.upsert({
      where: { username: "admin" },
      update: {},
      create: {
        username: "admin",
        password: hashedPassword,
      },
    });

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
