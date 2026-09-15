const { test, expect } = require('@playwright/test');
const { api } = require('../utils/constants');
const { measureResponseTime } = require('../utils/helpers');

test.describe('@api User API CRUD', () => {
  test('GET /users/1 returns an existing user', async ({ request }) => {
    const { response, durationMs } = await measureResponseTime(() =>
      request.get(`${api.baseUrl}/users/1`)
    );

    expect(response.status()).toBe(200);
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('application/json');
    expect(durationMs).toBeLessThan(3000);

    const body = await response.json();
    expect(body).toEqual(expect.objectContaining({
      id: 1,
      username: expect.any(String),
      email: expect.any(String),
      firstName: expect.any(String),
      lastName: expect.any(String),
    }));
  });

  test('POST /users/add creates a simulated user', async ({ request }) => {
    const payload = {
      firstName: 'Playwright',
      lastName: 'Automation',
      age: 29,
      email: `qa.${Date.now()}@example.test`,
    };

    const response = await request.post(`${api.baseUrl}/users/add`, { data: payload });
    expect(response.status()).toBe(201);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();
    expect(body.id).toEqual(expect.any(Number));
    expect(body).toMatchObject(payload);
  });

  test('PUT /users/1 updates a simulated user', async ({ request }) => {
    const payload = { firstName: 'UpdatedByPlaywright' };
    const response = await request.put(`${api.baseUrl}/users/1`, { data: payload });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.id).toBe(1);
    expect(body.firstName).toBe(payload.firstName);
  });

  test('DELETE /users/1 returns deletion metadata', async ({ request }) => {
    const response = await request.delete(`${api.baseUrl}/users/1`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.id).toBe(1);
    expect(body.isDeleted).toBe(true);
    expect(body.deletedOn).toEqual(expect.any(String));
  });
});
