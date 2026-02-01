import { Page } from '@playwright/test';
import { BASE_PAGE } from './constants';

export const getLovelaceUrl = (dashboard?: string): string => {
    if (dashboard) {
        return `${BASE_PAGE}/lovelace-${dashboard}/home`;
    }
    return BASE_PAGE;
};

export const waithForError = async (page: Page, errorMessage: string): Promise<void> => {
    return new Promise<void>((resolve) => {
        const listener = (error: Error): void => {
            if (error.message.includes(errorMessage)) {
                page.off('pageerror', listener);
                resolve();
            }
        };
        page.on('pageerror', listener);
    });
};