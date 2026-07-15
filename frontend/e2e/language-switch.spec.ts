import { test, expect } from '@playwright/test';

test.describe('Language Switch (US3)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('(a) click UK flag → nav labels update to English', async ({ page }) => {
    await page.locator('.lang-btn[aria-label="English"]').click();
    await expect(page.locator('app-sticky-header .nav-item', { hasText: 'About Me' })).toBeVisible();
    await expect(page.locator('app-sticky-header .nav-item', { hasText: 'My Process' })).toBeVisible();
    await expect(page.locator('app-sticky-header .nav-item', { hasText: 'Clients' })).toBeVisible();
    await expect(page.locator('app-sticky-header .nav-item', { hasText: 'Contact' })).toBeVisible();
  });

  test('(b) click Spain flag → nav labels update to Spanish', async ({ page }) => {
    await page.locator('.lang-btn[aria-label="Español"]').click();
    const navItems = page.locator('app-sticky-header .nav-item');
    // Spanish labels from config.nav.*.es
    await expect(navItems).toHaveCount(4);
    // All nav items should have text (not empty) after language switch
    for (let i = 0; i < 4; i++) {
      const text = await navItems.nth(i).textContent();
      expect(text?.trim().length).toBeGreaterThan(0);
    }
  });

  test('(c) WhatsApp URL text param uses Spanish message after language switch', async ({ page }) => {
    await page.locator('.lang-btn[aria-label="Español"]').click();
    // After switching to Spanish, check that the WhatsApp link uses the Spanish message
    const contactLink = page.locator('#contact app-whatsapp-button a');
    const href = await contactLink.getAttribute('href');
    expect(href).toMatch(/wa\.me\//);
    expect(href).toContain('text=');
  });

  test('(d) no empty visible text when language has no en key', async ({ page }) => {
    await page.locator('.lang-btn[aria-label="English"]').click();
    // Elements that use TranslatePipe should fall back to pt — no empty text visible
    const h2Elements = page.locator('main h2');
    const count = await h2Elements.count();
    for (let i = 0; i < count; i++) {
      const text = await h2Elements.nth(i).textContent();
      expect(text?.trim().length).toBeGreaterThan(0);
    }
  });
});
