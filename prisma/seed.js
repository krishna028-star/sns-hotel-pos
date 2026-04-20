const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- SNS Hotels POS: Data Cleansing & Live Prep ---');

  // 1. Delete all data (Order of deletion matters for FK constraints)
  console.log('Cleaning existing data...');
  
  // Financials & Logs
  await prisma.auditLog.deleteMany({});
  await prisma.cashierShift.deleteMany({});
  await prisma.payment.deleteMany({});
  
  // Operations
  await prisma.kOT.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.table.deleteMany({});
  
  // Inventory
  await prisma.theftReport.deleteMany({});
  await prisma.purchaseOrder.deleteMany({});
  await prisma.inventoryItem.deleteMany({});
  await prisma.supplier.deleteMany({});
  
  // Settings
  await prisma.policy.deleteMany({});
  
  // Core structure
  await prisma.user.deleteMany({});
  await prisma.hotel.deleteMany({});
  await prisma.franchise.deleteMany({});
  await prisma.tenant.deleteMany({});

  console.log('Data cleared successfully.');

  // 2. Seed Default Production Environment
  console.log('Seeding initial production admin and tenant...');

  // Create Default Tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: 'SNS Hotels Group',
      domain: 'sns-hotels.com',
      plan: 'enterprise',
      status: 'active'
    }
  });

  // Create Default Franchise
  const franchise = await prisma.franchise.create({
    data: {
      name: 'Global Operations',
      tenantId: tenant.id
    }
  });

  // Create Default Hotel
  const hotel = await prisma.hotel.create({
    data: {
      name: 'SNS Grand Palace',
      tenantId: tenant.id,
      franchiseId: franchise.id,
      address: '123 Luxury Way, Tech City',
      phoneNumber: '+91 99999 88888'
    }
  });

  // Create/Update Main Admin
  const adminEmail = 'admin@sns.com';
  const mainAdmin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: 'main_admin',
      name: 'SNS Main Admin',
      tenantId: tenant.id,
      hotelId: hotel.id,
      passwordHash: 'admin123', // Keep it simple for testing as per existing E2E
      isActive: true,
      staffId: 'SNS-ADM-001'
    },
    create: {
      email: adminEmail,
      role: 'main_admin',
      name: 'SNS Main Admin',
      tenantId: tenant.id,
      hotelId: hotel.id,
      passwordHash: 'admin123',
      isActive: true,
      staffId: 'SNS-ADM-001'
    }
  });

  // Create Test Users for all roles
  const roles = [
    { role: 'main_client', email: 'client@sns.com', name: 'SNS Client', pass: 'client123', staffId: 'SNS-CLI-001' },
    { role: 'franchise_head', email: 'franchise@sns.com', name: 'SNS Franchise Head', pass: 'fran123', staffId: 'SNS-FRH-001' },
    { role: 'hotel_manager', email: 'manager@sns.com', name: 'SNS Manager', pass: 'manager123', staffId: 'SNS-MGR-001' },
    { role: 'inventory_manager', email: 'inventory@sns.com', name: 'SNS Inv Manager', pass: 'inv123', staffId: 'SNS-INV-001' },
    { role: 'cashier', email: 'cashier@sns.com', name: 'SNS Cashier', pass: 'cash123', staffId: 'SNS-CSH-001' },
    { role: 'chef', email: 'chef@sns.com', name: 'SNS Chef', pass: 'chef123', staffId: 'SNS-CHF-001' },
    { role: 'worker', email: 'worker@sns.com', name: 'SNS Waiter', pass: 'work123', staffId: 'SNS-WKR-001' },
    { role: 'customer', email: 'customer@sns.com', name: 'SNS Customer', pass: 'cust123', staffId: 'SNS-CUST-001' },
  ];

  for (const r of roles) {
    await prisma.user.upsert({
      where: { email: r.email },
      update: { role: r.role, name: r.name, passwordHash: r.pass, tenantId: tenant.id, hotelId: hotel.id, staffId: r.staffId },
      create: { email: r.email, role: r.role, name: r.name, passwordHash: r.pass, tenantId: tenant.id, hotelId: hotel.id, staffId: r.staffId }
    });
  }

  // Create some default tables
  await prisma.table.createMany({
    data: [
      { number: 'G1', capacity: 4, floor: 'Ground', hotelId: hotel.id },
      { number: 'G2', capacity: 4, floor: 'Ground', hotelId: hotel.id },
      { number: 'T1', capacity: 6, floor: 'Terrace', hotelId: hotel.id },
    ]
  });

  console.log('Test users and tables created.');
  console.log('--- Prep Complete ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
