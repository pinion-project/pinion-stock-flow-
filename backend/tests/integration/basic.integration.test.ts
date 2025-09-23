import request from 'supertest';
import app from '@/app';

describe('Basic integration endpoints', () => {
  it('GET /health returns 200 and status payload', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message');
  });

  it('GET /api-docs serves swagger UI', async () => {
    const res = await request(app).get('/api-docs');
    expect([200, 301, 302]).toContain(res.status);
  });

  it('GET /metrics returns Prometheus metrics', async () => {
    const res = await request(app).get('/metrics');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/plain');
    expect(res.text).toContain('process_cpu_user_seconds_total');
  });
}); 