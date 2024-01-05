import { HAQuerySelector, HAQuerySelectorEvent } from 'home-assistant-query-selector';
import {
    Lovelace,
    KeepTextsInTabsConfig,
    TabContainer,
    Tab,
    Position
} from '@types';
import {
    NAMESPACE,
    ELEMENT,
    ARIA_LABEL_ATTRIBUTE,
    DEFAULT_MOBILE_WIDTH,
    WINDOW_RESIZE_DELAY
} from '@constants';
import {
    getSpan,
    addStyle,
    logVersionToConsole
} from '@utilities';

class KeepTextsInTabs {

    constructor() {
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

    private lovelace: Lovelace;
    private huiRoot: ShadowRoot;
    private appToolbar: Element;

    private toolBarObserver: MutationObserver;
    private paperTabsEditionResolver: MutationObserver;

    private resizeDelay: number;
    private resizeWindowBinded: () => void;

    protected async run() {
        this.toolBarObserver?.disconnect();

        addStyle(this.appToolbar);

        // Get the configuration and process it
        const config = this.lovelace.lovelace.config;        

        this.toolBarObserver = new MutationObserver(this.process.bind(this, config.keep_texts_in_tabs));
        this.toolBarObserver.observe(this.appToolbar, {
            childList: true,
        });

        this.process(config.keep_texts_in_tabs);

    }

    protected process(config: KeepTextsInTabsConfig | undefined) {

        this.paperTabsEditionResolver?.disconnect();

        if (!config) return;

        let conf: KeepTextsInTabsConfig;

        if (
            config.mobile_config &&
            window.innerWidth <= (config.mobile_config.mobile_screen_width || DEFAULT_MOBILE_WIDTH)
        ) {
            conf = config.mobile_config
        } else {
            conf = config;
        }

        const {
            enabled = false,
            include,
            exclude,
            position = Position.AFTER,
            override = []
        } = conf;

        if (include && exclude) {
            throw Error(`${NAMESPACE}: Configuration cannot have "include" and "exclude" properties at the same time`);
        }

        const editMode = !!this.huiRoot.querySelector(`:host > div.edit-mode`);
        const paperTabsContainer = editMode
            ? this.huiRoot.querySelector<TabContainer>(ELEMENT.PAPER_TABS)
            : this.appToolbar.querySelector<TabContainer>(ELEMENT.HA_TABS);
        const paperTabs: HTMLElement[] = paperTabsContainer
            ? Array.from(
                paperTabsContainer.querySelectorAll<HTMLElement>(ELEMENT.PAPER_TAB)
            )
            : [];

        if (!paperTabs.length) return;

        const overrideCapital = override.map((label: string): string => label.toUpperCase());
        
        const paperTabsArray = paperTabs
            .map((paperTab: HTMLElement): Tab => {
                const label = paperTab.getAttribute(ARIA_LABEL_ATTRIBUTE) || '';
                const span = paperTab.querySelector(`span.${NAMESPACE}`);
                if (span) {
                    span.remove();
                }
                return {
                    element: paperTab,
                    label,
                    icon: paperTab.querySelector(ELEMENT.HA_ICON),
                    position: overrideCapital.includes(label.toUpperCase())
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
                    return include.includes(tab.label)
                }
                if (exclude) {
                    return !exclude.includes(tab.label)
                }
                return true;
            });

        paperTabsArray.forEach((tab: Tab): void => {
            const span = getSpan(tab.label, tab.position);
            if (tab.position === Position.AFTER) {
                tab.element.insertBefore(span, tab.icon.nextSibling);
            } else {
                tab.element.insertBefore(span, tab.icon);
            }
        });

        if (enabled && editMode) {
            this.paperTabsEditionResolver = new MutationObserver((mutations: MutationRecord[]) => {
                mutations.forEach(({ addedNodes }): void => {
                    addedNodes.forEach((node: Element): void => {
                        if (
                            node.nodeType === Node.ELEMENT_NODE &&
                            node.nodeName === ELEMENT.PAPER_TAB.toUpperCase()
                        ) {
                            this.process(config);             
                        }
                    });
                });
            });
            this.paperTabsEditionResolver.observe(this.huiRoot.querySelector<HTMLElement>(ELEMENT.PAPER_TABS), {
                childList: true,
                subtree: true,
            });

        }
        if (typeof paperTabsContainer._boundNotifyResize === 'function') {
            paperTabsContainer._boundNotifyResize();
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