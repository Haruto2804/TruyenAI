import { test, expect } from '@playwright/test';

test.describe('Admin Studio Flow', () => {
  const storyTitle = `Truyện Test Tự Động ${Date.now()}`;
  const chapterTitle = 'Chương 1: Bắt đầu Test';
  
  test('should create a new story and a chapter successfully', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: 'Quản lý truyện' })).toBeVisible();

    await page.getByRole('link', { name: 'Thêm Truyện Mới' }).click();
    await expect(page).toHaveURL(/\/admin\/story\/new/);
    
    await page.fill('input[name="title"]', storyTitle);
    await page.fill('input[name="genre"]', 'Kiểm Thử');
    await page.fill('textarea[name="summary"]', 'Đây là truyện được tạo tự động bởi Playwright.');
    
    await page.getByRole('button', { name: 'Tạo Truyện' }).click();
    
    await expect(page).toHaveURL('/admin');
    await expect(page.getByText(storyTitle)).toBeVisible();
    
    // Click Chi tiết link for this story
    const row = page.locator('tr').filter({ hasText: storyTitle });
    await row.getByRole('link', { name: 'Chi tiết' }).click();
    
    // Wait for navigation
    await expect(page).toHaveURL(/\/admin\/story\/.+/);
    
    // Click Đăng Chương Mới
    await page.getByRole('link', { name: 'Đăng Chương Mới' }).click();
    await expect(page).toHaveURL(/\/admin\/story\/.+\/chapter\/new/);
    
    await page.fill('input[name="title"]', chapterTitle);
    await page.fill('textarea[name="content"]', 'Nội dung chương test. Mọi thứ đang hoạt động cực kỳ mượt mà.');
    
    await page.getByRole('button', { name: 'Đăng Chương' }).click();
    
    await expect(page.getByText(chapterTitle)).toBeVisible();

    // --- TEST EDIT CHAPTER ---
    await page.getByRole('link', { name: 'Sửa chương' }).click();
    await expect(page).toHaveURL(/\/admin\/story\/.+\/chapter\/.+\/edit/);
    
    const updatedChapterTitle = chapterTitle + ' (Đã sửa)';
    await page.fill('input[name="title"]', updatedChapterTitle);
    await page.getByRole('button', { name: 'Cập Nhật Chương' }).click();
    
    await expect(page.getByText(updatedChapterTitle)).toBeVisible();

    // --- TEST DELETE CHAPTER ---
    page.on('dialog', dialog => dialog.accept()); // Accept the confirmation dialog
    await page.getByRole('button', { name: 'Xóa' }).click();
    
    // The chapter should no longer be visible
    await expect(page.getByText(updatedChapterTitle)).not.toBeVisible();

    // --- TEST EDIT STORY ---
    await page.goto('/admin');
    const storyRow = page.locator('tr').filter({ hasText: storyTitle });
    await storyRow.getByRole('link', { name: 'Sửa' }).click();
    
    const updatedStoryTitle = storyTitle + ' (Đã sửa)';
    await page.fill('input[name="title"]', updatedStoryTitle);
    await page.getByRole('button', { name: 'Cập Nhật' }).click();
    
    await expect(page).toHaveURL('/admin');
    await expect(page.getByText(updatedStoryTitle)).toBeVisible();

    // --- TEST DELETE STORY ---
    const updatedRow = page.locator('tr').filter({ hasText: updatedStoryTitle });
    await updatedRow.getByRole('button', { name: 'Xóa' }).click();
    
    // The story should no longer be visible
    await expect(page.getByText(updatedStoryTitle)).not.toBeVisible();
  });
});
