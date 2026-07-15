import { test, expect } from '@playwright/test';

test.describe('Sticky Header Navigation (US2)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('(a) header is visible on page load', async ({ page }) => {
    const header = page.locator('app-sticky-header header');
    await expect(header).toBeVisible();
  });

  test('(b) header contains exactly 4 nav links', async ({ page }) => {
    const navItems = page.locator('app-sticky-header .nav-item');
    await expect(navItems).toHaveCount(4);
  });

  test('(c) clicking Sobre Mim scrolls to #about-me', async ({ page }) => {
    await page.locator('app-sticky-header .nav-item', { hasText: 'Sobre Mim' }).click();
    await expect(page).toHaveURL(/#about-me/);
  });

  test('(d) clicking Contato scrolls to #contact', async ({ page }) => {
    await page.locator('app-sticky-header .nav-item', { hasText: 'Contato' }).click();
    await expect(page).toHaveURL(/#contact/);
  });

  test('(e) language switcher changes nav labels to English', async ({ page }) => {
    await page.locator('app-sticky-header .lang-btn[aria-label="English"]').click();
    await expect(page.locator('app-sticky-header .nav-item', { hasText: 'About Me' })).toBeVisible();
    await expect(page.locator('app-sticky-header .nav-item', { hasText: 'Contact' })).toBeVisible();
  });

  test('(f) three language flag buttons are present with aria-labels', async ({ page }) => {
    const flagBtns = page.locator('app-sticky-header .lang-btn');
    await expect(flagBtns).toHaveCount(3);
    await expect(page.locator('.lang-btn[aria-label="Português"]')).toBeVisible();
    await expect(page.locator('.lang-btn[aria-label="English"]')).toBeVisible();
    await expect(page.locator('.lang-btn[aria-label="Español"]')).toBeVisible();
  });
});
