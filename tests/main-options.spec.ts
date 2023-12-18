import { test, expect } from './baseFixtures';

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

test('No config', async ({ page }) => {
    await page.goto(
        getLovelaceUrl('no-config')
    );
    await expect(page.locator(HEADER_SELECTOR)).toBeVisible();
    await expect(page.locator(TABS_CONTENT_SELECTOR)).toHaveScreenshot('07-no-config.png');
});

test('Should be the same after a window resize', async ({ page }) => {
    await page.goto(
        getLovelaceUrl()
    );
    await expect(page.locator(HEADER_SELECTOR)).toBeVisible();
    await page.evaluate(() => window.dispatchEvent(new Event('resize')));
    await page.waitForTimeout(200);
    await expect(page.locator(TABS_CONTENT_SELECTOR)).toHaveScreenshot('01-enabled.png');
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

test.describe('Small viewport', () => {

    test.use({ viewport: { width: 400, height: 600 } });

    test('Option: mobile_config', async ({ page }) => {
        await page.goto(
            getLovelaceUrl()
        );
        await expect(page.locator(HEADER_SELECTOR)).toBeVisible();
        await expect(page.locator('.header')).toHaveScreenshot('08-mobile_config.png');
    });

});

test('Edit a storage mode dashboard', async ({ page }) => {
    await page.goto(
        `${BASE_PAGE}/storage-view/home`
    );
    const BUTTON_MENU = '.action-items > ha-button-menu';
    const EXIT_EDIT_MODE = 'mwc-button.exit-edit-mode';
    const DIALOG_HEADER = 'ha-dialog-header';
    await expect(page.locator(HEADER_SELECTOR)).toBeVisible();
    await page.locator(BUTTON_MENU).click();
    await page.getByRole('menuitem', { name: 'Edit dashboard' }).click();
    await expect(page.locator(EXIT_EDIT_MODE)).toBeVisible();
    await expect(page.locator(TABS_CONTENT_SELECTOR)).toHaveScreenshot('09-storage-mode-edit-view.png');
    await page.locator(BUTTON_MENU).click();
    await page.getByRole('menuitem', { name: 'Raw configuration editor' }).click();
    await expect(page.locator('hui-editor')).toBeVisible();
    await page.locator('ha-top-app-bar-fixed > ha-icon-button').click();
    await expect(page.locator(EXIT_EDIT_MODE)).toBeVisible();
    await expect(page.locator(TABS_CONTENT_SELECTOR)).toHaveScreenshot('09-storage-mode-edit-view.png');
    await page.locator('#add-view').click();
    await expect(page.locator(DIALOG_HEADER)).toBeVisible();
    await page.locator('input[name="title"]').fill('Account');
    await page.locator('ha-selector-icon').click();
    await expect(page.locator('vaadin-combo-box-overlay')).toBeVisible();
    await page.locator('vaadin-combo-box-item').first().click();
    await page.locator('ha-dialog > mwc-button').last().click();
    await expect(page.locator(DIALOG_HEADER)).not.toBeVisible();
    await expect(page.locator(TABS_CONTENT_SELECTOR)).toHaveScreenshot('10-storage-mode-view-added.png');
    await page.locator(EXIT_EDIT_MODE).click();
    await expect(page.locator(HEADER_SELECTOR)).toBeVisible();
    await expect(page.locator(TABS_CONTENT_SELECTOR)).toHaveScreenshot('11-tabs-content-after-view-added.png');
});