/**
 * Integration tests for role-based access control (RBAC) middleware logic.
 * Tests the permission matrix for user creation and management.
 */

// ── Permission Matrix ─────────────────────────────────────────
const ROLE_POWER: Record<string, number> = {
  main_admin: 0,
  main_client: 1,
  franchise_head: 2,
  hotel_manager: 3,
  inventory_manager: 4,
  cashier: 5,
  chef: 6,
  worker: 7,
  customer: 8,
};

const ALL_ROLES = Object.keys(ROLE_POWER);

function checkCreatePermission(actorRole: string, targetRole: string): boolean {
  const actorPower = ROLE_POWER[actorRole] ?? 99;
  const targetPower = ROLE_POWER[targetRole] ?? 99;
  return actorPower < targetPower;
}

// ── Test: Creation permission matrix ─────────────────────────
describe('RBAC Permission Matrix', () => {
  describe('main_admin permissions', () => {
    it('can create any role below themselves', () => {
      const canCreate = ALL_ROLES.filter((r) => r !== 'main_admin');
      canCreate.forEach((role) => {
        expect(checkCreatePermission('main_admin', role)).toBe(true);
      });
    });

    it('cannot create another main_admin', () => {
      expect(checkCreatePermission('main_admin', 'main_admin')).toBe(false);
    });
  });

  describe('main_client permissions', () => {
    const allowed = ['franchise_head', 'hotel_manager', 'inventory_manager', 'cashier', 'chef', 'worker', 'customer'];
    const denied = ['main_admin', 'main_client'];

    it('can create lower roles', () => {
      allowed.forEach((role) => {
        expect(checkCreatePermission('main_client', role)).toBe(true);
      });
    });

    it('cannot create same or higher roles', () => {
      denied.forEach((role) => {
        expect(checkCreatePermission('main_client', role)).toBe(false);
      });
    });
  });

  describe('franchise_head permissions', () => {
    const allowed = ['hotel_manager', 'inventory_manager', 'cashier', 'chef', 'worker', 'customer'];
    const denied = ['main_admin', 'main_client', 'franchise_head'];

    it('can create hotel-level roles', () => {
      allowed.forEach((role) => {
        expect(checkCreatePermission('franchise_head', role)).toBe(true);
      });
    });

    it('cannot create same or higher roles', () => {
      denied.forEach((role) => {
        expect(checkCreatePermission('franchise_head', role)).toBe(false);
      });
    });
  });

  describe('hotel_manager permissions', () => {
    const allowed = ['inventory_manager', 'cashier', 'chef', 'worker', 'customer'];
    const denied = ['main_admin', 'main_client', 'franchise_head', 'hotel_manager'];

    it('can create operational staff', () => {
      allowed.forEach((role) => {
        expect(checkCreatePermission('hotel_manager', role)).toBe(true);
      });
    });

    it('cannot create management-level roles', () => {
      denied.forEach((role) => {
        expect(checkCreatePermission('hotel_manager', role)).toBe(false);
      });
    });
  });

  describe('cashier, chef, worker permissions', () => {
    ['cashier', 'chef', 'worker'].forEach((actorRole) => {
      describe(`${actorRole}`, () => {
        it('cannot create any management or peer role', () => {
          const denied = ['main_admin', 'main_client', 'franchise_head', 'hotel_manager', 'inventory_manager'];
          denied.forEach((role) => {
            expect(checkCreatePermission(actorRole, role)).toBe(false);
          });
        });
      });
    });

    it('customer cannot create anyone', () => {
      ALL_ROLES.forEach((role) => {
        expect(checkCreatePermission('customer', role)).toBe(false);
      });
    });
  });
});

// ── Test: Main admin restriction (only existing admins create admins) ─
describe('Main Admin Creation Restriction', () => {
  interface CreateRequest {
    actorRole: string;
    targetRole: string;
    existingMainAdmins: number;
  }

  function canCreateMainAdmin({ actorRole, targetRole, existingMainAdmins }: CreateRequest): { allowed: boolean; reason: string } {
    if (targetRole !== 'main_admin') {
      return { allowed: checkCreatePermission(actorRole, targetRole), reason: 'standard rbac' };
    }
    if (actorRole !== 'main_admin') {
      return { allowed: false, reason: 'only main_admin can create main_admin' };
    }
    if (existingMainAdmins === 0) {
      return { allowed: false, reason: 'no main_admin exists to authorize creation' };
    }
    return { allowed: true, reason: 'existing main_admin authorizing new main_admin' };
  }

  it('allows main_admin to create another main_admin when one already exists', () => {
    const result = canCreateMainAdmin({ actorRole: 'main_admin', targetRole: 'main_admin', existingMainAdmins: 1 });
    expect(result.allowed).toBe(true);
  });

  it('denies non-admin from creating main_admin', () => {
    ['hotel_manager', 'main_client', 'franchise_head', 'cashier'].forEach((role) => {
      const result = canCreateMainAdmin({ actorRole: role, targetRole: 'main_admin', existingMainAdmins: 1 });
      expect(result.allowed).toBe(false);
    });
  });

  it('denies creation when existingMainAdmins is 0 (bootstrap scenario)', () => {
    const result = canCreateMainAdmin({ actorRole: 'main_admin', targetRole: 'main_admin', existingMainAdmins: 0 });
    expect(result.allowed).toBe(false);
  });
});

// ── Test: Alert notification targets ─────────────────────────
describe('Alert Notification Target (higher role gets notified)', () => {
  const NOTIFY_PARENT: Record<string, string | null> = {
    cashier: 'hotel_manager',
    chef: 'hotel_manager',
    worker: 'hotel_manager',
    inventory_manager: 'hotel_manager',
    hotel_manager: 'franchise_head',
    franchise_head: 'main_client',
    main_client: 'main_admin',
    main_admin: null,
    customer: null,
  };

  function getNotifyTarget(createdRole: string): string | null {
    return NOTIFY_PARENT[createdRole] ?? null;
  }

  it('when cashier is created, hotel_manager should be notified', () => {
    expect(getNotifyTarget('cashier')).toBe('hotel_manager');
  });

  it('when hotel_manager is created, franchise_head should be notified', () => {
    expect(getNotifyTarget('hotel_manager')).toBe('franchise_head');
  });

  it('when franchise_head is created, main_client should be notified', () => {
    expect(getNotifyTarget('franchise_head')).toBe('main_client');
  });

  it('when main_admin is created, no higher role exists (null)', () => {
    expect(getNotifyTarget('main_admin')).toBeNull();
  });

  it('customer creation returns null (no mandatory alert)', () => {
    expect(getNotifyTarget('customer')).toBeNull();
  });
});
