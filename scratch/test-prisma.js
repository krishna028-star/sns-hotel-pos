const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Testing Prisma User Creation...');
  try {
    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: `test-${Date.now()}@example.com`,
        passwordHash: "password123",
        role: "worker",
        tenantId: "cmnu5cjcz0000ii04gwu2kkcv", // Existing tenant ID from your error
        staffId: "TEST-001",
        age: 25,
        salary: 20000,
        remarks: "test remark"
      }
    });
    console.log('✅ Success! User created:', user.id);
  } catch (error) {
    console.error('❌ Prisma Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
