import { NextRequest, NextResponse } from 'next/server';
import { ok } from '@/lib/apiHelpers';

// POST /api/auth/logout
export async function POST(req: NextRequest) {
  const response = ok({ message: 'Logged out successfully' });

  // Clear session cookie
  response.headers.set(
    'Set-Cookie',
    'sns_session=; HttpOnly; SameSite=Strict; Max-Age=0; Path=/'
  );

  return response;
}
