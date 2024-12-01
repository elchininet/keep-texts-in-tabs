import { Position } from '@types';

export const NAMESPACE = 'keep-texts-in-tabs';
export const ARIA_LABEL_ATTRIBUTE = 'aria-label';
export const DEFAULT_MOBILE_WIDTH = 640;
export const WINDOW_RESIZE_DELAY = 100;

export enum ELEMENT {
    TOOLBAR = '.toolbar',
    HA_TABS = 'ha-tabs',
    PAPER_TABS = 'paper-tabs',
    PAPER_TAB = 'paper-tab',
    HUI_VIEW = 'hui-view',
    HA_ICON = 'ha-icon',
    SPAN = 'span'
}

const NAMESPACED_SPAN = `${ELEMENT.PAPER_TAB} ${ELEMENT.SPAN}.${NAMESPACE}`;

export const STYLES = {
    [NAMESPACED_SPAN]: {
        display: 'inline-block'
    },
    [`${NAMESPACED_SPAN}-${Position.BEFORE}`]: {
        paddingRight: '5px'
    },
    [`${NAMESPACED_SPAN}-${Position.AFTER}`]: {
        paddingLeft: '5px'
    }
};