import { test, expect } from '@playwright/test';

test.describe('Admin Studio Flow', () => {
  const storyTitle = `Truyện Test Tự Động ${Date.now()}`;
  const chapterTitle = 'Chương 1: Bắt đầu Test';
  
  test('should create a new story and a chapter successfully', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: 'Quản lý truyện' })).toBeVisible();

    await page.getByRole('link', { name: 'Thêm Truyện Mới' }).click();
    await expect(page).toHaveURL(/\/admin\/story\/new/);
    
    await page.fill('input[name="title"]', storyTitle);
    await page.fill('input[name="genre"]', 'Kiểm Thử');
    await page.fill('textarea[name="summary"]', 'Đây là truyện được tạo tự động bởi Playwright.');
    
    await page.getByRole('button', { name: 'Tạo Truyện' }).click();
    
    await expect(page).toHaveURL('/admin', { timeout: 15000 });
    await expect(page.getByText(storyTitle)).toBeVisible({ timeout: 15000 });
    
    // Click Chi tiết link for this story
    const row = page.locator('tr').filter({ hasText: storyTitle });
    await row.getByRole('link', { name: 'Chi tiết' }).click();
    
    // Wait for navigation
    await expect(page).toHaveURL(/\/admin\/story\/.+/, { timeout: 15000 });
    
    // Click Đăng Chương Mới
    await page.getByRole('link', { name: 'Đăng Chương Mới' }).click();
    await expect(page).toHaveURL(/\/admin\/story\/.+\/chapter\/new/, { timeout: 15000 });
    
    await page.fill('input[name="title"]', chapterTitle);
    await page.fill('textarea[name="content"]', 'Nội dung chương test. Mọi thứ đang hoạt động cực kỳ mượt mà.');
    
    await page.getByRole('button', { name: 'Đăng Chương' }).click();
    await expect(page).toHaveURL(/\/admin\/story\/[^/]+$/, { timeout: 15000 });
    await expect(page.locator('body')).toContainText(chapterTitle, { timeout: 15000 });

    // --- TEST EDIT CHAPTER ---
    await page.getByRole('link', { name: 'Sửa chương' }).click();
    await expect(page).toHaveURL(/\/admin\/story\/.+\/chapter\/.+\/edit/, { timeout: 15000 });
    
    const updatedChapterTitle = chapterTitle + ' (Đã sửa)';
    await page.fill('input[name="title"]', updatedChapterTitle);
    await page.getByRole('button', { name: 'Cập Nhật Chương' }).click();
    await expect(page).toHaveURL(/\/admin\/story\/[^/]+$/, { timeout: 15000 });
    await expect(page.locator('body')).toContainText(updatedChapterTitle, { timeout: 15000 });

    // --- TEST DELETE CHAPTER ---
    page.on('dialog', dialog => dialog.accept()); // Accept the confirmation dialog
    await page.getByRole('button', { name: 'Xóa' }).click();
    
    // The chapter should no longer be visible
    await expect(page.getByText(updatedChapterTitle)).not.toBeVisible({ timeout: 15000 });

    // --- TEST EDIT STORY ---
    await page.goto('/admin');
    const storyRow = page.locator('tr').filter({ hasText: storyTitle });
    await storyRow.getByRole('link', { name: 'Sửa' }).click();
    await expect(page).toHaveURL(/\/admin\/story\/.+\/edit/, { timeout: 15000 });
    
    const updatedStoryTitle = storyTitle + ' (Đã sửa)';
    await page.fill('input[name="title"]', updatedStoryTitle);
    await page.getByRole('button', { name: 'Cập Nhật Truyện' }).click();
    
    await expect(page).toHaveURL('/admin', { timeout: 15000 });
    await expect(page.getByText(updatedStoryTitle)).toBeVisible({ timeout: 15000 });

    // --- TEST DELETE STORY ---
    const updatedRow = page.locator('tr').filter({ hasText: updatedStoryTitle });
    await updatedRow.getByRole('button', { name: 'Xóa' }).click();
    
    // The story should no longer be visible
    await expect(page.getByText(updatedStoryTitle)).not.toBeVisible({ timeout: 15000 });
  });
});
