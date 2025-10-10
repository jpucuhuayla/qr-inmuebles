import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Hash password for admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
    },
  });

  console.log('✅ Admin user created:', admin.username);

  // Create sample properties
  const properties = await Promise.all([
    prisma.property.upsert({
      where: { slug: 'departamento-san-miguel' },
      update: {},
      create: {
        slug: 'departamento-san-miguel',
        title: 'Departamento San Miguel',
        type: 'departamento',
        district: 'San Miguel',
        price_usd: 150000,
        status: 'disponible',
      },
    }),
    prisma.property.upsert({
      where: { slug: 'departamento-surco' },
      update: {},
      create: {
        slug: 'departamento-surco',
        title: 'Departamento Surco',
        type: 'departamento',
        district: 'Surco',
        price_usd: 200000,
        status: 'disponible',
      },
    }),
    prisma.property.upsert({
      where: { slug: 'departamento-surquillo' },
      update: {},
      create: {
        slug: 'departamento-surquillo',
        title: 'Departamento Surquillo',
        type: 'departamento',
        district: 'Surquillo',
        price_usd: 120000,
        status: 'disponible',
      },
    }),
    prisma.property.upsert({
      where: { slug: 'estacionamientos-surquillo' },
      update: {},
      create: {
        slug: 'estacionamientos-surquillo',
        title: 'Estacionamientos Surquillo (22)',
        type: 'estacionamiento',
        district: 'Surquillo',
        price_usd: 15000,
        status: 'disponible',
      },
    }),
  ]);

  console.log('✅ Sample properties created:', properties.length);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
