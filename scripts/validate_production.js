const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test_production_flow() {
  console.log("--- STARTING PRODUCTION FLOW TEST ---");
  
  // 1. Get Users
  const manager = await prisma.user.findUnique({ where: { email: 'manager@test.com' } });
  const worker = await prisma.user.findUnique({ where: { email: 'worker@test.com' } });
  
  if (!manager || !worker) {
    console.error("Test users not found. Run seed script first.");
    return;
  }
  
  const hotelId = manager.hotelId;

  // 2. Manager adds Menu Item
  console.log("2. Adding Menu Item...");
  const menuItem = await prisma.menuItem.create({
    data: {
      name: "Gold Burger " + Date.now(),
      price: 450,
      category: "Main Course",
      hotelId: hotelId,
      image: "🍔"
    }
  });

  // 3. Manager adds Table
  console.log("3. Adding Table...");
  const table = await prisma.table.create({
    data: {
      number: "T-" + Math.floor(Math.random() * 1000),
      capacity: 4,
      hotelId: hotelId
    }
  });

  // 4. Worker creates Order
  console.log("4. Creating Order...");
  const order = await prisma.order.create({
    data: {
      hotelId: hotelId,
      tableId: table.id,
      waiterId: worker.id,
      totalAmount: 450,
      status: "pending",
      items: {
        create: [
          { name: menuItem.name, quantity: 1, price: 450 }
        ]
      }
    }
  });

  console.log("SUCCESS: Simulation complete.");
  console.log(`- MenuItem ID: ${menuItem.id}`);
  console.log(`- Table ID: ${table.id}`);
  console.log(`- Order ID: ${order.id}`);

}

test_production_flow()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
