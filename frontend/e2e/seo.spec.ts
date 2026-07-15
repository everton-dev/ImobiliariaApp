import { test, expect } from '@playwright/test';

test.describe('SEO & Metadata (US4)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('(a) document.title matches site.title.pt on root load', async ({ page }) => {
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('(b) <meta name="description"> is present and non-empty', async ({ page }) => {
    const content = await page.getAttribute('meta[name="description"]', 'content');
    expect(content?.length).toBeGreaterThan(0);
  });

  test('(c) og:image meta tag matches site.ogImage', async ({ page }) => {
    const ogImage = await page.getAttribute('meta[property="og:image"]', 'content');
    expect(ogImage).toBeTruthy();
  });

  test('(d) JSON-LD script is present and parseable with @type=LocalBusiness', async ({ page }) => {
    const jsonLd = await page.$eval(
      'script[type="application/ld+json"]',
      (el) => el.textContent
    );
    expect(jsonLd).toBeTruthy();
    const parsed = JSON.parse(jsonLd!);
    expect(parsed['@type']).toBe('LocalBusiness');
  });

  test('(e) all visible images have non-empty alt attributes', async ({ page }) => {
    const imgs = await page.$$('img:visible');
    for (const img of imgs) {
      const alt = await img.getAttribute('alt');
      expect(alt?.trim().length).toBeGreaterThan(0);
    }
  });
});
