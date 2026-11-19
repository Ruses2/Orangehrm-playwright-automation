import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/dashboardPage';
import { loginAsAdmin } from '../utils/helpers';

test.describe('OrangeHRM Dashboard', () => {

  // Login before every dashboard test
  // Dashboard is only accessible when logged in
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  // Page Load 

  test('dashboard loads successfully after login', async ({ page }) => {
    // Simply verify the URL and that page title is correct
    await expect(page).toHaveURL(/dashboard/);
    await expect(page).toHaveTitle(/OrangeHRM/);
  });

  // Widgets

  test('time at work widget is visible', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await expect(dashboard.timeAtWorkWidget).toBeVisible();
  });

  test('my actions widget is visible', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await expect(dashboard.myActionsWidget).toBeVisible();
  });

  test('quick launch widget is visible', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await expect(dashboard.quickLaunchWidget).toBeVisible();
  });

  // Sidebar Navigation

  test('all main menu items are visible in sidebar', async ({ page }) => {
    const dashboard = new DashboardPage(page);

    // Check each menu item is present and clickable
    await expect(dashboard.adminMenu).toBeVisible();
    await expect(dashboard.pimMenu).toBeVisible();
    await expect(dashboard.leaveMenu).toBeVisible();
    await expect(dashboard.timeMenu).toBeVisible();
    await expect(dashboard.recruitmentMenu).toBeVisible();
    await expect(dashboard.myInfoMenu).toBeVisible();
  });

  test('clicking PIM navigates to employee list', async ({ page }) => {
    const dashboard = new DashboardPage(page);

    await dashboard.goToPIM();

    await expect(page).toHaveURL(/viewEmployeeList/);
  });

  test('clicking Leave navigates to leave module', async ({ page }) => {
    const dashboard = new DashboardPage(page);

    await dashboard.goToLeave();

    await expect(page).toHaveURL(/leaveUsage|leave/);
  });

  test('clicking Recruitment navigates to recruitment module', async ({ page }) => {
    const dashboard = new DashboardPage(page);

    await dashboard.goToRecruitment();

    await expect(page).toHaveURL(/recruitment/);
  });

  // Sidebar Search

  test('sidebar search filters menu items correctly', async ({ page }) => {
    const dashboard = new DashboardPage(page);

    // Type "leave" in sidebar search
    await dashboard.searchSidebar('leave');

    // Only Leave related menu should remain visible
    await expect(dashboard.leaveMenu).toBeVisible();

    // Admin menu should be hidden after filtering
    await expect(dashboard.adminMenu).toBeHidden();
  });

  // User Profile 

  test('logged in username is shown in top right', async ({ page }) => {
    const dashboard = new DashboardPage(page);

    const username = await dashboard.getLoggedInUsername();

    // OrangeHRM demo always shows "Admin" as display name
    expect(username).toBeTruthy();
  });

  test('user can logout from dashboard', async ({ page }) => {
    const dashboard = new DashboardPage(page);

    await dashboard.logout();

    // After logout should be back on login screen
    await expect(page).toHaveURL(/login/);
  });

});