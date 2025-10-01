import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
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
        type: p.type as any,
        district: p.district,
        price_usd: p.price_usd as any,
      },
    });
  }
}

main().finally(() => prisma.$disconnect());
