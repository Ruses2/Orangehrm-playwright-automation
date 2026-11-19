export class EmployeePage {
  constructor(page) {
    this.page = page;

    // ── Employee List Screen ──────────────────────────────────────────

    // Using getByRole — most reliable, never breaks on class changes
    this.addEmployeeButton = page.getByRole('button', { name: 'Add' });

    // Search filter inputs — scoped inside the search form only
    this.searchNameInput   = page.locator('input[placeholder="Type for hints..."]').first();

    this.searchButton      = page.getByRole('button', { name: 'Search' });
    this.resetButton       = page.getByRole('button', { name: 'Reset' });

    // Table body
    this.employeeTable     = page.locator('.oxd-table');

    // No records message
    this.noRecordsFound    = page.locator(
      'span.oxd-text:has-text("No Records Found")'
    );

    // Pagination
    this.paginationInfo    = page.locator('.oxd-pagination-info');

    // ── Add Employee Screen ───────────────────────────────────────────
    this.firstNameInput    = page.locator('input[name="firstName"]');
    this.lastNameInput     = page.locator('input[name="lastName"]');
    this.employeeIdInput   = page.locator('.oxd-form-row input.oxd-input').last();
    this.saveButton        = page.getByRole('button', { name: 'Save' });

    // Employee ID — labeled field on add employee form
    this.employeeIdInput   = page.locator('.oxd-form-row input.oxd-input').last();

    this.saveButton        = page.getByRole('button', { name: 'Save' });
  }

  // ── Navigation ────────────────────────────────────────────────────────

  async goto() {
    await this.page.goto('/web/index.php/pim/viewEmployeeList');
    await this.page.waitForLoadState('networkidle');

  // Wait for table — not button — simpler and more reliable
  await this.page.waitForSelector('.oxd-table', { timeout: 30000 });
                }

  // ── Add Employee ──────────────────────────────────────────────────────

  async clickAddEmployee() {
    await this.addEmployeeButton.click();
    await this.page.waitForURL(/addEmployee/, { timeout: 20000 });
  }

  async fillEmployeeDetails(firstName, lastName, employeeId) {
    // Wait for form to be ready
    await this.firstNameInput.waitFor({ state: 'visible', timeout: 15000 });

    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);

    // Employee ID field — clear first then fill
    await this.employeeIdInput.clear();
    await this.employeeIdInput.fill(employeeId);
  }

  async saveEmployee() {
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle', { timeout: 30000 });
}

  // ── Search ────────────────────────────────────────────────────────────

  async searchByName(name) {
    await this.searchNameInput.fill(name);
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
    // Small wait for table to re-render results
    await this.page.waitForTimeout(2000);
  }

  async resetSearch() {
    await this.resetButton.click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(3000);   

  }

  // ── Read Results ───────────────────────────────────────────────────────

  async getEmployeeRowCount() {
    // Wait for table to settle completely
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);

    // Count all rows inside table body
    // Each employee is one <div role="row"> inside the table body
     const rows = this.page.locator('.oxd-table-body').getByRole('row');

  return await rows.count();
  }

  async isNoRecordsVisible() {
    return await this.noRecordsFound.isVisible();
  }

  // ── Edit Employee ──────────────────────────────────────────────────────

  async clickEditOnFirstResult() {
    // Edit button is identified by its icon class inside the button
    await this.page.locator('.oxd-table-body [role="row"]').first().getByRole('button').nth(0).click();       // 0 = edit button, 1 = delete button

    await this.page.waitForURL(/viewPersonalDetails|editEmployee/,{ timeout: 20000 });
  }

  // ── Delete Employee ────────────────────────────────────────────────────

  async selectFirstEmployee() {
    await this.page.locator('.oxd-table-body').getByRole('row').first().waitFor({ state: 'visible', timeout: 15000 });    await this.page.waitForTimeout(1000);
    await this.page.locator('.oxd-table-body').getByRole('row').first().locator('span i').click();
    await this.page.waitForTimeout(1000);

  }

  async deleteSelectedEmployee() {
    await this.page.getByRole('button', { hasText: 'Delete Selected' }).waitFor({ state: 'visible', timeout: 10000 }).click();
    await this.page.locator('button', { hasText: 'Delete Selected' }).click();
    await this.page.locator('button', { hasText: 'Yes, Delete' }).waitFor({ state: 'visible', timeout: 10000 });
    await this.page.locator('button', { hasText: 'Yes, Delete' }).click();
    await this.page.waitForLoadState('networkidle')

  }
}