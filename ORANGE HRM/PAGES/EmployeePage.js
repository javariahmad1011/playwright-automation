const { expect } = require('@playwright/test');

class EmployeePage {
  constructor(page) {
    this.page = page;
    this.pimMenu = page.locator('.oxd-main-menu-item').filter({ hasText: 'PIM' }).first();
    this.addButton = page.getByRole('button', { name: /add/i }).first();
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.middleNameInput = page.locator('input[name="middleName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.saveButton = page.getByRole('button', { name: /save/i }).first();
    this.personalDetailsHeading = page.getByRole('heading', { name: /personal details/i });
    this.resultRows = page.locator('.oxd-table-body .oxd-table-card');
    this.noRecordsMessage = page.getByText(/no records found/i);
  }

  inputGroup(labelText) {
    return this.page.locator('.oxd-input-group').filter({ hasText: labelText }).first();
  }

  inputByLabel(labelText) {
    return this.inputGroup(labelText).locator('input').first();
  }

  async gotoEmployeeList() {
    await this.pimMenu.click();
    await expect(this.page).toHaveURL(/\/pim\/viewEmployeeList/);
  }

  async gotoAddEmployee() {
    await this.gotoEmployeeList();
    await this.addButton.click();
    await expect(this.page).toHaveURL(/\/pim\/addEmployee/);
  }

  async addEmployee(employee) {
    await this.gotoAddEmployee();
    await this.firstNameInput.fill(employee.firstName);
    if (employee.middleName) await this.middleNameInput.fill(employee.middleName);
    await this.lastNameInput.fill(employee.lastName);
    await this.saveButton.click();
    await expect(this.personalDetailsHeading).toBeVisible();
    await expect(this.page).toHaveURL(/\/pim\/viewPersonalDetails\/empNumber\//);
    return this.getEmployeeId();
  }

  async getEmployeeId() {
    const employeeIdInput = this.inputByLabel('Employee Id');
    await expect(employeeIdInput).toBeVisible();
    return employeeIdInput.inputValue();
  }

  async searchEmployeeById(employeeId) {
    await this.gotoEmployeeList();
    const employeeIdInput = this.inputByLabel('Employee Id');
    await employeeIdInput.fill(employeeId);
    await this.page.getByRole('button', { name: /search/i }).click();

    await Promise.race([
      this.resultRows.first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => null),
      this.noRecordsMessage.waitFor({ state: 'visible', timeout: 10000 }).catch(() => null),
    ]);

    return this.resultRows.count();
  }

  async openEmployeeById(employeeId) {
    const rowCount = await this.searchEmployeeById(employeeId);
    expect(rowCount).toBeGreaterThan(0);
    await this.resultRows.first().locator('i.bi-pencil-fill').click();
    await expect(this.personalDetailsHeading).toBeVisible();
  }

  async updateFirstName(employeeId, newFirstName) {
    await this.openEmployeeById(employeeId);
    await this.firstNameInput.fill(newFirstName);
    const personalDetailsForm = this.page.locator('form').filter({ has: this.firstNameInput }).first();
    await personalDetailsForm.getByRole('button', { name: /save/i }).click();
    await expect(this.page.getByText(/successfully updated/i)).toBeVisible();
  }

  async deleteEmployeeById(employeeId) {
    const rowCount = await this.searchEmployeeById(employeeId);
    if (rowCount === 0) return false;

    await this.resultRows.first().locator('i.bi-trash').click();
    const confirmationDialog = this.page.getByRole('dialog');
    await expect(confirmationDialog).toBeVisible();
    await confirmationDialog.getByRole('button', { name: /yes, delete/i }).click();
    await expect(this.page.getByText(/successfully deleted/i)).toBeVisible();
    return true;
  }

  async expectEmployeeDetails(employeeId, expected) {
    await this.openEmployeeById(employeeId);
    if (expected.firstName) await expect(this.firstNameInput).toHaveValue(expected.firstName);
    if (expected.middleName !== undefined) await expect(this.middleNameInput).toHaveValue(expected.middleName);
    if (expected.lastName) await expect(this.lastNameInput).toHaveValue(expected.lastName);
  }
}

module.exports = EmployeePage;
