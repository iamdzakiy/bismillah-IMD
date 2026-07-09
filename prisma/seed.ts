import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@imd-itb.com' },
    update: {},
    create: {
      email: 'admin@imd-itb.com',
      name: 'Super Admin',
      password: hashedPassword,
      role: 'ADMIN',
      active: true,
      educationLevel: 'S1',
    },
  });

  console.log('✅ Admin created:', admin.email);
  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });