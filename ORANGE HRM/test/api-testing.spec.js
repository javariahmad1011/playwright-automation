const { test, expect } = require('@playwright/test');
const { api } = require('../utils/constants');
const { measureResponseTime } = require('../utils/helpers');

test.describe('@api API smoke coverage', () => {
  test('GET users validates status, content type, contract, and response time', async ({ request }) => {
    const { response, durationMs } = await measureResponseTime(() =>
      request.get(`${api.baseUrl}${api.users}?limit=5`)
    );

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    expect(durationMs).toBeLessThan(3000);

    const body = await response.json();
    expect(Array.isArray(body.users)).toBe(true);
    expect(body.users.length).toBeGreaterThan(0);

    for (const user of body.users) {
      expect(user).toEqual(expect.objectContaining({
        id: expect.any(Number),
        firstName: expect.any(String),
        lastName: expect.any(String),
        email: expect.any(String),
      }));
    }
  });

  test('POST user validates the simulated create contract', async ({ request }) => {
    const payload = { firstName: 'Automation', lastName: 'Engineer', age: 30 };
    const response = await request.post(`${api.baseUrl}${api.addUser}`, { data: payload });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toMatchObject(payload);
    expect(body.id).toEqual(expect.any(Number));
  });
});
