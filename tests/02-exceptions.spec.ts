import { test, expect } from './baseFixtures';
import { HEADER_SELECTOR, TABS_CONTENT_SELECTOR } from './constants';
import { getLovelaceUrl } from './utilities';

test('No config', async ({ page }) => {
    await page.goto(
        getLovelaceUrl('no-config')
    );
    await expect(page.locator(HEADER_SELECTOR)).toBeVisible();
    await expect(page.locator(TABS_CONTENT_SELECTOR)).toHaveScreenshot('01-no-config.png');
});

test('Not enabled', async ({ page }) => {
    await page.goto(
        getLovelaceUrl('not-enabled')
    );
    await expect(page.locator(HEADER_SELECTOR)).toBeVisible();
    await expect(page.locator(TABS_CONTENT_SELECTOR)).toHaveScreenshot('01-no-config.png');
});

test('Not texts', async ({ page }) => {
    await page.goto(
        getLovelaceUrl('no-texts')
    );
    await expect(page.locator(HEADER_SELECTOR)).toBeVisible();
    await expect(page.locator(TABS_CONTENT_SELECTOR)).toHaveScreenshot('01-no-config.png');
});

test('No tabs', async ({ page }) => {
    const HEADER = '.header';
    await page.goto(
        getLovelaceUrl('no-tabs')
    );
    await expect(page.locator(HEADER)).toBeVisible();
    await expect(page.locator(HEADER)).toHaveScreenshot('02-no-tabs.png');
});

test('Should be the same after a window resize', async ({ page }) => {
    await page.goto(
        getLovelaceUrl()
    );
    await expect(page.locator(HEADER_SELECTOR)).toBeVisible();
    await page.evaluate(() => window.dispatchEvent(new Event('resize')));
    await page.waitForTimeout(200);
    await expect(page.locator(TABS_CONTENT_SELECTOR)).toHaveScreenshot('03-no-changes.png');
});

test('Config with error', async ({ page }) => {
    page.on('pageerror', error => {
        expect(error.message).toBe('keep-texts-in-tabs: Configuration cannot have "include" and "exclude" properties at the same time');
    });
    await page.goto(
        getLovelaceUrl('config-with-error')
    );
    await expect(page.locator(HEADER_SELECTOR)).toBeVisible();
});