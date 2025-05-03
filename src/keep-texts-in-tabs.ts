import { HAQuerySelector, HAQuerySelectorEvent } from 'home-assistant-query-selector';
import { HomeAssistantStylesManager } from 'home-assistant-styles-manager';
import {
    Lovelace,
    KeepTextsInTabsConfig,
    Tab,
    Position
} from '@types';
import {
    NAMESPACE,
    ELEMENT,
    ARIA_LABEL_ATTRIBUTE,
    DEFAULT_MOBILE_WIDTH,
    WINDOW_RESIZE_DELAY,
    STYLES
} from '@constants';
import { getSpan, logVersionToConsole } from '@utilities';

class KeepTextsInTabs {

    constructor() {
        this.styleManager = new HomeAssistantStylesManager({
            prefix: NAMESPACE,
            throwWarnings: false
        });
        const selector = new HAQuerySelector();
        selector.addEventListener(HAQuerySelectorEvent.ON_LOVELACE_PANEL_LOAD, async (event) => {
            const {
                HA_PANEL_LOVELACE,
                HUI_ROOT,
                HEADER
            } = event.detail;

            this.lovelace = await HA_PANEL_LOVELACE.element as Lovelace;
            this.huiRoot = await HUI_ROOT.selector.$.element;
            this.appToolbar = await HEADER.selector.query(ELEMENT.TOOLBAR).element;
            this.run();
        });
        selector.listen();
        this.resizeWindowBinded = this.resizeWindow.bind(this);
        window.addEventListener('resize', this.resizeWindowBinded);
    }

    private styleManager: HomeAssistantStylesManager;
    private lovelace: Lovelace;
    private huiRoot: ShadowRoot;
    private appToolbar: Element;

    private toolBarObserver: MutationObserver;
    private tabsEditionResolver: MutationObserver;

    private resizeDelay: number;
    private resizeWindowBinded: () => void;

    protected async run() {
        this.toolBarObserver?.disconnect();

        this.styleManager.addStyle(
            STYLES,
            this.appToolbar
        );

        // Get the configuration and process it
        const config = this.lovelace.lovelace.config;

        this.toolBarObserver = new MutationObserver(this.process.bind(this, config.keep_texts_in_tabs));
        this.toolBarObserver.observe(this.appToolbar, {
            childList: true
        });

        this.process(config.keep_texts_in_tabs);

    }

    protected process(config: KeepTextsInTabsConfig | undefined) {

        this.tabsEditionResolver?.disconnect();

        if (!config) return;

        let conf: KeepTextsInTabsConfig;

        if (
            config.mobile_config &&
            window.innerWidth <= (config.mobile_config.mobile_screen_width || DEFAULT_MOBILE_WIDTH)
        ) {
            conf = config.mobile_config;
        } else {
            conf = config;
        }

        const {
            enabled = false,
            include,
            exclude,
            position = Position.AFTER,
            override = [],
            text_transform
        } = conf;

        if (include && exclude) {
            throw Error(`${NAMESPACE}: Configuration cannot have "include" and "exclude" properties at the same time`);
        }

        const editMode = !!this.huiRoot.querySelector(`:host > div.edit-mode`);
        const tabsContainer = editMode
            ? this.huiRoot.querySelector(ELEMENT.SL_TAB_GROUP)
            : this.appToolbar.querySelector(ELEMENT.SL_TAB_GROUP);
        const tabs: HTMLElement[] = tabsContainer
            ? Array.from(
                tabsContainer.querySelectorAll<HTMLElement>(ELEMENT.SL_TAB)
            )
            : [];

        if (!tabs.length) return;

        const overrideLowercase = override.map((label: string): string => label.toLowerCase());

        const tabsArray = tabs
            .map((tab: HTMLElement): Tab => {
                const label = tab.getAttribute(ARIA_LABEL_ATTRIBUTE) || '';
                const span = tab.querySelector(`span.${NAMESPACE}`);
                if (span) {
                    span.remove();
                }
                return {
                    element: tab,
                    label,
                    icon: tab.querySelector(ELEMENT.HA_ICON),
                    position: overrideLowercase.includes(label.toLowerCase())
                        ? (
                            position === Position.AFTER
                                ? Position.BEFORE
                                : Position.AFTER
                        )
                        : position
                };
            })
            .filter((tab: Tab) => {
                if (
                    !enabled ||
                    !tab.icon
                ) return false;
                if (include) {
                    return include.includes(tab.label);
                }
                if (exclude) {
                    return !exclude.includes(tab.label);
                }
                return true;
            });

        tabsArray.forEach((tab: Tab): void => {
            const span = getSpan(
                tab.label,
                tab.position,
                text_transform
            );
            if (tab.position === Position.AFTER) {
                tab.element.insertBefore(span, tab.icon.nextSibling);
            } else {
                tab.element.insertBefore(span, tab.icon);
            }
        });

        if (enabled && editMode) {
            this.tabsEditionResolver = new MutationObserver((mutations: MutationRecord[]) => {
                for (const mutationRecord of mutations) {
                    const { addedNodes, attributeName } = mutationRecord;
                    if (attributeName === ARIA_LABEL_ATTRIBUTE) {
                        this.process(config);
                        break;
                    }
                    for (const node of addedNodes) {
                        if (
                            node.nodeType === Node.ELEMENT_NODE &&
                            (
                                node.nodeName === ELEMENT.SL_TAB.toUpperCase() ||
                                node.nodeName === ELEMENT.HA_ICON.toUpperCase()
                            )
                        ) {
                            this.process(config);
                            break;
                        }
                    }
                }
            });
            this.tabsEditionResolver.observe(this.huiRoot.querySelector<HTMLElement>(ELEMENT.SL_TAB_GROUP), {
                attributeFilter: [ARIA_LABEL_ATTRIBUTE],
                childList: true,
                subtree: true
            });

        }
    }

    protected resizeWindow() {
        window.clearTimeout(this.resizeDelay);
        this.resizeDelay = window.setTimeout(() => {
            this.run();
        }, WINDOW_RESIZE_DELAY);
    }

}

logVersionToConsole();

Promise.resolve(customElements.whenDefined(ELEMENT.HUI_VIEW))
    .then(() => {
        new KeepTextsInTabs();
    });