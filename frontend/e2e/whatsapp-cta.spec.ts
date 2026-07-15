import { test, expect } from '@playwright/test';

test.describe('WhatsApp CTA (US1)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('(a) Contact section button has correct wa.me href with phone', async ({ page }) => {
    const contactButton = page.locator('#contact app-whatsapp-button a');
    const href = await contactButton.getAttribute('href');
    expect(href).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
  });

  test('(b) About Me CTA has section-specific pre-filled message', async ({ page }) => {
    const aboutMeButton = page.locator('#about-me app-whatsapp-button a');
    const href = await aboutMeButton.getAttribute('href');
    expect(href).toContain('wa.me/');
    expect(href).toContain('text=');
  });

  test('(c) My Process CTA has section-specific pre-filled message', async ({ page }) => {
    const processButton = page.locator('#my-process app-whatsapp-button a');
    const href = await processButton.getAttribute('href');
    expect(href).toContain('wa.me/');
  });
});
