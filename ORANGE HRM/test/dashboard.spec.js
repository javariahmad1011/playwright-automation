const { test, expect } = require('../fixtures/testData');
const DashboardPage = require('../pages/DashboardPage');

test.describe('Dashboard', () => {
  test('@smoke dashboard displays at least one operational widget', async ({ authenticatedPage }) => {
    const dashboard = new DashboardPage(authenticatedPage);
    await dashboard.expectLoaded();
    await dashboard.expectWidgetsVisible(1);
  });

  test('primary navigation contains expected administration modules', async ({ authenticatedPage }) => {
    const dashboard = new DashboardPage(authenticatedPage);
    await dashboard.expectNavigationItem('Admin');
    await dashboard.expectNavigationItem('PIM');
    await dashboard.expectNavigationItem('Leave');
  });

  test('navigation from dashboard to PIM works', async ({ authenticatedPage }) => {
    const dashboard = new DashboardPage(authenticatedPage);
    await dashboard.navigateTo('PIM');
    await expect(authenticatedPage).toHaveURL(/\/pim\/viewEmployeeList/);
  });

  test('authenticated user profile control is visible', async ({ authenticatedPage }) => {
    const dashboard = new DashboardPage(authenticatedPage);
    await dashboard.expectUserProfileVisible();
    await dashboard.openUserMenu();
    await expect(authenticatedPage.getByRole('menuitem', { name: /logout/i })).toBeVisible();
  });
});
