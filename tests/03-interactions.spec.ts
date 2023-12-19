import { test, expect } from 'playwright-test-coverage';
import {
    HEADER_SELECTOR,
    TABS_CONTENT_SELECTOR,
    BASE_PAGE
} from './constants';

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
    await expect(page.locator(TABS_CONTENT_SELECTOR)).toHaveScreenshot('01-storage-mode-edit-view.png');
    await page.locator(BUTTON_MENU).click();
    await page.getByRole('menuitem', { name: 'Raw configuration editor' }).click();
    await expect(page.locator('hui-editor')).toBeVisible();
    await page.locator('ha-top-app-bar-fixed > ha-icon-button').click();
    await expect(page.locator(EXIT_EDIT_MODE)).toBeVisible();
    await expect(page.locator(TABS_CONTENT_SELECTOR)).toHaveScreenshot('01-storage-mode-edit-view.png');
    await page.locator('#add-view').click();
    await expect(page.locator(DIALOG_HEADER)).toBeVisible();
    await page.locator('input[name="title"]').fill('Account');
    await page.locator('ha-selector-icon').click();
    await expect(page.locator('vaadin-combo-box-overlay')).toBeVisible();
    await page.locator('vaadin-combo-box-item').first().click();
    await page.locator('ha-dialog > mwc-button').last().click();
    await expect(page.locator(DIALOG_HEADER)).not.toBeVisible();
    await expect(page.locator(TABS_CONTENT_SELECTOR)).toHaveScreenshot('02-storage-mode-view-added.png');
    await page.locator(EXIT_EDIT_MODE).click();
    await expect(page.locator(HEADER_SELECTOR)).toBeVisible();
    await expect(page.locator(TABS_CONTENT_SELECTOR)).toHaveScreenshot('03-tabs-content-after-view-added.png');
});