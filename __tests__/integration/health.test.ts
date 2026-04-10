/**
 * Integration tests for the /api/health endpoint.
 * Uses Next.js route handler directly (no HTTP server needed).
 */

import { GET } from '@/app/api/health/route';
import { NextRequest } from 'next/server';

describe('GET /api/health', () => {
  it('should return 200 status', async () => {
    const response = await GET();
    expect(response.status).toBe(200);
  });

  it('should return JSON with status: ok', async () => {
    const response = await GET();
    const body = await response.json();
    expect(body.status).toBe('ok');
  });

  it('should include timestamp in ISO format', async () => {
    const response = await GET();
    const body = await response.json();
    expect(body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('should include uptime as a number', async () => {
    const response = await GET();
    const body = await response.json();
    expect(typeof body.uptime).toBe('number');
  });

  it('should include checks object', async () => {
    const response = await GET();
    const body = await response.json();
    expect(body.checks).toBeDefined();
    expect(body.checks.app).toBeDefined();
    expect(body.checks.app.status).toBe('ok');
    expect(body.checks.memory).toBeDefined();
  });

  it('should include responseTime', async () => {
    const response = await GET();
    const body = await response.json();
    expect(body.responseTime).toMatch(/ms$/);
  });

  it('should set no-store cache header', async () => {
    const response = await GET();
    const cacheHeader = response.headers.get('Cache-Control');
    expect(cacheHeader).toContain('no-store');
  });

  it('should return version string', async () => {
    const response = await GET();
    const body = await response.json();
    expect(typeof body.version).toBe('string');
    expect(body.version.length).toBeGreaterThan(0);
  });

  it('should return environment field', async () => {
    const response = await GET();
    const body = await response.json();
    expect(['development', 'production', 'test']).toContain(body.environment);
  });

  it('should include memory heap info', async () => {
    const response = await GET();
    const body = await response.json();
    expect(body.checks.memory.heapUsed).toMatch(/MB$/);
    expect(body.checks.memory.heapTotal).toMatch(/MB$/);
  });
});
