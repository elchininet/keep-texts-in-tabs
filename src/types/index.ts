export enum Position {
    AFTER = 'after',
    BEFORE = 'before'
}

export enum TextTransform {
    CAPITALIZE = 'capitalize',
    UPPERCASE = 'uppercase',
    LOWERCASE = 'lowercase'
}

export enum ApplyWhen {
    IS_ACTIVE = 'active',
    IS_INACTIVE = 'inactive',
    ALWAYS = 'always'
}

export interface Config {
    enabled: boolean;
    position?: Position;
    text_transform?: `${TextTransform}`;
    include?: string[];
    exclude?: string[];
    override?: string[];
    apply_when?: ApplyWhen;
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