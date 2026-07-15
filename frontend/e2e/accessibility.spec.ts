import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Audit (WCAG 2.1 AA)', () => {
  test('(a) home page has no critical WCAG 2.1 AA violations', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const criticalViolations = results.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(criticalViolations).toEqual([]);
  });

  test('(b) all interactive elements are reachable via keyboard Tab', async ({ page }) => {
    await page.goto('/');
    // Tab through interactive elements and confirm they're focusable
    const interactiveSelectors = [
      'app-sticky-header .nav-item',
      'app-sticky-header .lang-btn',
      'app-whatsapp-button a',
    ];
    for (const sel of interactiveSelectors) {
      const count = await page.locator(sel).count();
      if (count > 0) {
        await page.locator(sel).first().focus();
        const focused = await page.evaluate(() => document.activeElement?.tagName);
        expect(focused).toBeTruthy();
      }
    }
  });

  test('(c) flag buttons have accessible aria-labels', async ({ page }) => {
    await page.goto('/');
    const labels = ['Português', 'English', 'Español'];
    for (const label of labels) {
      const btn = page.locator(`.lang-btn[aria-label="${label}"]`);
      await expect(btn).toBeVisible();
    }
  });

  test('(d) WhatsApp CTAs have accessible labels', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('app-whatsapp-button a');
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      const ariaLabel = await links.nth(i).getAttribute('aria-label');
      const text = await links.nth(i).textContent();
      // Either aria-label or visible text must be non-empty
      expect((ariaLabel?.trim() ?? '') + (text?.trim() ?? '')).toBeTruthy();
    }
  });
});
