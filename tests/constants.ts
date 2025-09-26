export const BASE_PAGE = 'http://host.docker.internal:8123';
export const HEADER_SELECTOR = '.header ha-tab-group ha-tab-group-tab:last-of-type';
export const TABS_CONTENT_SELECTOR = '.tab-group > .nav-container > .nav';

export enum TABS {
    HOME = 'ha-tab-group-tab[aria-label="Home"]',
    MUZIEK = 'ha-tab-group-tab[aria-label="Muziek"]',
    WINDY = 'ha-tab-group-tab[aria-label="Windy"]',
    ALARMEN = 'ha-tab-group-tab[aria-label="Alarmen"]',
    PLANTEN = 'ha-tab-group-tab[aria-label="Planten"]',
}