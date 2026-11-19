import { ADMIN } from '../fixtures/testData';
import { timeout } from '../playwright.config';
// Reusable login function
// Every test that needs a logged-in session calls this
// instead of repeating the same steps every time
export async function loginAsAdmin(page) {
  await page.goto('/web/index.php/auth/login',{
    waitUntil: 'networkidle',
    timeout:60000
  });
  await page.locator('input[name="username"]').fill(ADMIN.username);
  await page.locator('input[name="password"]').fill(ADMIN.password);
  await page.locator('button[type="submit"]').click();

 // Wait for dashboard with generous timeout
await page.waitForURL(/dashboard/, { timeout: 60000 });
}