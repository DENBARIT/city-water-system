import { prisma } from '../src/config/db.js';
import { hashPassword } from '../src/utils/hashtoken.js';

async function main() {
  console.log('Seeding SUPER ADMIN...');

  // Ensure a default sub-city exists
  let subCity = await prisma.subCity.findFirst({
    where: { name: 'Addis Ababa' },
  });

  if (!subCity) {
    subCity = await prisma.subCity.create({
      data: {
        name: 'Addis Ababa',
      },
    });
    console.log('SubCity created:', subCity.name);
  }

  // Check if SUPER_ADMIN exists
  const existing = await prisma.user.findFirst({
    where: { role: 'SUPER_ADMIN' },
  });

  if (existing) {
    console.log('SUPER_ADMIN already exists');
    return;
  }

  const hashedPassword = await hashPassword('SuperAdmin@123');

  // Create SUPER_ADMIN
  const superAdmin = await prisma.user.create({
    data: {
      phoneE164: '+251900000000',
      nationalId: 'SUPERADMIN001',
      passwordHash: hashedPassword,
      email: 'superadmin@citywater.local',
      fullName: 'Addis Ababa Super Admin',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      subCityId: subCity.id,
    },
  });

  console.log('SUPER_ADMIN created:', superAdmin.phoneE164);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
