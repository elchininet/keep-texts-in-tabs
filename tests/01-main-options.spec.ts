import { test, expect } from 'playwright-test-coverage';
import {
    HEADER_SELECTOR,
    TABS_CONTENT_SELECTOR,
    TABS
} from './constants';
import { getLovelaceUrl } from './utilities';

const tabsEntries = Object.entries(TABS);

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

tabsEntries.forEach((entry: [string, string], tabIndex: number): void => {

    const [tabName, tabLocator] = entry;
    const tabNameLowercase = tabName.toLocaleLowerCase();

    ['always', 'active', 'inactive'].forEach((testCase: string, testCaseIndex: number): void => {

        const testNumber = `${testCaseIndex + 5}`.padStart(2, '0');

        test(`Option: apply_when ${testCase} tab ${tabNameLowercase}`, async ({ page }) => {

            await page.goto(
                getLovelaceUrl(`apply-when-${testCase}`)
            );

            await expect(page.locator(HEADER_SELECTOR)).toBeVisible();

            if (tabIndex > 0) {

                await page.locator(tabLocator).click();

            }

            await expect(page.locator(TABS_CONTENT_SELECTOR)).toHaveScreenshot(`${testNumber}-apply-when-${testCase}-tab-${tabNameLowercase}.png`);

        });

    });

    test(`Option: exclude with apply_when active tab ${tabNameLowercase}`, async ({ page }) => {

        await page.goto(
            getLovelaceUrl('exclude-with-apply-when-active')
        );

        await expect(page.locator(HEADER_SELECTOR)).toBeVisible();

        if (tabIndex > 0) {

            await page.locator(tabLocator).click();

        }

        await expect(page.locator(TABS_CONTENT_SELECTOR)).toHaveScreenshot(`08-exclude-with-apply-when-active-tab-${tabNameLowercase}.png`);

    });

    test(`Option: include with apply_when inactive tab ${tabNameLowercase}`, async ({ page }) => {

        await page.goto(
            getLovelaceUrl('include-with-apply-when-inactive')
        );

        await expect(page.locator(HEADER_SELECTOR)).toBeVisible();

        if (tabIndex > 0) {

            await page.locator(tabLocator).click();

        }

        await expect(page.locator(TABS_CONTENT_SELECTOR)).toHaveScreenshot(`09-include-with-apply-when-inactive-tab-${tabNameLowercase}.png`);

    });

});

test('Option: override before', async ({ page }) => {
    await page.goto(
        getLovelaceUrl('override-before')
    );
    await expect(page.locator(HEADER_SELECTOR)).toBeVisible();
    await expect(page.locator(TABS_CONTENT_SELECTOR)).toHaveScreenshot('10-override-before.png');
});

test('Option: override after', async ({ page }) => {
    await page.goto(
        getLovelaceUrl('override-after')
    );
    await expect(page.locator(HEADER_SELECTOR)).toBeVisible();
    await expect(page.locator(TABS_CONTENT_SELECTOR)).toHaveScreenshot('11-override-after.png');
});

test.describe('Small viewport', () => {

    test.use({ viewport: { width: 400, height: 600 } });

    test('Option: mobile_config', async ({ page }) => {
        await page.goto(
            getLovelaceUrl()
        );
        await expect(page.locator(HEADER_SELECTOR)).toBeVisible();
        await expect(page.locator('.header')).toHaveScreenshot('12-mobile_config.png');
    });

});