import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Document types
  const types = ['Lege', 'Hotărâre Guvern', 'Hotărâre Parlament', 'Decret Prezidențial',
    'Ordin', 'Regulament', 'Instrucțiune', 'Cod', 'Tratat Internațional', 'Constituție'];

  for (const [i, nameRo] of types.entries()) {
    await prisma.documentType.upsert({
      where: { nameRo },
      create: { nameRo, sortOrder: i },
      update: {},
    });
  }

  // Emitents
  const emitents = [
    'Parlamentul Republicii Moldova',
    'Guvernul Republicii Moldova',
    'Președintele Republicii Moldova',
    'Ministerul Justiției',
    'Ministerul Finanțelor',
    'Ministerul Educației și Cercetării',
    'Ministerul Sănătății',
    'Banca Națională a Moldovei',
    'Curtea Constituțională',
    'Curtea Supremă de Justiție',
  ];

  for (const nameRo of emitents) {
    await prisma.emitent.upsert({
      where: { id: emitents.indexOf(nameRo) + 1 },
      create: { nameRo },
      update: {},
    });
  }

  // Admin user
  const adminPassword = await bcrypt.hash('Admin@2024!', 12);
  await prisma.user.upsert({
    where: { email: 'admin@portal.md' },
    create: {
      email: 'admin@portal.md',
      name: 'Administrator',
      password: adminPassword,
      role: UserRole.ADMIN,
    },
    update: {},
  });

  console.log('Seed completed!');
  console.log('Admin: admin@portal.md / Admin@2024!');
}

main().finally(() => prisma.$disconnect());
