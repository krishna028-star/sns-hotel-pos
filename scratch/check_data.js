
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Fetching users...');
  const users = await prisma.user.findMany({
    include: { tenant: true }
  });
  console.log('Current Users:', JSON.stringify(users, null, 2));

  console.log('Fetching tenants...');
  const tenants = await prisma.tenant.findMany();
  console.log('Current Tenants:', JSON.stringify(tenants, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
