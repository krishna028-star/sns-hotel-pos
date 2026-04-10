import { NextRequest, NextResponse } from 'next/server';
import { DEMO_USERS } from '@/lib/mockData';
import {
  ok, created, badRequest, unauthorized, conflict,
  validateEmail, sanitizeString, createDemoToken, checkRateLimit
} from '@/lib/apiHelpers';

// POST /api/auth/login
export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests. Please wait 1 minute.' } },
      { status: 429 }
    );
  }

  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  const { email, password } = body;

  // Validation
  if (!email || !password) {
    return badRequest('Email and password are required');
  }
  if (!validateEmail(email)) {
    return badRequest('Invalid email format');
  }

  const cleanEmail = sanitizeString(email).toLowerCase();
  const cleanPassword = sanitizeString(password);

  // Find user (in production: query DB with hashed password)
  const user = DEMO_USERS.find(
    (u) => u.email.toLowerCase() === cleanEmail && u.password === cleanPassword
  );

  if (!user) {
    // Deliberate delay to prevent timing attacks
    await new Promise((r) => setTimeout(r, 300));
    return unauthorized('Invalid email or password');
  }

  // Generate token
  const token = createDemoToken(user.id, user.role);

  // Build safe user object (no password)
  const { password: _pw, ...safeUser } = user;

  const response = ok({ user: safeUser, token });

  // Set HTTP-only cookie for refresh token (production pattern)
  response.headers.set(
    'Set-Cookie',
    `sns_session=${token}; HttpOnly; SameSite=Strict; Max-Age=86400; Path=/`
  );

  return response;
}
