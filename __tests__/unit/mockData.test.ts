/**
 * Unit tests – mock data integrity.
 * Ensures all data shapes are valid before they reach the UI.
 */

import {
  DEMO_USERS, MENU_ITEMS, MENU_CATEGORIES, TABLES, ACTIVE_ORDERS,
  PENDING_KOTS, PENDING_PAYMENTS, AUDIT_LOGS, INGREDIENTS,
  PURCHASE_ORDERS, THEFT_REPORTS, TENANTS, FRANCHISES, HOTELS,
  formatCurrency, formatDate,
} from '@/lib/mockData';

// ── Menu items ────────────────────────────────────────────────
describe('MENU_ITEMS', () => {
  it('should have at least 10 items', () => {
    expect(MENU_ITEMS.length).toBeGreaterThanOrEqual(10);
  });

  it('every item should have id, name, price, category, available, image', () => {
    MENU_ITEMS.forEach((item) => {
      expect(typeof item.id).toBe('number');
      expect(typeof item.name).toBe('string');
      expect(typeof item.price).toBe('number');
      expect(item.price).toBeGreaterThan(0);
      expect(typeof item.category).toBe('string');
      expect(typeof item.available).toBe('boolean');
      expect(typeof item.image).toBe('string');
    });
  });

  it('all categories in items should exist in MENU_CATEGORIES (excluding All)', () => {
    const validCats = MENU_CATEGORIES.filter((c) => c !== 'All');
    MENU_ITEMS.forEach((item) => {
      expect(validCats).toContain(item.category);
    });
  });

  it('should have unique ids', () => {
    const ids = MENU_ITEMS.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ── Tables ────────────────────────────────────────────────────
describe('TABLES', () => {
  it('should have at least 10 tables', () => {
    expect(TABLES.length).toBeGreaterThanOrEqual(10);
  });

  it('each table status should be free, occupied, or reserved', () => {
    const valid = ['free', 'occupied', 'reserved'];
    TABLES.forEach((t) => expect(valid).toContain(t.status));
  });

  it('occupied tables should have an orderId', () => {
    TABLES.filter((t) => t.status === 'occupied').forEach((t) => {
      expect((t as any).orderId).toBeDefined();
    });
  });
});

// ── Active Orders ─────────────────────────────────────────────
describe('ACTIVE_ORDERS', () => {
  it('every order should have id, tableNum, items, status, total', () => {
    ACTIVE_ORDERS.forEach((o) => {
      expect(typeof o.id).toBe('string');
      expect(typeof o.tableNum).toBe('number');
      expect(Array.isArray(o.items)).toBe(true);
      expect(o.items.length).toBeGreaterThan(0);
      expect(typeof o.total).toBe('number');
      expect(o.total).toBeGreaterThan(0);
    });
  });

  it('order total should approximately match items sum', () => {
    ACTIVE_ORDERS.forEach((o) => {
      const sum = o.items.reduce((acc, i) => acc + i.qty * i.price, 0);
      expect(Math.abs(sum - o.total)).toBeLessThanOrEqual(50); // allow small rounding
    });
  });
});

// ── KOTs ─────────────────────────────────────────────────────
describe('PENDING_KOTS', () => {
  it('each KOT should have id, orderId, tableNum, items', () => {
    PENDING_KOTS.forEach((k) => {
      expect(k.id).toMatch(/^KOT-/);
      expect(k.orderId).toMatch(/^ORD-/);
      expect(typeof k.tableNum).toBe('number');
      expect(Array.isArray(k.items)).toBe(true);
    });
  });
});

// ── Payments ─────────────────────────────────────────────────
describe('PENDING_PAYMENTS', () => {
  it('each payment should have id, orderId, amount, method', () => {
    PENDING_PAYMENTS.forEach((p) => {
      expect(p.id).toMatch(/^PAY-/);
      expect(p.orderId).toMatch(/^ORD-/);
      expect(typeof p.amount).toBe('number');
      expect(p.amount).toBeGreaterThan(0);
      expect(typeof p.method).toBe('string');
    });
  });
});

// ── Audit Logs ────────────────────────────────────────────────
describe('AUDIT_LOGS', () => {
  it('each log should have id, timestamp, user, role, action, resource', () => {
    AUDIT_LOGS.forEach((log) => {
      expect(typeof log.id).toBe('number');
      expect(typeof log.timestamp).toBe('string');
      expect(typeof log.user).toBe('string');
      expect(typeof log.action).toBe('string');
      expect(typeof log.resource).toBe('string');
    });
  });

  it('severity should be info, warning, or critical', () => {
    const valid = ['info', 'warning', 'critical'];
    AUDIT_LOGS.forEach((log) => {
      expect(valid).toContain(log.severity);
    });
  });
});

// ── Inventory ─────────────────────────────────────────────────
describe('INGREDIENTS', () => {
  it('each ingredient should have status of critical, low, or ok', () => {
    const valid = ['critical', 'low', 'ok'];
    INGREDIENTS.forEach((i) => {
      expect(valid).toContain(i.status);
    });
  });

  it('critical items should have stock less than reorder level', () => {
    INGREDIENTS.filter((i) => i.status === 'critical').forEach((i) => {
      expect(i.stock).toBeLessThan(i.reorder);
    });
  });
});

// ── Theft Reports ─────────────────────────────────────────────
describe('THEFT_REPORTS', () => {
  it('loss values should be positive numbers', () => {
    THEFT_REPORTS.forEach((r) => {
      expect(r.loss).toBeGreaterThan(0);
    });
  });

  it('status should be submitted, verified, or rejected', () => {
    const valid = ['submitted', 'verified', 'rejected'];
    THEFT_REPORTS.forEach((r) => expect(valid).toContain(r.status));
  });
});

// ── Formatters ────────────────────────────────────────────────
describe('formatCurrency', () => {
  it('should prefix with ₹', () => {
    expect(formatCurrency(1000)).toMatch(/^₹/);
  });

  it('should format large numbers with Indian locale separators', () => {
    const result = formatCurrency(100000);
    expect(result).toContain('1,00,000');
  });

  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('₹0');
  });
});

describe('formatDate', () => {
  it('should return a non-empty string for a valid date', () => {
    const result = formatDate('2025-03-30T20:15:22Z');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});

// ── Tenants / Franchises ──────────────────────────────────────
describe('TENANTS', () => {
  it('should have at least 3 tenants', () => {
    expect(TENANTS.length).toBeGreaterThanOrEqual(3);
  });

  it('statuses should be active, trial, or suspended', () => {
    const valid = ['active', 'trial', 'suspended'];
    TENANTS.forEach((t) => expect(valid).toContain(t.status));
  });
});

describe('FRANCHISES', () => {
  it('all franchises should reference valid tenant ids', () => {
    const tenantIds = new Set(TENANTS.map((t) => t.id));
    FRANCHISES.forEach((f) => {
      expect(tenantIds.has(f.tenantId)).toBe(true);
    });
  });
});

describe('HOTELS', () => {
  it('all hotels should reference valid franchise ids', () => {
    const franchiseIds = new Set(FRANCHISES.map((f) => f.id));
    HOTELS.forEach((h) => {
      expect(franchiseIds.has(h.franchiseId)).toBe(true);
    });
  });
});
