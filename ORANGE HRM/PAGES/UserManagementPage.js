const { expect } = require('@playwright/test');

class UserManagementPage {
  constructor(page) {
    this.page = page;
    this.adminMenu = page.locator('.oxd-main-menu-item').filter({ hasText: 'Admin' }).first();
    this.addButton = page.getByRole('button', { name: /add/i }).first();
    this.searchButton = page.getByRole('button', { name: /search/i });
    this.saveButton = page.getByRole('button', { name: /save/i });
    this.resultRows = page.locator('.oxd-table-body .oxd-table-card');
    this.noRecordsMessage = page.getByText(/no records found/i);
  }

  inputGroup(labelText) {
    return this.page.locator('.oxd-input-group').filter({ hasText: labelText }).first();
  }

  inputByLabel(labelText) {
    return this.inputGroup(labelText).locator('input').first();
  }

  selectByLabel(labelText) {
    return this.inputGroup(labelText).locator('.oxd-select-text').first();
  }

  async selectOption(labelText, optionText) {
    const select = this.selectByLabel(labelText);
    await select.click();
    const option = this.page.locator('[role="option"]').filter({ hasText: optionText }).first();
    await expect(option).toBeVisible();
    await option.click();
  }

  async goto() {
    await this.adminMenu.click();
    await expect(this.page).toHaveURL(/\/admin\/viewSystemUsers/);
  }

  async fillEmployeeAutocomplete(employeeName) {
    const input = this.inputByLabel('Employee Name');
    await input.fill(employeeName);
    const option = this.page.locator('.oxd-autocomplete-option').first();
    await expect(option).toBeVisible({ timeout: 10000 });
    await option.click();
  }

  async createUser(user) {
    await this.goto();
    await this.addButton.click();
    await expect(this.page).toHaveURL(/\/admin\/saveSystemUser/);
    await this.selectOption('User Role', user.role);
    await this.fillEmployeeAutocomplete(user.employeeName);
    await this.selectOption('Status', user.status);
    await this.inputByLabel('Username').fill(user.username);
    await this.inputByLabel('Password').fill(user.password);
    await this.inputByLabel('Confirm Password').fill(user.password);
    await this.saveButton.click();
    await expect(this.page).toHaveURL(/\/admin\/viewSystemUsers/);
  }

  async searchUser(username, filters = {}) {
    await this.goto();
    if (username) await this.inputByLabel('Username').fill(username);
    if (filters.role) await this.selectOption('User Role', filters.role);
    if (filters.status) await this.selectOption('Status', filters.status);
    await this.searchButton.click();

    await Promise.race([
      this.resultRows.first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => null),
      this.noRecordsMessage.waitFor({ state: 'visible', timeout: 10000 }).catch(() => null),
    ]);

    return this.resultRows.count();
  }

  async openUserForEdit(username) {
    const count = await this.searchUser(username);
    expect(count).toBeGreaterThan(0);
    const row = this.resultRows.filter({ hasText: username }).first();
    await row.locator('i.bi-pencil-fill').click();
    await expect(this.saveButton).toBeVisible();
  }

  async updateUserStatus(username, status) {
    await this.openUserForEdit(username);
    await this.selectOption('Status', status);
    await this.saveButton.click();
    await expect(this.page).toHaveURL(/\/admin\/viewSystemUsers/);
  }

  async deleteUser(username) {
    const count = await this.searchUser(username);
    if (count === 0) return false;
    const row = this.resultRows.filter({ hasText: username }).first();
    await row.locator('i.bi-trash').click();
    const dialog = this.page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: /yes, delete/i }).click();
    await expect(this.page.getByText(/successfully deleted/i)).toBeVisible();
    return true;
  }

  async expectUserInResults(username) {
    await expect(this.resultRows.filter({ hasText: username }).first()).toBeVisible();
  }

  async expectEveryVisibleRowContains(expectedTexts = []) {
    const count = await this.resultRows.count();
    expect(count).toBeGreaterThan(0);
    for (let index = 0; index < count; index += 1) {
      const rowText = await this.resultRows.nth(index).innerText();
      for (const expectedText of expectedTexts) expect(rowText).toContain(expectedText);
    }
  }
}

module.exports = UserManagementPage;
