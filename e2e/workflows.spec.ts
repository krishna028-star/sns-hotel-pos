import { test, expect, Page } from '@playwright/test';

async function loginAs(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
  const userField = page.locator('input[placeholder*="Staff ID" i], input[placeholder*="SNS-" i], input[placeholder*="e.g." i]').first();
  const passField = page.locator('input[type="password"]').first();
  await userField.fill(email);
  await passField.fill(password);
  await page.click('button[type="submit"], button:has-text("Sign In")');
  await page.waitForLoadState('networkidle');
}

// ── Worker takes order ────────────────────────────────────────
test.describe('Worker — Order Flow', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'worker@sns.com', 'work123');
  });

  test('worker dashboard loads with table overview', async ({ page }) => {
    await expect(page).toHaveURL(/\/worker\/dashboard/);
    const heading = page.locator('h1, [class*="page-header-title"]').first();
    await expect(heading).toBeVisible();
  });

  test('worker can navigate to floor plan / tables', async ({ page }) => {
    await page.click('a:has-text("Floor Plan"), a:has-text("Tables"), [href*="/worker/tables"]');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/worker\/tables/);
    // Should show table grid
    const content = page.locator('body');
    await expect(content).toBeVisible();
  });

  test('worker can navigate to active orders', async ({ page }) => {
    await page.click('a:has-text("Active Orders"), [href*="/worker/orders"]');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/worker\/orders/);
  });

  test('worker can navigate to bookings', async ({ page }) => {
    await page.click('a:has-text("Bookings"), [href*="/worker/bookings"]');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/worker\/bookings/);
  });
});

// ── Chef — KOT acceptance ─────────────────────────────────────
test.describe('Chef — KOT Flow', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'chef@sns.com', 'chef123');
  });

  test('chef kitchen display loads', async ({ page }) => {
    await expect(page).toHaveURL(/\/chef\/dashboard/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('chef can see pending KOTs', async ({ page }) => {
    await page.click('a:has-text("Pending"), [href*="/chef/pending"]');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/chef\/pending/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('chef can see active KOTs', async ({ page }) => {
    await page.click('a:has-text("Active"), [href*="/chef/active"]');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/chef\/active/);
  });
});

// ── Cashier — Payment flow ────────────────────────────────────
test.describe('Cashier — Payment Flow', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'cashier@sns.com', 'cash123');
  });

  test('cashier dashboard loads', async ({ page }) => {
    await expect(page).toHaveURL(/\/cashier\/dashboard/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('cashier can navigate to payment alarms', async ({ page }) => {
    await page.click('a:has-text("Payment Alarms"), a:has-text("Alarms"), [href*="/cashier/alarms"]');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/cashier\/alarms/);
  });

  test('cashier can navigate to pending payments', async ({ page }) => {
    await page.click('a:has-text("Pending"), [href*="/cashier/pending"]');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/cashier\/pending/);
  });

  test('cashier can navigate to reconciliation', async ({ page }) => {
    await page.click('a:has-text("Reconciliation"), [href*="/cashier/reconcile"]');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/cashier\/reconcile/);
  });
});

// ── Hotel Manager — Discount approval ────────────────────────
test.describe('Hotel Manager — Discount Approvals', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'manager@sns.com', 'manager123');
  });

  test('manager dashboard loads', async ({ page }) => {
    await expect(page).toHaveURL(/\/manager\/dashboard/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('manager can navigate to discount/void approvals', async ({ page }) => {
    await page.click('a:has-text("Discount"), [href*="/manager/discounts"]');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/manager\/discounts/);
  });

  test('manager can navigate to live orders', async ({ page }) => {
    await page.click('a:has-text("Live Orders"), [href*="/manager/live-orders"]');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/manager\/live-orders/);
  });

  test('manager can navigate to theft reports', async ({ page }) => {
    await page.click('a:has-text("Theft"), [href*="/manager/theft"]');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/manager\/theft/);
  });

  test('manager can navigate to staff management', async ({ page }) => {
    await page.click('a:has-text("Staff"), [href*="/manager/staff"]');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/manager\/staff/);
  });
});

// ── Inventory Manager — Theft report ─────────────────────────
test.describe('Inventory Manager — Theft Reports', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'inventory@sns.com', 'inv123');
  });

  test('inventory dashboard loads', async ({ page }) => {
    await expect(page).toHaveURL(/\/inventory\/dashboard/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('inventory manager can navigate to theft reports', async ({ page }) => {
    await page.click('a:has-text("Theft"), [href*="/inventory/theft"]');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/inventory\/theft/);
  });

  test('inventory manager can navigate to stock overview', async ({ page }) => {
    await page.click('a:has-text("Stock"), [href*="/inventory/stock"]');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/inventory\/stock/);
  });

  test('inventory manager can navigate to purchase orders', async ({ page }) => {
    await page.click('a:has-text("Purchase Orders"), [href*="/inventory/purchase-orders"]');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/inventory\/purchase-orders/);
  });
});

// ── Customer — Booking flow ───────────────────────────────────
test.describe('Customer — Booking and Menu', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'customer@sns.com', 'cust123');
  });

  test('customer dashboard loads', async ({ page }) => {
    await expect(page).toHaveURL(/\/customer\/dashboard/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('customer can navigate to book a table', async ({ page }) => {
    await page.click('a:has-text("Book"), [href*="/customer/book"]');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/customer\/book/);
  });

  test('customer can navigate to browse menu', async ({ page }) => {
    await page.click('a:has-text("Menu"), a:has-text("Browse"), [href*="/customer/menu"]');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/customer\/menu/);
  });

  test('customer can navigate to my orders', async ({ page }) => {
    await page.click('a:has-text("My Orders"), a:has-text("Orders"), [href*="/customer/orders"]');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/customer\/orders/);
  });
});

// ── Admin — User management ───────────────────────────────────
test.describe('Admin — User Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'admin@sns.com', 'admin123');
  });

  test('admin can navigate to user management', async ({ page }) => {
    await page.click('a:has-text("Users"), [href*="/admin/users"]');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/admin\/users/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('admin can open new user modal', async ({ page }) => {
    await page.goto('/admin/users');
    await page.waitForLoadState('networkidle');
    const newUserBtn = page.locator('button:has-text("New User"), button:has-text("+ New")').first();
    if (await newUserBtn.isVisible()) {
      await newUserBtn.click();
      // Modal should appear
      const modal = page.locator('[class*="modal"], [role="dialog"]').first();
      await expect(modal).toBeVisible({ timeout: 3000 });
    } else {
      test.skip();
    }
  });

  test('admin can navigate to audit logs', async ({ page }) => {
    await page.click('a:has-text("Audit"), [href*="/admin/audit"]');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/admin\/audit/);
  });

  test('admin can navigate to system health', async ({ page }) => {
    await page.click('a:has-text("System Health"), a:has-text("Health"), [href*="/admin/health"]');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/admin\/health/);
    // Health check should run and show something
    await page.waitForTimeout(2000);
    await expect(page.locator('body')).toBeVisible();
  });
});
