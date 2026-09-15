const { test, expect } = require('../fixtures/testData');
const EmployeePage = require('../pages/EmployeePage');
const UserManagementPage = require('../pages/UserManagementPage');
const { generateEmployee, generateSystemUser, buildFullName } = require('../utils/helpers');

test.describe('User Management', () => {
  async function createEmployeeAndSystemUser(page) {
    const employeePage = new EmployeePage(page);
    const userPage = new UserManagementPage(page);
    const employee = generateEmployee();
    const employeeId = await employeePage.addEmployee(employee);
    const user = generateSystemUser({ employeeName: buildFullName(employee) });
    await userPage.createUser(user);
    return { employeePage, userPage, employeeId, user };
  }

  async function cleanup(created) {
    await created.userPage.deleteUser(created.user.username).catch(() => false);
    await created.employeePage.deleteEmployeeById(created.employeeId).catch(() => false);
  }

  test('create user adds a searchable system user', async ({ authenticatedPage }) => {
    let created;
    try {
      created = await createEmployeeAndSystemUser(authenticatedPage);
      const count = await created.userPage.searchUser(created.user.username);
      expect(count).toBeGreaterThan(0);
      await created.userPage.expectUserInResults(created.user.username);
    } finally {
      if (created) await cleanup(created);
    }
  });

  test('update user changes account status', async ({ authenticatedPage }) => {
    let created;
    try {
      created = await createEmployeeAndSystemUser(authenticatedPage);
      await created.userPage.updateUserStatus(created.user.username, 'Disabled');
      const count = await created.userPage.searchUser(created.user.username, { status: 'Disabled' });
      expect(count).toBeGreaterThan(0);
      await created.userPage.expectUserInResults(created.user.username);
    } finally {
      if (created) await cleanup(created);
    }
  });

  test('delete user removes the account from search results', async ({ authenticatedPage }) => {
    const created = await createEmployeeAndSystemUser(authenticatedPage);
    const deleted = await created.userPage.deleteUser(created.user.username);
    expect(deleted).toBe(true);
    const remainingRows = await created.userPage.searchUser(created.user.username);
    expect(remainingRows).toBe(0);
    await created.employeePage.deleteEmployeeById(created.employeeId).catch(() => false);
  });

  test('search user returns the exact created username', async ({ authenticatedPage }) => {
    let created;
    try {
      created = await createEmployeeAndSystemUser(authenticatedPage);
      await created.userPage.searchUser(created.user.username);
      await created.userPage.expectUserInResults(created.user.username);
    } finally {
      if (created) await cleanup(created);
    }
  });

  test('filter users by role and status returns matching records', async ({ authenticatedPage }) => {
    const userPage = new UserManagementPage(authenticatedPage);
    const count = await userPage.searchUser('', { role: 'Admin', status: 'Enabled' });
    expect(count).toBeGreaterThan(0);
    await userPage.expectEveryVisibleRowContains(['Admin', 'Enabled']);
  });
});
