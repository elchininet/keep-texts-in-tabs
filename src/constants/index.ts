export const NAMESPACE = 'keep-texts-in-tabs';
export const MAX_ATTEMPTS = 500;
export const RETRY_DELAY = 50;
export const SHADOW_ROOT_SUFFIX = ':shadowRoot';
export const ARIA_LABEL_ATTRIBUTE = 'aria-label';
export const DEFAULT_MOBILE_WIDTH = 640;
export const WINDOW_RESIZE_DELAY = 100;

export enum ELEMENT {
    HOME_ASSISTANT = 'home-assistant',
    HOME_ASSISTANT_MAIN = 'home-assistant-main',
    PARTIAL_PANEL_RESOLVER = 'partial-panel-resolver',
    HA_PANEL_LOVELACE = 'ha-panel-lovelace',
    HUI_ROOT = 'hui-root',
    TOOLBAR = '.toolbar',
    HA_TABS = 'ha-tabs',
    PAPER_TABS = 'paper-tabs',
    PAPER_TAB = 'paper-tab',
    HUI_VIEW = 'hui-view',
    HA_ICON = 'ha-icon'
    /*
    MENU_ITEM = 'ha-icon-button',
    MENU_ITEM_ICON = 'mwc-icon-button',
    BUTTON_MENU = 'ha-button-menu',
    OVERLAY_MENU_ITEM = 'mwc-list-item',
    HA_SIDEBAR = 'ha-sidebar',
    HA_DRAWER = 'ha-drawer',
    
    ACTION_ITEMS = '.action-items',
    HA_MORE_INFO_DIALOG = 'ha-more-info-dialog',
    HA_DIALOG = 'ha-dialog',
    HA_DIALOG_HEADER = 'ha-dialog-header',
    HA_DIALOG_CONTENT = '.content',
    HA_DIALOG_MORE_INFO = 'ha-more-info-info',
    HA_DIALOG_HISTORY = 'ha-more-info-history',
    HA_DIALOG_LOGBOOK = 'ha-more-info-logbook',
    HA_DIALOG_MORE_INFO_CONTENT = 'more-info-content',
    HA_DIALOG_MORE_INFO_HISTORY_AND_LOGBOOK = 'ha-more-info-history-and-logbook',
    HA_DIALOG_DEFAULT = 'more-info-default',
    HA_DIALOG_TIMER = 'more-info-timer',
    HA_DIALOG_VACUUM = 'more-info-vacuum',
    HA_DIALOG_MEDIA_PLAYER = 'more-info-media_player',
    HA_DIALOG_UPDATE = 'more-info-update',
    HA_DIALOG_CLIMATE = 'more-info-climate',
    HA_DIALOG_ATTRIBUTES = 'ha-attributes'*/
}

export enum NODE_TYPE {
    TEXT = 3
}