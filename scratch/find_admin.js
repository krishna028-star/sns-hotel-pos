
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const mainAdmin = await prisma.user.findFirst({
    where: { role: 'main_admin' },
    include: { tenant: true }
  });
  
  if (mainAdmin) {
    console.log('MAIN_ADMIN_FOUND:' + JSON.stringify(mainAdmin));
  } else {
    console.log('MAIN_ADMIN_NOT_FOUND');
  }

  const userCount = await prisma.user.count();
  console.log('TOTAL_USERS:' + userCount);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
