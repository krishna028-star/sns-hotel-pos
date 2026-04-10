/**
 * Integration tests for order workflow state machine.
 * Tests the KOT flow: Worker → Kitchen → Cashier.
 */

// ── Order Status State Machine ────────────────────────────────
type OrderStatus = 'pending' | 'kot_sent' | 'cooking' | 'ready' | 'served' | 'bill_requested' | 'paid' | 'cancelled';
type KOTStatus = 'none' | 'pending' | 'accepted' | 'cooking' | 'ready' | 'served';

interface Order {
  id: string;
  tableNum: number;
  status: OrderStatus;
  kotStatus: KOTStatus;
  items: { name: string; qty: number; price: number }[];
  total: number;
}

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['kot_sent', 'cancelled'],
  kot_sent: ['cooking', 'cancelled'],
  cooking: ['ready', 'cancelled'],
  ready: ['served'],
  served: ['bill_requested'],
  bill_requested: ['paid'],
  paid: [],
  cancelled: [],
};

function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

function transitionOrder(order: Order, newStatus: OrderStatus, actor: string): { ok: boolean; error?: string; order?: Order } {
  if (!canTransition(order.status, newStatus)) {
    return { ok: false, error: `Cannot transition from ${order.status} to ${newStatus}` };
  }
  const updated: Order = { ...order, status: newStatus };
  // Update KOT status based on order status
  if (newStatus === 'kot_sent') updated.kotStatus = 'pending';
  if (newStatus === 'cooking') updated.kotStatus = 'cooking';
  if (newStatus === 'ready') updated.kotStatus = 'ready';
  if (newStatus === 'served') updated.kotStatus = 'served';
  return { ok: true, order: updated };
}

// ── Tests ─────────────────────────────────────────────────────
describe('Order State Machine', () => {
  const baseOrder: Order = {
    id: 'ORD-TEST-01',
    tableNum: 5,
    status: 'pending',
    kotStatus: 'none',
    items: [{ name: 'Butter Chicken', qty: 2, price: 400 }],
    total: 800,
  };

  it('should calculate total correctly', () => {
    const sum = baseOrder.items.reduce((acc, i) => acc + i.qty * i.price, 0);
    expect(sum).toBe(baseOrder.total);
  });

  describe('Valid transitions', () => {
    it('pending → kot_sent (Worker sends order)', () => {
      const result = transitionOrder(baseOrder, 'kot_sent', 'worker');
      expect(result.ok).toBe(true);
      expect(result.order?.kotStatus).toBe('pending');
    });

    it('kot_sent → cooking (Chef accepts KOT)', () => {
      const order = { ...baseOrder, status: 'kot_sent' as OrderStatus, kotStatus: 'pending' as KOTStatus };
      const result = transitionOrder(order, 'cooking', 'chef');
      expect(result.ok).toBe(true);
      expect(result.order?.kotStatus).toBe('cooking');
    });

    it('cooking → ready (Chef marks done)', () => {
      const order = { ...baseOrder, status: 'cooking' as OrderStatus, kotStatus: 'cooking' as KOTStatus };
      const result = transitionOrder(order, 'ready', 'chef');
      expect(result.ok).toBe(true);
      expect(result.order?.kotStatus).toBe('ready');
    });

    it('ready → served (Worker serves)', () => {
      const order = { ...baseOrder, status: 'ready' as OrderStatus, kotStatus: 'ready' as KOTStatus };
      const result = transitionOrder(order, 'served', 'worker');
      expect(result.ok).toBe(true);
      expect(result.order?.kotStatus).toBe('served');
    });

    it('served → bill_requested (Customer requests bill)', () => {
      const order = { ...baseOrder, status: 'served' as OrderStatus, kotStatus: 'served' as KOTStatus };
      const result = transitionOrder(order, 'bill_requested', 'customer');
      expect(result.ok).toBe(true);
    });

    it('bill_requested → paid (Cashier accepts payment)', () => {
      const order = { ...baseOrder, status: 'bill_requested' as OrderStatus };
      const result = transitionOrder(order, 'paid', 'cashier');
      expect(result.ok).toBe(true);
    });
  });

  describe('Invalid transitions', () => {
    it('cannot skip from pending directly to cooking', () => {
      const result = transitionOrder(baseOrder, 'cooking', 'chef');
      expect(result.ok).toBe(false);
    });

    it('cannot go from paid back to any status', () => {
      const order = { ...baseOrder, status: 'paid' as OrderStatus };
      const statuses: OrderStatus[] = ['pending', 'kot_sent', 'cooking', 'ready', 'served', 'bill_requested'];
      statuses.forEach((s) => {
        const result = transitionOrder(order, s, 'worker');
        expect(result.ok).toBe(false);
      });
    });

    it('cannot go from ready to paid directly', () => {
      const order = { ...baseOrder, status: 'ready' as OrderStatus };
      const result = transitionOrder(order, 'paid', 'cashier');
      expect(result.ok).toBe(false);
    });

    it('cannot transition cancelled order', () => {
      const order = { ...baseOrder, status: 'cancelled' as OrderStatus };
      const result = transitionOrder(order, 'kot_sent', 'worker');
      expect(result.ok).toBe(false);
    });
  });

  describe('Full KOT workflow', () => {
    it('completes the full Worker → Kitchen → Cashier flow', () => {
      let order: Order = { ...baseOrder };

      // Worker sends KOT
      let result = transitionOrder(order, 'kot_sent', 'worker');
      expect(result.ok).toBe(true);
      order = result.order!;
      expect(order.kotStatus).toBe('pending');

      // Chef accepts
      result = transitionOrder(order, 'cooking', 'chef');
      expect(result.ok).toBe(true);
      order = result.order!;
      expect(order.kotStatus).toBe('cooking');

      // Chef marks ready
      result = transitionOrder(order, 'ready', 'chef');
      expect(result.ok).toBe(true);
      order = result.order!;
      expect(order.kotStatus).toBe('ready');

      // Worker serves
      result = transitionOrder(order, 'served', 'worker');
      expect(result.ok).toBe(true);
      order = result.order!;

      // Customer requests bill
      result = transitionOrder(order, 'bill_requested', 'customer');
      expect(result.ok).toBe(true);
      order = result.order!;

      // Cashier accepts payment
      result = transitionOrder(order, 'paid', 'cashier');
      expect(result.ok).toBe(true);
      expect(result.order!.status).toBe('paid');
    });
  });
});

// ── Payment validation ────────────────────────────────────────
describe('Payment Validation', () => {
  interface PaymentRequest {
    amount: number;
    method: 'cash' | 'upi' | 'card' | 'app';
    tendered?: number;
  }

  function validatePayment(req: PaymentRequest): { valid: boolean; change?: number; error?: string } {
    if (req.amount <= 0) return { valid: false, error: 'Amount must be positive' };
    if (!['cash', 'upi', 'card', 'app'].includes(req.method)) {
      return { valid: false, error: 'Invalid payment method' };
    }
    if (req.method === 'cash' && req.tendered !== undefined) {
      if (req.tendered < req.amount) {
        return { valid: false, error: 'Insufficient cash tendered' };
      }
      return { valid: true, change: req.tendered - req.amount };
    }
    return { valid: true };
  }

  it('validates correct UPI payment', () => {
    const result = validatePayment({ amount: 840, method: 'upi' });
    expect(result.valid).toBe(true);
  });

  it('validates cash payment with correct change', () => {
    const result = validatePayment({ amount: 840, method: 'cash', tendered: 1000 });
    expect(result.valid).toBe(true);
    expect(result.change).toBe(160);
  });

  it('rejects cash payment with insufficient amount', () => {
    const result = validatePayment({ amount: 840, method: 'cash', tendered: 500 });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Insufficient');
  });

  it('rejects negative amount', () => {
    const result = validatePayment({ amount: -100, method: 'upi' });
    expect(result.valid).toBe(false);
  });

  it('rejects unknown payment method', () => {
    const result = validatePayment({ amount: 100, method: 'bitcoin' as any });
    expect(result.valid).toBe(false);
  });
});

// ── Discount approval ─────────────────────────────────────────
describe('Discount Approval Workflow', () => {
  interface DiscountRequest {
    orderId: string;
    requestedBy: string;
    requestedByRole: string;
    discountPercent: number;
    maxAllowed: number;
    approvedBy?: string;
    status: 'pending' | 'approved' | 'rejected';
  }

  function approveDiscount(
    req: DiscountRequest,
    approver: { role: string; name: string }
  ): { ok: boolean; error?: string; req?: DiscountRequest } {
    if (approver.role !== 'hotel_manager') {
      return { ok: false, error: 'Only hotel_manager can approve discounts' };
    }
    if (req.discountPercent > req.maxAllowed) {
      return { ok: false, error: `Discount ${req.discountPercent}% exceeds maximum ${req.maxAllowed}%` };
    }
    if (req.status !== 'pending') {
      return { ok: false, error: 'Request is not pending' };
    }
    return {
      ok: true,
      req: { ...req, status: 'approved', approvedBy: approver.name },
    };
  }

  it('hotel_manager can approve valid discount', () => {
    const req: DiscountRequest = {
      orderId: 'ORD-101', requestedBy: 'cashier@sns.com',
      requestedByRole: 'cashier', discountPercent: 10,
      maxAllowed: 15, status: 'pending',
    };
    const result = approveDiscount(req, { role: 'hotel_manager', name: 'Anil Kumar' });
    expect(result.ok).toBe(true);
    expect(result.req?.status).toBe('approved');
  });

  it('rejects if discount exceeds max allowed', () => {
    const req: DiscountRequest = {
      orderId: 'ORD-102', requestedBy: 'cashier@sns.com',
      requestedByRole: 'cashier', discountPercent: 20,
      maxAllowed: 15, status: 'pending',
    };
    const result = approveDiscount(req, { role: 'hotel_manager', name: 'Anil Kumar' });
    expect(result.ok).toBe(false);
    expect(result.error).toContain('exceeds maximum');
  });

  it('rejects if approver is not hotel_manager', () => {
    const req: DiscountRequest = {
      orderId: 'ORD-103', requestedBy: 'cashier@sns.com',
      requestedByRole: 'cashier', discountPercent: 5,
      maxAllowed: 15, status: 'pending',
    };
    const result = approveDiscount(req, { role: 'cashier', name: 'Suresh' });
    expect(result.ok).toBe(false);
  });

  it('rejects if request is already approved', () => {
    const req: DiscountRequest = {
      orderId: 'ORD-104', requestedBy: 'cashier@sns.com',
      requestedByRole: 'cashier', discountPercent: 5,
      maxAllowed: 15, status: 'approved',
    };
    const result = approveDiscount(req, { role: 'hotel_manager', name: 'Anil Kumar' });
    expect(result.ok).toBe(false);
    expect(result.error).toContain('not pending');
  });
});
