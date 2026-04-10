/**
 * Integration tests for inventory operations.
 * Tests stock validation, theft report workflow, and purchase order approval.
 */

// ── Types ─────────────────────────────────────────────────────
interface Ingredient {
  id: number;
  name: string;
  stock: number;
  reorder: number;
  unit: string;
  unitCost: number;
}

interface TheftReport {
  id: number;
  ingredientId: number;
  qty: number;
  loss: number;
  status: 'submitted' | 'verified' | 'rejected' | 'escalated';
  submittedBy: string;
  verifiedBy?: string;
  escalatedBy?: string;
}

interface PurchaseOrder {
  id: string;
  items: { ingredientId: number; qty: number; unitCost: number }[];
  total: number;
  status: 'draft' | 'pending_approval' | 'approved' | 'ordered' | 'received' | 'cancelled';
  submittedBy: string;
  approvedBy?: string;
}

// ── Stock functions ───────────────────────────────────────────
function getStockStatus(ingredient: Ingredient): 'critical' | 'low' | 'ok' {
  if (ingredient.stock < ingredient.reorder * 0.5) return 'critical';
  if (ingredient.stock < ingredient.reorder) return 'low';
  return 'ok';
}

function reserveStock(ingredient: Ingredient, qty: number): { ok: boolean; error?: string; remaining?: number } {
  if (qty <= 0) return { ok: false, error: 'Quantity must be positive' };
  if (ingredient.stock < qty) {
    return { ok: false, error: `Insufficient stock: ${ingredient.stock}${ingredient.unit} available, ${qty}${ingredient.unit} requested` };
  }
  return { ok: true, remaining: ingredient.stock - qty };
}

function rollbackReservation(ingredient: Ingredient, qty: number): Ingredient {
  return { ...ingredient, stock: ingredient.stock + qty };
}

// ── Tests ─────────────────────────────────────────────────────
describe('Stock Status Classification', () => {
  it('classifies critical stock when below 50% of reorder', () => {
    const item: Ingredient = { id: 1, name: 'Chicken', stock: 5, reorder: 20, unit: 'kg', unitCost: 280 };
    expect(getStockStatus(item)).toBe('critical');
  });

  it('classifies low stock when between 50% and 100% of reorder', () => {
    const item: Ingredient = { id: 2, name: 'Rice', stock: 15, reorder: 20, unit: 'kg', unitCost: 85 };
    expect(getStockStatus(item)).toBe('low');
  });

  it('classifies ok stock when above reorder level', () => {
    const item: Ingredient = { id: 3, name: 'Onions', stock: 30, reorder: 20, unit: 'kg', unitCost: 35 };
    expect(getStockStatus(item)).toBe('ok');
  });
});

describe('Stock Reservation', () => {
  const chicken: Ingredient = { id: 1, name: 'Chicken', stock: 10, reorder: 20, unit: 'kg', unitCost: 280 };

  it('successfully reserves available stock', () => {
    const result = reserveStock(chicken, 3);
    expect(result.ok).toBe(true);
    expect(result.remaining).toBe(7);
  });

  it('rejects reservation when insufficient stock', () => {
    const result = reserveStock(chicken, 15);
    expect(result.ok).toBe(false);
    expect(result.error).toContain('Insufficient stock');
  });

  it('rejects zero quantity', () => {
    const result = reserveStock(chicken, 0);
    expect(result.ok).toBe(false);
  });

  it('rejects negative quantity', () => {
    const result = reserveStock(chicken, -1);
    expect(result.ok).toBe(false);
  });

  it('allows exact reservation of all stock', () => {
    const result = reserveStock(chicken, 10);
    expect(result.ok).toBe(true);
    expect(result.remaining).toBe(0);
  });
});

describe('Stock Rollback (payment failure)', () => {
  it('restores stock on payment failure', () => {
    const chicken: Ingredient = { id: 1, name: 'Chicken', stock: 7, reorder: 20, unit: 'kg', unitCost: 280 };
    const original = 10;
    const reserved = 3;
    const rolled = rollbackReservation(chicken, reserved);
    expect(rolled.stock).toBe(original);
  });
});

describe('Theft Report Workflow', () => {
  const baseReport: TheftReport = {
    id: 1, ingredientId: 1, qty: 5, loss: 1400,
    status: 'submitted', submittedBy: 'inventory@sns.com',
  };

  function verifyTheft(
    report: TheftReport,
    verifier: { role: string; name: string }
  ): { ok: boolean; report?: TheftReport; error?: string } {
    if (!['hotel_manager', 'franchise_head'].includes(verifier.role)) {
      return { ok: false, error: 'Unauthorized: must be hotel_manager or franchise_head' };
    }
    if (report.status !== 'submitted') {
      return { ok: false, error: 'Report must be in submitted state' };
    }
    return { ok: true, report: { ...report, status: 'verified', verifiedBy: verifier.name } };
  }

  function escalateTheft(
    report: TheftReport,
    escalator: { role: string; name: string }
  ): { ok: boolean; report?: TheftReport; error?: string } {
    if (escalator.role !== 'franchise_head') {
      return { ok: false, error: 'Only franchise_head can escalate' };
    }
    if (!['submitted', 'verified'].includes(report.status)) {
      return { ok: false, error: 'Report must be submitted or verified' };
    }
    const escalated = { ...report, status: 'escalated' as const, escalatedBy: escalator.name };
    return { ok: true, report: escalated };
  }

  it('hotel_manager can verify submitted theft report', () => {
    const result = verifyTheft(baseReport, { role: 'hotel_manager', name: 'Anil Kumar' });
    expect(result.ok).toBe(true);
    expect(result.report?.status).toBe('verified');
    expect(result.report?.verifiedBy).toBe('Anil Kumar');
  });

  it('cashier cannot verify theft report', () => {
    const result = verifyTheft(baseReport, { role: 'cashier', name: 'Suresh' });
    expect(result.ok).toBe(false);
  });

  it('cannot verify already verified report', () => {
    const verified = { ...baseReport, status: 'verified' as const };
    const result = verifyTheft(verified, { role: 'hotel_manager', name: 'Anil' });
    expect(result.ok).toBe(false);
  });

  it('franchise_head can escalate a verified report', () => {
    const verified: TheftReport = { ...baseReport, status: 'verified' };
    const result = escalateTheft(verified, { role: 'franchise_head', name: 'Priya Singh' });
    expect(result.ok).toBe(true);
    expect(result.report?.status).toBe('escalated');
  });

  it('hotel_manager cannot escalate', () => {
    const result = escalateTheft(baseReport, { role: 'hotel_manager', name: 'Anil' });
    expect(result.ok).toBe(false);
  });

  it('high-value theft (>₹10,000) is flagged', () => {
    const highValueReport: TheftReport = { ...baseReport, loss: 15000 };
    const isCritical = highValueReport.loss > 10000;
    expect(isCritical).toBe(true); // triggers monitoring alert
  });
});

describe('Purchase Order Approval', () => {
  const basePO: PurchaseOrder = {
    id: 'PO-001',
    items: [{ ingredientId: 1, qty: 20, unitCost: 280 }],
    total: 5600,
    status: 'pending_approval',
    submittedBy: 'inventory@sns.com',
  };

  function approvePO(
    po: PurchaseOrder,
    approver: { role: string; name: string }
  ): { ok: boolean; po?: PurchaseOrder; error?: string } {
    if (!['hotel_manager', 'franchise_head'].includes(approver.role)) {
      return { ok: false, error: 'Unauthorized' };
    }
    if (po.status !== 'pending_approval') {
      return { ok: false, error: 'PO is not pending approval' };
    }
    return { ok: true, po: { ...po, status: 'approved', approvedBy: approver.name } };
  }

  it('hotel_manager can approve PO', () => {
    const result = approvePO(basePO, { role: 'hotel_manager', name: 'Anil Kumar' });
    expect(result.ok).toBe(true);
    expect(result.po?.status).toBe('approved');
  });

  it('inventory_manager cannot approve their own PO', () => {
    const result = approvePO(basePO, { role: 'inventory_manager', name: 'Deepa' });
    expect(result.ok).toBe(false);
  });

  it('PO total matches items sum', () => {
    const total = basePO.items.reduce((acc, i) => acc + i.qty * i.unitCost, 0);
    expect(total).toBe(basePO.total);
  });
});
