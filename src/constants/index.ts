import {
    ApplyWhen,
    Position,
    TextTransform
} from '@types';

export const NAMESPACE = 'keep-texts-in-tabs';
export const ARIA_LABEL_ATTRIBUTE = 'aria-label';
export const DEFAULT_MOBILE_WIDTH = 640;
export const WINDOW_RESIZE_DELAY = 100;

export enum ELEMENT {
    TOOLBAR = '.toolbar',
    SL_TAB_GROUP = 'sl-tab-group',
    SL_TAB = 'sl-tab',
    HUI_VIEW = 'hui-view',
    HA_ICON = 'ha-icon',
    SPAN = 'span'
}

const NAMESPACED_SPAN = `${ELEMENT.SL_TAB} ${ELEMENT.SPAN}.${NAMESPACE}`;
const TAB_SELECTED = '[aria-selected="true"]';

export const STYLES = {
    [NAMESPACED_SPAN]: {
        display: 'none'
    },
    [`${NAMESPACED_SPAN}-${Position.BEFORE}`]: {
        paddingRight: '5px'
    },
    [`${NAMESPACED_SPAN}-${Position.AFTER}`]: {
        paddingLeft: '5px'
    },
    [`${NAMESPACED_SPAN}-${TextTransform.CAPITALIZE}`]: {
        textTransform: TextTransform.CAPITALIZE
    },
    [`${NAMESPACED_SPAN}-${TextTransform.UPPERCASE}`]: {
        textTransform: TextTransform.UPPERCASE
    },
    [`${NAMESPACED_SPAN}-${TextTransform.LOWERCASE}`]: {
        textTransform: TextTransform.LOWERCASE
    },
    [`${NAMESPACED_SPAN}-${ApplyWhen.ALWAYS}`]: {
        display: 'inline-block'
    },
    [`${ELEMENT.SL_TAB}${TAB_SELECTED} ${ELEMENT.SPAN}.${NAMESPACE}-${ApplyWhen.IS_ACTIVE}`]: {
        display: 'inline-block'
    },
    [`${ELEMENT.SL_TAB}:not(${TAB_SELECTED}) ${ELEMENT.SPAN}.${NAMESPACE}-${ApplyWhen.IS_INACTIVE}`]: {
        display: 'inline-block'
    }
};