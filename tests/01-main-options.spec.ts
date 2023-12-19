import { test, expect } from './baseFixtures';
import {
    HEADER_SELECTOR,
    TABS_CONTENT_SELECTOR,
    BASE_PAGE
} from './constants';
import { getLovelaceUrl } from './utilities';

test('Option: enabled', async ({ page }) => {
    await page.goto(
        getLovelaceUrl()
    );
    await expect(page.locator(HEADER_SELECTOR)).toBeVisible();
    await expect(page.locator(TABS_CONTENT_SELECTOR)).toHaveScreenshot('01-enabled.png');
});


test('Option: position', async ({ page }) => {
    await page.goto(
        getLovelaceUrl('position')
    );
    await expect(page.locator(HEADER_SELECTOR)).toBeVisible();
    await expect(page.locator(TABS_CONTENT_SELECTOR)).toHaveScreenshot('02-position.png');
});

test('Option: include', async ({ page }) => {
    await page.goto(
        getLovelaceUrl('include')
    );
    await expect(page.locator(HEADER_SELECTOR)).toBeVisible();
    await expect(page.locator(TABS_CONTENT_SELECTOR)).toHaveScreenshot('03-include.png');
});

test('Option: exclude', async ({ page }) => {
    await page.goto(
        getLovelaceUrl('exclude')
    );
    await expect(page.locator(HEADER_SELECTOR)).toBeVisible();
    await expect(page.locator(TABS_CONTENT_SELECTOR)).toHaveScreenshot('04-exclude.png');
});

test('Option: override before', async ({ page }) => {
    await page.goto(
        getLovelaceUrl('override-before')
    );
    await expect(page.locator(HEADER_SELECTOR)).toBeVisible();
    await expect(page.locator(TABS_CONTENT_SELECTOR)).toHaveScreenshot('05-override-before.png');
});

test('Option: override after', async ({ page }) => {
    await page.goto(
        getLovelaceUrl('override-after')
    );
    await expect(page.locator(HEADER_SELECTOR)).toBeVisible();
    await expect(page.locator(TABS_CONTENT_SELECTOR)).toHaveScreenshot('06-override-after.png');
});

test.describe('Small viewport', () => {

    test.use({ viewport: { width: 400, height: 600 } });

    test('Option: mobile_config', async ({ page }) => {
        await page.goto(
            getLovelaceUrl()
        );
        await expect(page.locator(HEADER_SELECTOR)).toBeVisible();
        await expect(page.locator('.header')).toHaveScreenshot('07-mobile_config.png');
    });

});