import { test, expect } from '@playwright/test';

test.describe('Automation Exercise', () => {
  test('seed', async ({ page }) => {
    // Bloquer publicités et bandeau de consentement : ils peuvent masquer les éléments
    await page.route(
      /googlesyndication|doubleclick|googleadservices|adservice\.google|fundingchoicesmessages/,
      (route) => route.abort()
    );

    await page.goto('/');
    await expect(page).toHaveTitle('Automation Exercise');
  });
});