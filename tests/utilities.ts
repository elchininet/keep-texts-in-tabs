import { BASE_PAGE } from './constants';

export const getLovelaceUrl = (dashboard?: string): string => {
    if (dashboard) {
        return `${BASE_PAGE}/lovelace-${dashboard}/home`;
    }
    return BASE_PAGE;
};