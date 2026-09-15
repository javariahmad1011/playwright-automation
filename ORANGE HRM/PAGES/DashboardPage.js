const { expect } = require('@playwright/test');

class DashboardPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /dashboard/i });
    this.widgets = page.locator('.orangehrm-dashboard-widget');
    this.userDropdown = page.locator('.oxd-userdropdown-name');
    this.logoutLink = page.getByRole('menuitem', { name: /logout/i });
    this.sideMenuItems = page.locator('.oxd-main-menu-item');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/\/dashboard\//);
    await expect(this.heading).toBeVisible();
  }

  async expectWidgetsVisible(minimum = 1) {
    await expect(this.widgets.first()).toBeVisible();
    const count = await this.widgets.count();
    expect(count).toBeGreaterThanOrEqual(minimum);
  }

  async openUserMenu() {
    await this.userDropdown.click();
  }

  async logout() {
    await this.openUserMenu();
    await this.logoutLink.click();
    await expect(this.page).toHaveURL(/\/auth\/login/);
  }

  async expectUserProfileVisible() {
    await expect(this.userDropdown).toBeVisible();
    await expect(this.userDropdown).not.toHaveText('');
  }

  async navigateTo(menuName) {
    const menuItem = this.sideMenuItems.filter({ hasText: menuName }).first();
    await expect(menuItem).toBeVisible();
    await menuItem.click();
  }

  async expectNavigationItem(menuName) {
    await expect(this.sideMenuItems.filter({ hasText: menuName }).first()).toBeVisible();
  }
}

module.exports = DashboardPage;
