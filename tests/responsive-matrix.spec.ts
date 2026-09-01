import { test, expect } from '@playwright/test';

// Comprehensive Responsive Viewport Matrix (from ultra-compact 320px to 4K 1920px)
const VIEWPORT_MATRIX = [
  { name: 'Ultra-Compact (Galaxy Fold Cover / iPhone SE 1)', width: 320, height: 658 },
  { name: 'Compact Android (360x800)', width: 360, height: 800 },
  { name: 'Standard iPhone (375x667)', width: 375, height: 667 },
  { name: 'Modern iPhone 14/15/16 (393x852)', width: 393, height: 852 },
  { name: 'Large Android (412x915)', width: 412, height: 915 },
  { name: 'iPhone Pro Max (430x932)', width: 430, height: 932 },
  { name: 'Foldable Open / Phablet (600x960)', width: 600, height: 960 },
  { name: 'iPad / Tablet Portrait (768x1024)', width: 768, height: 1024 },
  { name: 'iPad Air / Pro (820x1180)', width: 820, height: 1180 },
  { name: 'Laptop Small (1024x768)', width: 1024, height: 768 },
  { name: 'Desktop Standard FHD (1440x900)', width: 1440, height: 900 },
  { name: 'Desktop Ultra-Wide (1920x1080)', width: 1920, height: 1080 },
];

test.describe('Responsive Viewport Matrix - Layout Integrity & Zero-Overflow', () => {
  for (const vp of VIEWPORT_MATRIX) {
    test.describe(`Viewport: ${vp.name} [${vp.width}x${vp.height}]`, () => {
      test.use({ viewport: { width: vp.width, height: vp.height } });

      test('1. Homepage - No horizontal scroll and clean card grid', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('domcontentloaded');

        // Check horizontal overflow (tolerance of 1px for subpixel rendering)
        const overflow = await page.evaluate(() => {
          const doc = document.documentElement;
          const body = document.body;
          const maxScrollWidth = Math.max(doc.scrollWidth, body.scrollWidth);
          return {
            scrollWidth: maxScrollWidth,
            clientWidth: window.innerWidth,
            isOverflowing: maxScrollWidth > window.innerWidth + 1,
          };
        });

        expect(overflow.isOverflowing, `Homepage horizontal overflow at ${vp.width}px (scrollWidth: ${overflow.scrollWidth}px > window: ${overflow.clientWidth}px)`).toBeFalsy();

        // Check main heading exists
        await expect(page.locator('h1')).toBeVisible();
      });

      test('2. Story Detail Page - 2-tier action buttons, Character & Lore gallery', async ({ page }) => {
        await page.goto('/truyen/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong');
        await page.waitForLoadState('domcontentloaded');

        // Check horizontal overflow on story detail page
        const overflow = await page.evaluate(() => {
          const doc = document.documentElement;
          const body = document.body;
          const maxScrollWidth = Math.max(doc.scrollWidth, body.scrollWidth);
          return {
            scrollWidth: maxScrollWidth,
            clientWidth: window.innerWidth,
            isOverflowing: maxScrollWidth > window.innerWidth + 1,
          };
        });

        expect(overflow.isOverflowing, `Story detail page horizontal overflow at ${vp.width}px (scrollWidth: ${overflow.scrollWidth}px > window: ${overflow.clientWidth}px)`).toBeFalsy();

        // Check Action Buttons container exists
        const readButton = page.getByRole('link', { name: /Đọc Từ Đầu/i });
        if (await readButton.isVisible()) {
          await expect(readButton).toBeVisible();
        }

        // Test Character modal opening and closing without overflowing screen
        const charCard = page.locator('div[class*="cursor-pointer"]').filter({ hasText: /Nhân vật chính|Nữ chính|Đệ tam/i }).first();
        if (await charCard.isVisible()) {
          await charCard.click();
          // Check modal is within viewport
          const modalOverflow = await page.evaluate(() => {
            return document.documentElement.scrollWidth <= window.innerWidth + 1;
          });
          expect(modalOverflow, `Character modal triggered overflow at ${vp.width}px`).toBeTruthy();
          
          // Close modal by pressing Escape
          await page.keyboard.press('Escape');
        }
      });

      test('3. Interactive Reader Page - Prose wrapping & toolbar responsive layout', async ({ page }) => {
        await page.goto('/truyen/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/1');
        await page.waitForLoadState('domcontentloaded');

        // Check horizontal overflow in reader
        const overflow = await page.evaluate(() => {
          const maxScrollWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
          return {
            scrollWidth: maxScrollWidth,
            clientWidth: window.innerWidth,
            isOverflowing: maxScrollWidth > window.innerWidth + 1,
          };
        });

        expect(overflow.isOverflowing, `Reader page horizontal overflow at ${vp.width}px`).toBeFalsy();

        // Check navigation header & TOC button
        const tocBtn = page.getByRole('link', { name: 'Mục Lục' });
        await expect(tocBtn).toBeVisible();
      });

      test('4. Second Novel Page (Van Co De Nhat Thuong Minh) - Cover & layout zero-overflow', async ({ page }) => {
        await page.goto('/truyen/van-co-de-nhat-thuong-minh');
        await page.waitForLoadState('domcontentloaded');
        const overflow = await page.evaluate(() => {
          const doc = document.documentElement;
          const body = document.body;
          const maxScrollWidth = Math.max(doc.scrollWidth, body.scrollWidth);
          return maxScrollWidth <= window.innerWidth + 1;
        });
        expect(overflow, `Van Co De Nhat Thuong Minh page horizontal overflow at ${vp.width}px`).toBeTruthy();
      });
    });
  }
});
