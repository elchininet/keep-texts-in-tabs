export enum Position {
    AFTER = 'after',
    BEFORE = 'before'
}

export enum TextTransform {
    CAPITALIZE = 'capitalize',
    UPPERCASE = 'uppercase',
    LOWERCASE = 'lowercase'
}

export interface Config {
    enabled: boolean;
    position?: Position;
    text_transform?: `${TextTransform}`;
    include?: string[];
    exclude?: string[];
    override?: string[];
}

export interface KeepTextsInTabsConfig extends Config {
    mobile_config?: Config & {
        mobile_screen_width?: number;
    };
}

export interface Lovelace extends HTMLElement {
    lovelace: {
        config: {
            keep_texts_in_tabs: KeepTextsInTabsConfig;
        };
    }
}

export interface Tab {
    element: HTMLElement;
    label: string;
    icon: HTMLElement | null;
    position: Position;
}