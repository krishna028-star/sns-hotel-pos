import { prisma } from '../src/lib/db';
import { fetchUsers, createDbUser } from '../src/app/actions/authActions';
import { fetchTenants, createDbTenant } from '../src/app/actions/tenantActions';
import { sendTenantNotification, fetchUserNotifications } from '../src/lib/serverNotifications';

async function runTests() {
  console.log("=== SNS POS Exhaustive Testing ===");
  console.log("1. Cleaning up any test data...");
  const testTenantPrefix = "TESTINC_";
  
  // Cleanup
  await prisma.notification.deleteMany({ where: { message: { contains: '[TEST]' } } });
  await prisma.user.deleteMany({ where: { email: { contains: 'test.com' } } });
  await prisma.tenant.deleteMany({ where: { name: { startsWith: testTenantPrefix } } });

  try {
    // ----------------------------------------
    console.log("\n[Main Admin] Role 1");
    // Ensure a base tenant exists for the admin
    let baseTenant = await prisma.tenant.findFirst({ where: { name: 'SNS Hotels Group' } });
    if (!baseTenant) {
      baseTenant = await prisma.tenant.create({ data: { name: 'SNS Hotels Group', plan: 'enterprise' } });
    }

    const admin = await prisma.user.upsert({
      where: { email: 'admin_test@test.com' },
      update: { tenantId: baseTenant.id },
      create: { name: 'Main Admin', email: 'admin_test@test.com', passwordHash: 'pwd', role: 'main_admin', tenantId: baseTenant.id }
    });

    const tenantRes = await createDbTenant(admin.id, { name: `${testTenantPrefix}Corp`, plan: 'enterprise' });
    if (!tenantRes.ok) throw new Error("Main Admin failed to create tenant: " + tenantRes.error);
    const tenantId = tenantRes.tenant.id;
    console.log("✅ Main Admin successfully created a tenant.");

    // ----------------------------------------
    console.log("\n[Main Client] Role 2");
    // We need a dummy hotelId for user creation because of FK constraints
    let dummyHotel = await prisma.hotel.findFirst({ where: { tenantId } });
    if (!dummyHotel) {
        dummyHotel = await prisma.hotel.create({ data: { name: 'Test Hotel', tenantId } });
    }

    const clientRes = await createDbUser(admin.id, { name: 'Test Client', email: 'client@test.com', role: 'main_client', tenantId, hotelId: dummyHotel.id });
    if (!clientRes.ok) throw new Error("Main Admin failed to create Main Client: " + clientRes.error);
    const clientUser = clientRes.user;

    // Test Isolation
    const clientFetchRes = await fetchUsers(clientUser.id);
    if (!clientFetchRes.ok) throw new Error("Main Client failed to fetch users");
    const hasExternalUsers = clientFetchRes.users.some(u => u.tenantId !== tenantId && u.role !== 'main_admin');
    if (hasExternalUsers) throw new Error("ISOLATION BROKEN: Main Client saw external tenant users!");
    console.log("✅ Main Client query isolation strictly bound to tenant.");

    // Test Creation Bounds
    const clientTryCreateClient = await createDbUser(clientUser.id, { name: 'Rogue Client', email: 'rogue@test.com', role: 'main_client' });
    if (clientTryCreateClient.ok) throw new Error("ISOLATION BROKEN: Main Client created another Main Client!");
    console.log("✅ Main Client is blocked from creating other Main Clients.");

    // ----------------------------------------
    console.log("\n[Hotel Manager] Role 3");
    const managerRes = await createDbUser(clientUser.id, { name: 'Test Manager', email: 'manager@test.com', role: 'hotel_manager', hotelId: dummyHotel.id });
    if (!managerRes.ok) throw new Error("Manager creation failed: " + managerRes.error);
    // Wait, manager is created by Client, the tenantId should be auto-set to Client's tenant!
    if (managerRes.user.tenantId !== tenantId) throw new Error("ISOLATION BROKEN: Manager tenant mismatch.");
    console.log("✅ Hotel Manager successfully auto-bound to Main Client's tenant.");

    // ----------------------------------------
    console.log("\n[Notification System Test]");
    await sendTenantNotification(tenantId, 'critical', '[TEST] Theft Reported in Kitchen');
    const notifs = await fetchUserNotifications(clientUser.id);
    if (!notifs.ok || notifs.notifications.length === 0 || notifs.notifications[0].message !== '[TEST] Theft Reported in Kitchen') {
       throw new Error("NOTIFICATION BROKEN: Failed to deliver or retrieve notification.");
    }
    console.log("✅ Server Notifications short-polling backend holds context accurately.");
    
    // Test successfully concludes
    console.log("\n=================================");
    console.log("ALL TESTS PASSED! ZERO ERRORS. ✅");
    console.log("=================================");

  } catch (error) {
    console.error("\n❌ TEST FAILED:", error.message);
  } finally {
    // Cleanup users but keep the admin for now if needed, or delete all test.com
    await prisma.notification.deleteMany({ where: { message: { contains: '[TEST]' } } });
    await prisma.user.deleteMany({ where: { email: { contains: 'test.com' } } });
    await prisma.hotel.deleteMany({ where: { name: 'Test Hotel' } });
    await prisma.tenant.deleteMany({ where: { name: { startsWith: testTenantPrefix } } });
    await prisma.$disconnect();
  }
}

runTests();
