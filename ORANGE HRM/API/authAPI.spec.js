const { test, expect } = require('@playwright/test');
const users = require('../fixtures/users.json');
const { api } = require('../utils/constants');
const { measureResponseTime } = require('../utils/helpers');

test.describe('@api Authentication API', () => {
  test('valid login returns access and refresh tokens', async ({ request }) => {
    const { response, durationMs } = await measureResponseTime(() =>
      request.post(`${api.baseUrl}${api.authLogin}`, {
        data: {
          username: users.apiUser.username,
          password: users.apiUser.password,
          expiresInMins: 30,
        },
      })
    );

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    expect(durationMs).toBeLessThan(3000);

    const body = await response.json();
    expect(body.username).toBe(users.apiUser.username);
    expect(body.accessToken).toEqual(expect.any(String));
    expect(body.refreshToken).toEqual(expect.any(String));
    expect(body.accessToken.length).toBeGreaterThan(20);
  });

  test('access token authorizes GET /auth/me', async ({ request }) => {
    const loginResponse = await request.post(`${api.baseUrl}${api.authLogin}`, {
      data: {
        username: users.apiUser.username,
        password: users.apiUser.password,
        expiresInMins: 30,
      },
    });

    expect(loginResponse.status()).toBe(200);
    const { accessToken } = await loginResponse.json();
    expect(accessToken).toBeTruthy();

    const meResponse = await request.get(`${api.baseUrl}${api.authMe}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    expect(meResponse.status()).toBe(200);
    const body = await meResponse.json();
    expect(body.username).toBe(users.apiUser.username);
    expect(body.email).toEqual(expect.any(String));
  });

  test('invalid credentials are rejected', async ({ request }) => {
    const response = await request.post(`${api.baseUrl}${api.authLogin}`, {
      data: {
        username: users.apiUser.username,
        password: 'not-the-correct-password',
      },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.message).toEqual(expect.any(String));
  });

  test('missing token cannot access the authenticated user endpoint', async ({ request }) => {
    const response = await request.get(`${api.baseUrl}${api.authMe}`);
    expect([401, 403]).toContain(response.status());
  });
});
