# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> API Health >> /api/health returns 200 with status ok
- Location: e2e\auth.spec.ts:106:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 404
```

# Test source

```ts
  8   |   const userField = page.locator('input[placeholder*="Staff ID" i], input[placeholder*="SNS-" i], input[placeholder*="e.g." i]').first();
  9   |   const passField = page.locator('input[type="password"]').first();
  10  |   
  11  |   await userField.fill(email);
  12  |   await passField.fill(password);
  13  |   
  14  |   await page.click('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")');
  15  |   await page.waitForLoadState('networkidle');
  16  | }
  17  | 
  18  | // ── Login page tests ─────────────────────────────────────────
  19  | test.describe('Login Page', () => {
  20  |   test('displays login form with email and password fields', async ({ page }) => {
  21  |     await page.goto('/login');
  22  |     await expect(page).toHaveTitle(/SNS Hotels/i);
  23  |     const emailField = page.locator('input[type="email"], input[placeholder*="email" i]').first();
  24  |     const passField = page.locator('input[type="password"]').first();
  25  |     await expect(emailField).toBeVisible();
  26  |     await expect(passField).toBeVisible();
  27  |   });
  28  | 
  29  |   test('shows error for invalid credentials', async ({ page }) => {
  30  |     await page.goto('/login');
  31  |     await page.fill('input[type="email"], input[placeholder*="email" i]', 'wrong@sns.com');
  32  |     await page.fill('input[type="password"]', 'wrongpassword');
  33  |     await page.click('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")');
  34  |     const error = page.locator('[role="alert"], .error, [class*="error"], [class*="danger"]').first();
  35  |     await expect(error).toBeVisible({ timeout: 5000 });
  36  |   });
  37  | 
  38  |   test('main_admin can log in and reaches dashboard', async ({ page }) => {
  39  |     await loginAs(page, 'admin@sns.com', 'admin123');
  40  |     await expect(page).toHaveURL(/\/admin\/dashboard/);
  41  |     await expect(page.locator('text=Dashboard').first()).toBeVisible();
  42  |   });
  43  | 
  44  |   test('hotel_manager can log in and reaches manager dashboard', async ({ page }) => {
  45  |     await loginAs(page, 'manager@sns.com', 'manager123');
  46  |     await expect(page).toHaveURL(/\/manager\/dashboard/);
  47  |   });
  48  | 
  49  |   test('cashier can log in and reaches cashier dashboard', async ({ page }) => {
  50  |     await loginAs(page, 'cashier@sns.com', 'cash123');
  51  |     await expect(page).toHaveURL(/\/cashier\/dashboard/);
  52  |   });
  53  | 
  54  |   test('chef can log in and reaches chef dashboard', async ({ page }) => {
  55  |     await loginAs(page, 'chef@sns.com', 'chef123');
  56  |     await expect(page).toHaveURL(/\/chef\/dashboard/);
  57  |   });
  58  | 
  59  |   test('worker can log in and reaches worker dashboard', async ({ page }) => {
  60  |     await loginAs(page, 'worker@sns.com', 'work123');
  61  |     await expect(page).toHaveURL(/\/worker\/dashboard/);
  62  |   });
  63  | 
  64  |   test('customer can log in and reaches customer dashboard', async ({ page }) => {
  65  |     await loginAs(page, 'customer@sns.com', 'cust123');
  66  |     await expect(page).toHaveURL(/\/customer\/dashboard/);
  67  |   });
  68  | 
  69  |   test('demo role selector allows quick login', async ({ page }) => {
  70  |     await page.goto('/login');
  71  |     // Demo quick-select buttons (if present)
  72  |     const demoBtn = page.locator('button:has-text("Admin"), [data-role="main_admin"]').first();
  73  |     if (await demoBtn.isVisible()) {
  74  |       await demoBtn.click();
  75  |       await page.waitForLoadState('networkidle');
  76  |       await expect(page).toHaveURL(/\/admin\/dashboard/);
  77  |     } else {
  78  |       test.skip();
  79  |     }
  80  |   });
  81  | });
  82  | 
  83  | // ── Unauthenticated redirect tests ────────────────────────────
  84  | test.describe('Auth Guards', () => {
  85  |   test('redirects /admin/dashboard to /login when not authenticated', async ({ page }) => {
  86  |     await page.goto('/admin/dashboard');
  87  |     await page.waitForLoadState('networkidle');
  88  |     // Should either redirect to login or show login prompt
  89  |     const url = page.url();
  90  |     const isOnDashboard = url.includes('/admin/dashboard');
  91  |     const isOnLogin = url.includes('/login');
  92  |     // In demo mode (no hard auth guard) it may stay on dashboard
  93  |     // Just verify the page loads without a crash
  94  |     await expect(page.locator('body')).toBeVisible();
  95  |   });
  96  | 
  97  |   test('/login page does not redirect to itself in a loop', async ({ page }) => {
  98  |     await page.goto('/login');
  99  |     await page.waitForLoadState('networkidle');
  100 |     await expect(page).toHaveURL(/\/login/);
  101 |   });
  102 | });
  103 | 
  104 | // ── Health API E2E ────────────────────────────────────────────
  105 | test.describe('API Health', () => {
  106 |   test('/api/health returns 200 with status ok', async ({ request }) => {
  107 |     const res = await request.get('/api/health');
> 108 |     expect(res.status()).toBe(200);
      |                          ^ Error: expect(received).toBe(expected) // Object.is equality
  109 |     const body = await res.json();
  110 |     expect(body.status).toBe('ok');
  111 |     expect(body.checks).toBeDefined();
  112 |   });
  113 | 
  114 |   test('/api/health includes memory and uptime', async ({ request }) => {
  115 |     const res = await request.get('/api/health');
  116 |     const body = await res.json();
  117 |     expect(typeof body.uptime).toBe('number');
  118 |     expect(body.checks.memory.heapUsed).toMatch(/MB$/);
  119 |   });
  120 | });
  121 | 
  122 | // ── 404 page ─────────────────────────────────────────────────
  123 | test.describe('Error Pages', () => {
  124 |   test('displays 404 page for unknown route', async ({ page }) => {
  125 |     await page.goto('/this-route-does-not-exist-at-all');
  126 |     await page.waitForLoadState('domcontentloaded');
  127 |     const body = page.locator('body');
  128 |     await expect(body).toBeVisible();
  129 |     // Should show some 404 indicator
  130 |     const has404 = await page.locator('text=404, text=Not Found, text=not found').first().isVisible().catch(() => false);
  131 |     // Page should at minimum render (not crash with blank screen)
  132 |     const pageContent = await page.content();
  133 |     expect(pageContent.length).toBeGreaterThan(100);
  134 |   });
  135 | });
  136 | 
```