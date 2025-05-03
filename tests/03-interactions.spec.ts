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

    const addView = page.locator('#add-view');
    const dialogHeader = page.locator(DIALOG_HEADER);
    const nameInput = page.locator('input[name="title"]');
    const iconSelector = page.locator('ha-selector-icon');
    const comboBoxOverlay = page.locator('vaadin-combo-box-overlay');
    const comboBoxItem = page.locator('vaadin-combo-box-item');
    const saveButton = page.locator('ha-dialog > ha-button');
    const tabsContainer = page.locator(TABS_CONTENT_SELECTOR);
    const exitEditMode = page.locator(EXIT_EDIT_MODE);
    const headerTabs = page.locator(HEADER_SELECTOR);

    const buttonMenu = page.locator(BUTTON_MENU);
    const editDashboard = page.getByRole('menuitem', { name: 'Edit dashboard' });
    const editButton = page.locator('ha-icon-button.edit-icon.view:visible');
    const clearIconButton = page.locator('vaadin-combo-box-light > ha-svg-icon.clear-button');

    await addView.click();
    await expect(dialogHeader).toBeVisible();
    await nameInput.fill('Account');
    await iconSelector.click();
    await expect(comboBoxOverlay).toBeVisible();
    await comboBoxItem.first().click();
    await saveButton.click();
    await expect(dialogHeader).not.toBeVisible();
    await expect(tabsContainer).toHaveScreenshot('03-storage-mode-view-added.png');
    await exitEditMode.click();
    await expect(headerTabs).toBeVisible();
    await expect(tabsContainer).toHaveScreenshot('04-tabs-content-after-view-added.png');

    await buttonMenu.click();
    await editDashboard.click();
    await expect(exitEditMode).toBeVisible();
    await editButton.click();
    await expect(dialogHeader).toBeVisible();
    await clearIconButton.click();
    await saveButton.last().click();
    await expect(dialogHeader).not.toBeVisible();
    await expect(tabsContainer).toHaveScreenshot('05-tabs-content-after-icon-removed.png');

    await editButton.click();
    await expect(dialogHeader).toBeVisible();
    await iconSelector.click();
    await expect(comboBoxOverlay).toBeVisible();
    await comboBoxItem.first().click();
    await saveButton.last().click();
    await expect(dialogHeader).not.toBeVisible();
    await expect(tabsContainer).toHaveScreenshot('03-storage-mode-view-added.png');
    await exitEditMode.click();
    await expect(headerTabs).toBeVisible();
    await expect(tabsContainer).toHaveScreenshot('04-tabs-content-after-view-added.png');

});