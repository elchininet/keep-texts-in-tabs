import { test, expect } from 'playwright-test-coverage';
import {
    HEADER_SELECTOR,
    TABS_CONTENT_SELECTOR,
    BASE_PAGE
} from './constants';

const BUTTON_MENU = '.action-items > ha-button-menu';
const EXIT_EDIT_MODE = 'mwc-button.exit-edit-mode';
const DIALOG_HEADER = 'ha-dialog-header';

test.beforeEach(async ({ page }) => {

    await page.goto(
        `${BASE_PAGE}/storage-view/home`
    );

    await expect(page.locator(HEADER_SELECTOR)).toBeVisible();
    await page.locator(BUTTON_MENU).click();
    await page.getByRole('menuitem', { name: 'Edit dashboard' }).click();
    await expect(page.locator(EXIT_EDIT_MODE)).toBeVisible();

});

test('Edit a storage mode dashboard', async ({ page }) => {

    await expect(page.locator(TABS_CONTENT_SELECTOR)).toHaveScreenshot('01-storage-mode-edit-view.png');
    await page.locator(BUTTON_MENU).click();
    await page.getByRole('menuitem', { name: 'Raw configuration editor' }).click();
    await expect(page.locator('hui-editor')).toBeVisible();
    await page.locator('ha-top-app-bar-fixed > ha-icon-button').click();
    await expect(page.locator(EXIT_EDIT_MODE)).toBeVisible();
    await expect(page.locator(TABS_CONTENT_SELECTOR)).toHaveScreenshot('01-storage-mode-edit-view.png');
    await page.locator(EXIT_EDIT_MODE).click();

});

test('Moving a view', async ({ page }) => {

    await page.locator('ha-icon-button-arrow-next:visible').click();
    await expect(page.locator(TABS_CONTENT_SELECTOR)).toHaveScreenshot('02-storage-mode-moving-view-right.png');
    await page.locator('ha-icon-button-arrow-prev:visible').click();
    await expect(page.locator(TABS_CONTENT_SELECTOR)).toHaveScreenshot('01-storage-mode-edit-view.png');
    await page.locator(EXIT_EDIT_MODE).click();

});

test('Adding a new view', async ({ page }) => {

    await page.locator('#add-view').click();
    await expect(page.locator(DIALOG_HEADER)).toBeVisible();
    await page.locator('input[name="title"]').fill('Account');
    await page.locator('ha-selector-icon').click();
    await expect(page.locator('vaadin-combo-box-overlay')).toBeVisible();
    await page.locator('vaadin-combo-box-item').first().click();
    await page.locator('ha-dialog > mwc-button').last().click();
    await expect(page.locator(DIALOG_HEADER)).not.toBeVisible();
    await expect(page.locator(TABS_CONTENT_SELECTOR)).toHaveScreenshot('03-storage-mode-view-added.png');
    await page.locator(EXIT_EDIT_MODE).click();
    await expect(page.locator(HEADER_SELECTOR)).toBeVisible();
    await expect(page.locator(TABS_CONTENT_SELECTOR)).toHaveScreenshot('04-tabs-content-after-view-added.png');

    await page.locator(BUTTON_MENU).click();
    await page.getByRole('menuitem', { name: 'Edit dashboard' }).click();
    await expect(page.locator(EXIT_EDIT_MODE)).toBeVisible();
    await page.locator('ha-svg-icon.edit-icon.view:visible').click();
    await expect(page.locator(DIALOG_HEADER)).toBeVisible();
    await page.locator('vaadin-combo-box-light > ha-svg-icon.clear-button').click();
    await page.locator('ha-dialog > mwc-button').last().click();
    await expect(page.locator(DIALOG_HEADER)).not.toBeVisible();
    await expect(page.locator(TABS_CONTENT_SELECTOR)).toHaveScreenshot('05-tabs-content-after-icon-removed.png');

    await page.locator('ha-svg-icon.edit-icon.view:visible').click();
    await expect(page.locator(DIALOG_HEADER)).toBeVisible();
    await page.locator('ha-selector-icon').click();
    await expect(page.locator('vaadin-combo-box-overlay')).toBeVisible();
    await page.locator('vaadin-combo-box-item').first().click();
    await page.locator('ha-dialog > mwc-button').last().click();
    await expect(page.locator(DIALOG_HEADER)).not.toBeVisible();
    await expect(page.locator(TABS_CONTENT_SELECTOR)).toHaveScreenshot('03-storage-mode-view-added.png');
    await page.locator(EXIT_EDIT_MODE).click();
    await expect(page.locator(HEADER_SELECTOR)).toBeVisible();
    await expect(page.locator(TABS_CONTENT_SELECTOR)).toHaveScreenshot('04-tabs-content-after-view-added.png');

});