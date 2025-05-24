export const BASE_PAGE = 'http://host.docker.internal:8123';
export const HEADER_SELECTOR = '.header sl-tab-group sl-tab:last-of-type';
export const TABS_CONTENT_SELECTOR = '.tab-group__tabs';

export enum TABS {
    HOME = 'sl-tab[aria-label="Home"]',
    MUZIEK = 'sl-tab[aria-label="Muziek"]',
    WINDY = 'sl-tab[aria-label="Windy"]',
    ALARMEN = 'sl-tab[aria-label="Alarmen"]',
    PLANTEN = 'sl-tab[aria-label="Planten"]',
}