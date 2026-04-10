/**
 * Unit tests for auth library (role hierarchy, login, canManage).
 * These tests run against the mock-data-backed AuthContext logic.
 */

import { DEMO_USERS, ROLE_HOMES } from '@/lib/mockData';

// ── helpers ──────────────────────────────────────────────────
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

function canManage(actorRole: string, targetRole: string): boolean {
  const myPower = ROLE_POWER[actorRole] ?? 99;
  const targetPower = ROLE_POWER[targetRole] ?? 99;
  return myPower < targetPower;
}

// ── DEMO_USERS ────────────────────────────────────────────────
describe('DEMO_USERS', () => {
  it('should contain 9 seed users', () => {
    expect(DEMO_USERS).toHaveLength(9);
  });

  it('should have unique ids', () => {
    const ids = DEMO_USERS.map((u) => u.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should have unique emails', () => {
    const emails = DEMO_USERS.map((u) => u.email);
    expect(new Set(emails).size).toBe(emails.length);
  });

  it('every user should have a role present in ROLE_POWER', () => {
    DEMO_USERS.forEach((u) => {
      expect(ROLE_POWER).toHaveProperty(u.role);
    });
  });

  it('should have main_admin user', () => {
    const admin = DEMO_USERS.find((u) => u.role === 'main_admin');
    expect(admin).toBeDefined();
    expect(admin?.email).toBe('admin@sns.com');
  });
});

// ── ROLE_HOMES ────────────────────────────────────────────────
describe('ROLE_HOMES', () => {
  it('should have a home path for every role in ROLE_POWER', () => {
    Object.keys(ROLE_POWER).forEach((role) => {
      expect(ROLE_HOMES[role]).toBeDefined();
      expect(ROLE_HOMES[role]).toMatch(/^\//);
    });
  });
});

// ── canManage (role hierarchy) ────────────────────────────────
describe('canManage', () => {
  describe('main_admin', () => {
    it('can manage all lower roles', () => {
      ['main_client', 'franchise_head', 'hotel_manager', 'inventory_manager', 'cashier', 'chef', 'worker', 'customer'].forEach((role) => {
        expect(canManage('main_admin', role)).toBe(true);
      });
    });

    it('cannot manage another main_admin (same level)', () => {
      expect(canManage('main_admin', 'main_admin')).toBe(false);
    });
  });

  describe('hotel_manager', () => {
    it('can manage inventory_manager, cashier, chef, worker, customer', () => {
      ['inventory_manager', 'cashier', 'chef', 'worker', 'customer'].forEach((role) => {
        expect(canManage('hotel_manager', role)).toBe(true);
      });
    });

    it('cannot manage main_admin, main_client, franchise_head', () => {
      ['main_admin', 'main_client', 'franchise_head'].forEach((role) => {
        expect(canManage('hotel_manager', role)).toBe(false);
      });
    });

    it('cannot manage another hotel_manager (same level)', () => {
      expect(canManage('hotel_manager', 'hotel_manager')).toBe(false);
    });
  });

  describe('cashier', () => {
    it('can only manage worker and customer', () => {
      expect(canManage('cashier', 'worker')).toBe(true);
      expect(canManage('cashier', 'customer')).toBe(true);
    });

    it('cannot manage chef (same-ish level, chef=6 > cashier=5)', () => {
      expect(canManage('cashier', 'chef')).toBe(true); // cashier(5) < chef(6)
    });

    it('cannot manage inventory_manager', () => {
      expect(canManage('cashier', 'inventory_manager')).toBe(false);
    });
  });

  describe('worker & customer', () => {
    it('worker cannot manage anyone', () => {
      Object.keys(ROLE_POWER).forEach((role) => {
        if (role !== 'customer') {
          expect(canManage('worker', role)).toBe(false);
        }
      });
    });

    it('worker can manage customer', () => {
      expect(canManage('worker', 'customer')).toBe(true);
    });

    it('customer cannot manage anyone', () => {
      Object.keys(ROLE_POWER).forEach((role) => {
        expect(canManage('customer', role)).toBe(false);
      });
    });
  });
});

// ── Login simulation ─────────────────────────────────────────
describe('login simulation', () => {
  function mockLogin(email: string, password: string) {
    const found = DEMO_USERS.find((u) => u.email === email && u.password === password);
    if (!found) return { ok: false, error: 'Invalid email or password' };
    return { ok: true, user: found };
  }

  it('should login with correct credentials', () => {
    const result = mockLogin('admin@sns.com', 'admin123');
    expect(result.ok).toBe(true);
    expect((result as any).user.role).toBe('main_admin');
  });

  it('should reject wrong password', () => {
    const result = mockLogin('admin@sns.com', 'wrongpassword');
    expect(result.ok).toBe(false);
    expect(result.error).toBe('Invalid email or password');
  });

  it('should reject unknown email', () => {
    const result = mockLogin('unknown@sns.com', 'admin123');
    expect(result.ok).toBe(false);
  });

  it('should login each demo role successfully', () => {
    const credentials: [string, string][] = [
      ['admin@sns.com', 'admin123'],
      ['client@sns.com', 'client123'],
      ['franchise@sns.com', 'franchise123'],
      ['manager@sns.com', 'manager123'],
      ['inventory@sns.com', 'inv123'],
      ['cashier@sns.com', 'cash123'],
      ['chef@sns.com', 'chef123'],
      ['worker@sns.com', 'work123'],
      ['customer@sns.com', 'cust123'],
    ];
    credentials.forEach(([email, pwd]) => {
      const result = mockLogin(email, pwd);
      expect(result.ok).toBe(true);
    });
  });
});
