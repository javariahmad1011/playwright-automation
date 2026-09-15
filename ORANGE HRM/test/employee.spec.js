const { test, expect } = require('../fixtures/testData');
const EmployeePage = require('../pages/EmployeePage');
const employeeData = require('../tests-data/employeeData.json');
const { generateEmployee } = require('../utils/helpers');

test.describe('Employee Management', () => {
  test('add employee creates a retrievable employee record', async ({ authenticatedPage }) => {
    const employeePage = new EmployeePage(authenticatedPage);
    const employee = generateEmployee(employeeData.defaultEmployee);
    let employeeId;

    try {
      employeeId = await employeePage.addEmployee(employee);
      expect(employeeId).toBeTruthy();
      const count = await employeePage.searchEmployeeById(employeeId);
      expect(count).toBeGreaterThanOrEqual(employeeData.search.expectedMinimumRows);
    } finally {
      if (employeeId) await employeePage.deleteEmployeeById(employeeId).catch(() => false);
    }
  });

  test('edit employee updates personal details', async ({ authenticatedPage }) => {
    const employeePage = new EmployeePage(authenticatedPage);
    const employee = generateEmployee();
    let employeeId;

    try {
      employeeId = await employeePage.addEmployee(employee);
      const updatedFirstName = `${employeeData.updatedEmployee.firstName}${Date.now().toString().slice(-4)}`;
      await employeePage.updateFirstName(employeeId, updatedFirstName);
      await employeePage.expectEmployeeDetails(employeeId, {
        firstName: updatedFirstName,
        lastName: employee.lastName,
      });
    } finally {
      if (employeeId) await employeePage.deleteEmployeeById(employeeId).catch(() => false);
    }
  });

  test('delete employee removes the record from employee search', async ({ authenticatedPage }) => {
    const employeePage = new EmployeePage(authenticatedPage);
    const employee = generateEmployee();
    const employeeId = await employeePage.addEmployee(employee);
    const deleted = await employeePage.deleteEmployeeById(employeeId);
    expect(deleted).toBe(true);
    const remainingRows = await employeePage.searchEmployeeById(employeeId);
    expect(remainingRows).toBe(0);
  });

  test('search employee returns a previously created employee', async ({ authenticatedPage }) => {
    const employeePage = new EmployeePage(authenticatedPage);
    const employee = generateEmployee();
    let employeeId;

    try {
      employeeId = await employeePage.addEmployee(employee);
      const rows = await employeePage.searchEmployeeById(employeeId);
      expect(rows).toBeGreaterThan(0);
    } finally {
      if (employeeId) await employeePage.deleteEmployeeById(employeeId).catch(() => false);
    }
  });

  test('employee details preserve submitted first, middle, and last names', async ({ authenticatedPage }) => {
    const employeePage = new EmployeePage(authenticatedPage);
    const employee = generateEmployee();
    let employeeId;

    try {
      employeeId = await employeePage.addEmployee(employee);
      await employeePage.expectEmployeeDetails(employeeId, employee);
    } finally {
      if (employeeId) await employeePage.deleteEmployeeById(employeeId).catch(() => false);
    }
  });
});
