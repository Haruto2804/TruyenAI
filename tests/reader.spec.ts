import { test, expect } from '@playwright/test';

test.describe('Reader Flow', () => {
  test('should view story details and read chapter', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Kho Tàng');
    
    // Check if there are stories on the homepage
    const storyLink = page.locator('a[href^="/truyen/"]').first();
    
    if (await storyLink.isVisible()) {
      await storyLink.click();
      
      // Wait for navigation to complete
      await expect(page).toHaveURL(/\/truyen\/.+/);
      
      // Check chapter list
      await expect(page.locator('text=Danh sách chương').first()).toBeVisible();
      
      const readButton = page.getByRole('link', { name: /Đọc Từ Đầu/i });
      
      if (await readButton.isVisible()) {
        await readButton.click();
        
        await expect(page).toHaveURL(/\/truyen\/.+\/.+/);
        await expect(page.locator('.prose')).toBeVisible();
        await expect(page.getByRole('link', { name: 'Mục Lục' })).toBeVisible();
      }
    }
  });
});
