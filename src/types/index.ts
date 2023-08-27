export enum Position {
    AFTER = 'after',
    BEFORE = 'before'
}

export interface TabOverride {
    tab: string;
    position: Position;
}

export interface Config {
    enabled: boolean;
    position?: Position;
    include?: string[];
    exclude?: string[];
    override?: TabOverride[];
}

export interface KeepTabsTextsConfig extends Config {
    mobile_config?: Config & {
        mobile_screen_width?: number;
    };  
}

export interface Lovelace extends HTMLElement {
    lovelace: {
        config: {
            keep_tab_texts: KeepTabsTextsConfig;
        };
    }
}

export interface Tab {
    element: HTMLElement;
    label: string;
    icon: HTMLElement | null;
    position: Position;
}

export interface TabContainer extends HTMLElement {
    _boundNotifyResize: () => void;
}