export class DashboardPage {
  constructor(page) {
    this.page = page;

    // Top navigation bar
    this.userProfileIcon  = page.locator('.oxd-userdropdown-img');
    this.userDropdownMenu = page.locator('.oxd-userdropdown-tab');
    this.logoutOption     = page.locator('a:has-text("Logout")');

    // Left sidebar navigation links
    this.adminMenu        = page.locator('a:has-text("Admin")');
    this.pimMenu          = page.locator('a:has-text("PIM")');
    this.leaveMenu        = page.locator('a:has-text("Leave")');
    this.timeMenu         = page.locator('a:has-text("Time")');
    this.recruitmentMenu  = page.locator('a:has-text("Recruitment")');
    this.myInfoMenu       = page.locator('a:has-text("My Info")');

    // Dashboard widgets — the cards visible after login
    this.timeAtWorkWidget     = page.locator('.oxd-sheet').filter({ hasText: 'Time at Work' });
    this.myActionsWidget      = page.locator('.oxd-sheet').filter({ hasText: 'My Actions' });
    this.quickLaunchWidget    = page.locator('.oxd-sheet').filter({ hasText: 'Quick Launch' });

    // Search bar in the sidebar
    this.sidebarSearch    = page.locator('.oxd-main-menu-search input');
  }

  // Click the user icon to open dropdown
  async openUserDropdown() {
    await this.userDropdownMenu.click();
  }

  // Full logout flow
  async logout() {
    await this.openUserDropdown();
    await this.logoutOption.click();
    await this.page.waitForURL(/login/);
  }

  // Get the username shown in the top right corner
  async getLoggedInUsername() {
    await this.openUserDropdown();
    return await this.page
      .locator('.oxd-userdropdown-name')
      .textContent();
  }

  // Navigate to any module from sidebar
  async goToAdmin()       { await this.adminMenu.click(); }
  async goToPIM()         { await this.pimMenu.click(); }
  async goToLeave()       { await this.leaveMenu.click(); }
  async goToRecruitment() { await this.recruitmentMenu.click(); }
  async goToMyInfo()      { await this.myInfoMenu.click(); }

  // Type in the sidebar search to filter menu items
  async searchSidebar(keyword) {
    await this.sidebarSearch.fill(keyword);
  }
}