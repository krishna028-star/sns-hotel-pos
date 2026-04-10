import { NextResponse } from 'next/server';

// ── Types ─────────────────────────────────────────────────────────────────────
interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
  meta?: { total?: number; page?: number; limit?: number };
}

interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
  requestId?: string;
}

// ── Response helpers ──────────────────────────────────────────────────────────
export function ok<T>(data: T, meta?: ApiSuccess['meta']): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ success: true, data, ...(meta ? { meta } : {}) }, { status: 200 });
}

export function created<T>(data: T): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ success: true, data }, { status: 201 });
}

export function badRequest(message: string, details?: unknown): NextResponse<ApiError> {
  return NextResponse.json(
    { success: false, error: { code: 'BAD_REQUEST', message, details }, timestamp: new Date().toISOString() },
    { status: 400 }
  );
}

export function unauthorized(message = 'Authentication required'): NextResponse<ApiError> {
  return NextResponse.json(
    { success: false, error: { code: 'UNAUTHORIZED', message }, timestamp: new Date().toISOString() },
    { status: 401 }
  );
}

export function forbidden(message = 'Insufficient permissions'): NextResponse<ApiError> {
  return NextResponse.json(
    { success: false, error: { code: 'FORBIDDEN', message }, timestamp: new Date().toISOString() },
    { status: 403 }
  );
}

export function notFound(resource = 'Resource'): NextResponse<ApiError> {
  return NextResponse.json(
    { success: false, error: { code: 'NOT_FOUND', message: `${resource} not found` }, timestamp: new Date().toISOString() },
    { status: 404 }
  );
}

export function conflict(message: string): NextResponse<ApiError> {
  return NextResponse.json(
    { success: false, error: { code: 'CONFLICT', message }, timestamp: new Date().toISOString() },
    { status: 409 }
  );
}

export function serverError(message = 'Internal server error', details?: unknown): NextResponse<ApiError> {
  return NextResponse.json(
    { success: false, error: { code: 'INTERNAL_ERROR', message, details }, timestamp: new Date().toISOString() },
    { status: 500 }
  );
}

// ── Input validation helpers ──────────────────────────────────────────────────
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (password.length < 8) errors.push('Password must be at least 8 characters');
  if (!/[A-Z]/.test(password) && !/[0-9]/.test(password)) errors.push('Password must contain a number or uppercase letter');
  return { valid: errors.length === 0, errors };
}

export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>'"]/g, '');
}

// ── Rate limiting (in-memory, replace with Redis in production) ───────────────
const requestCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 100;
const WINDOW_MS = 60_000;

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = requestCounts.get(ip);

  if (!entry || now > entry.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }

  if (entry.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT - entry.count };
}

// ── JWT helpers (demo – replace with real JWT library in production) ──────────
export function createDemoToken(userId: number, role: string): string {
  const payload = { userId, role, iat: Date.now(), exp: Date.now() + 24 * 60 * 60 * 1000 };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export function verifyDemoToken(token: string): { userId: number; role: string } | null {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    if (payload.exp < Date.now()) return null;
    return { userId: payload.userId, role: payload.role };
  } catch {
    return null;
  }
}
