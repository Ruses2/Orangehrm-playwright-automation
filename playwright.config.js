const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,   // run one test at a time, easier to follow
  retries: 0,
  timeout: 90000,
  use: {
    baseURL: 'https://opensource-demo.orangehrmlive.com',
    headless: false,
    slowMo: 800,        
    screenshot: 'only-on-failure',
    actionTimeout: 20000,
    navigationTimeout: 60000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});