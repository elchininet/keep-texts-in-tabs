import { test, expect } from '@playwright/test';

const BASE_PAGE = 'http://host.docker.internal:8123';
const HEADER_SELECTOR = '.header ha-tabs paper-tab:last-of-type';
const TABS_CONTENT_SELECTOR = '#tabsContent';

const getLovelaceUrl = (dashboard?: string): string => {
    if (dashboard) {
        return `${BASE_PAGE}/lovelace-${dashboard}/home`;
    }
    return BASE_PAGE;
};

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

test('Option: override', async ({ page }) => {
    await page.goto(
        getLovelaceUrl('override')
    );
    await expect(page.locator(HEADER_SELECTOR)).toBeVisible();
    await expect(page.locator(TABS_CONTENT_SELECTOR)).toHaveScreenshot('05-override.png');
});

test.describe('Small viewport', () => {

    test.use({ viewport: { width: 400, height: 600 } });

    test('Option: mobile_config', async ({ page }) => {
        await page.goto(
            getLovelaceUrl()
        );
        await expect(page.locator(HEADER_SELECTOR)).toBeVisible();
        await expect(page.locator('.header')).toHaveScreenshot('06-mobile_config.png');
    });

});

