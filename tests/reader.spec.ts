import { test, expect } from '@playwright/test';

test.describe('Reader Flow', () => {
  test('should view story details and read chapter', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Kho Tàng Kỳ Thư' })).toBeVisible();
    
    // Check if there are stories on the homepage
    const storyLink = page.locator('a[href^="/truyen/"]').first();
    
    if (await storyLink.isVisible()) {
      await storyLink.click();
      
      // Wait for navigation to complete
      await expect(page).toHaveURL(/\/truyen\/.+/);
      
      // Use a more relaxed text matcher for "Danh sách chương"
      await expect(page.locator('text=Danh sách chương').first()).toBeVisible();
      
      const readButton = page.getByRole('link', { name: 'Đọc Từ Đầu' });
      
      if (await readButton.isVisible()) {
        await readButton.click();
        
        await expect(page).toHaveURL(/\/truyen\/.+\/.+/);
        await expect(page.locator('.prose')).toBeVisible();
        await expect(page.getByRole('link', { name: 'Mục Lục' })).toBeVisible();
      }
    }
  });
});
