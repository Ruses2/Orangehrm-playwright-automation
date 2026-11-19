import { test, expect } from '@playwright/test';
import { EmployeePage } from '../pages/employeePage';
import { loginAsAdmin } from '../utils/helpers';
import {
  NEW_EMPLOYEE,
  EDITED_EMPLOYEE,
  NONEXISTENT_EMPLOYEE
} from '../fixtures/testData';

test.describe('Employee Module (PIM)', () => {

  // Login and go to employee list before every test
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    const employee = new EmployeePage(page);
    await employee.goto();
  });

  // ── Employee List

  test('employee list loads with records', async ({ page }) => {
    const employee = new EmployeePage(page);

    // Table should be visible
    await expect(employee.employeeTable).toBeVisible();

    // Should have at least 1 employee row
    const rowCount = await employee.getEmployeeRowCount();
    expect(rowCount).toBeGreaterThan(0);
  });

  // ── Add Employee 

  test('can add a new employee successfully', async ({ page }) => {
    const employee = new EmployeePage(page);

    // Step 1 — click Add Employee button
    await employee.clickAddEmployee();

    // Step 2 — fill in the form
    await employee.fillEmployeeDetails(
      NEW_EMPLOYEE.firstName,
      NEW_EMPLOYEE.lastName,
      NEW_EMPLOYEE.employeeId
    );

    // Step 3 — save
    await employee.saveEmployee();

    // Step 4 — after save, personal details page loads
    // Verify first name appears on the page confirming save worked
    await expect(
      page.locator('input[name="firstName"]')
    ).toHaveValue(NEW_EMPLOYEE.firstName);
  });

  // ── Search Employee 

  test('search by name returns matching results', async ({ page }) => {
    const employee = new EmployeePage(page);

    await employee.searchByName('john');

    // Table should show results
    await expect(employee.employeeTable).toBeVisible();

    const rowCount = await employee.getEmployeeRowCount();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('search by invalid name shows no records found', async ({ page }) => {
    const employee = new EmployeePage(page);

    await employee.searchByName(NONEXISTENT_EMPLOYEE.name);

    // No records message should appear
    await expect(employee.noRecordsFound).toBeVisible();
  });

  test('reset button clears search and shows all employees', async ({ page }) => {
    const employee = new EmployeePage(page);

    // First search for something specific
    await employee.searchByName(NEW_EMPLOYEE.firstName);

    // Then reset
    await employee.resetSearch();

    // All employees should be back
    const rowCount = await employee.getEmployeeRowCount();
    expect(rowCount).toBeGreaterThan(0);
  });

  // ── Edit Employee 

  test('can open edit screen for an employee', async ({ page }) => {
    const employee = new EmployeePage(page);

    // Search to find our test employee first
    await employee.searchByName(NEW_EMPLOYEE.firstName);

    // Click edit on first result
    await employee.clickEditOnFirstResult();

    // Edit page should load — URL contains viewPersonalDetails or editEmployee
    await expect(page).toHaveURL(/viewPersonalDetails|editEmployee/);
  });

  // ── Delete Employee 

 test('can delete an employee from the list', async ({ page }) => {
  const employee = new EmployeePage(page);

  // Step 1 — Add a fresh employee for this test
  const timestamp = Date.now();
  const deleteTestEmployee = {
    firstName:  'DeleteMe',
    lastName:   `Test${timestamp}`,
    employeeId: `DEL${timestamp}`,
  };

  await employee.clickAddEmployee();
  await employee.fillEmployeeDetails(
    deleteTestEmployee.firstName,
    deleteTestEmployee.lastName,
    deleteTestEmployee.employeeId
  );
  await employee.saveEmployee();

  // Step 2 — Go back to employee list
  await employee.goto();
  await page.waitForTimeout(3000);

  // Step 3 — Do NOT search — reset any filters so all employees show
  await employee.resetSearch();
  await page.waitForTimeout(2000);

  // Step 4 — Get total count before delete
  const countBefore = await employee.getEmployeeRowCount();
  console.log('Rows before delete:', countBefore);
  expect(countBefore).toBeGreaterThan(0);

  // Step 5 — Select first row and delete
  await employee.selectFirstEmployee();
  await employee.deleteSelectedEmployee();
  await page.waitForTimeout(2000);

  // Step 6 — Count after delete should be less
  const countAfter = await employee.getEmployeeRowCount();
  console.log('Rows after delete:', countAfter);
  expect(countAfter).toBeLessThan(countBefore);
});

  // ── Pagination 

  test('pagination info is visible on employee list', async ({ page }) => {
    const employee = new EmployeePage(page);

    // Pagination info like "Showing 1 to 10 of 50 Records"
    await expect(employee.paginationInfo).toBeVisible();
  });

});