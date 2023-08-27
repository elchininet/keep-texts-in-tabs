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
    SHADOW_ROOT_SUFFIX,
    ARIA_LABEL_ATTRIBUTE,
    DEFAULT_MOBILE_WIDTH,
    NODE_TYPE,
    WINDOW_RESIZE_DELAY
} from '@constants';
import {
    getPromisableElement,
    getSpan,
    addStyle,
    logVersionToConsole
} from '@utilities';

class KeepTextsInTabs {

    constructor() {
        this.resizeWindowBinded = this.resizeWindow.bind(this);  
        this.start();
    }

    private ha: HTMLElement;
    private main: ShadowRoot;
    private partialPanelResolver: HTMLElement;
    private lovelace: Lovelace;
    private huiRoot: ShadowRoot;
    private appToolbar: HTMLElement;

    private panelResolverObserver: MutationObserver;
    private lovelaceResolver: MutationObserver;
    private toolBarObserver: MutationObserver;
    private paperTabsEditionResolver: MutationObserver;

    private resizeDelay: number;
    private resizeWindowBinded: () => void;

    protected async start() {

        this.ha = await getPromisableElement(
            (): HTMLElement => document.querySelector<HTMLElement>(ELEMENT.HOME_ASSISTANT),
            (ha: HTMLElement) => !!(ha && ha.shadowRoot),
            ELEMENT.HOME_ASSISTANT
        );

        this.main = await getPromisableElement(
            (): ShadowRoot => this.ha.shadowRoot.querySelector(ELEMENT.HOME_ASSISTANT_MAIN)?.shadowRoot,
            (main: ShadowRoot) => !!main,
            `${ELEMENT.HOME_ASSISTANT_MAIN}${SHADOW_ROOT_SUFFIX}`
        );

        this.partialPanelResolver = await getPromisableElement(
            (): HTMLElement => this.main.querySelector<HTMLElement>(ELEMENT.PARTIAL_PANEL_RESOLVER),
            (partialPanelResolver: HTMLElement) => !!partialPanelResolver,
            `${ELEMENT.HOME_ASSISTANT_MAIN} > ${ELEMENT.PARTIAL_PANEL_RESOLVER}`
        );

        this.lovelace = await getPromisableElement(
            (): Lovelace => this.main.querySelector<Lovelace>(ELEMENT.HA_PANEL_LOVELACE),
            (lovelace: Lovelace) => !!lovelace,
            `${ELEMENT.HOME_ASSISTANT_MAIN} > ${ELEMENT.HA_PANEL_LOVELACE}`
        );

        if (this.panelResolverObserver) {
            this.panelResolverObserver.disconnect();
        }

        this.panelResolverObserver = new MutationObserver(this.dashboardChanged.bind(this));

        this.panelResolverObserver.observe(this.partialPanelResolver, {
            childList: true,
        });
 
        window.removeEventListener('resize', this.resizeWindowBinded);
        window.addEventListener('resize', this.resizeWindowBinded);

        this.run();

    }

    protected async run() {

        if (this.lovelaceResolver) {
            this.lovelaceResolver.disconnect();
        }

        if (this.toolBarObserver) {
            this.toolBarObserver.disconnect();
        }

        this.huiRoot = await getPromisableElement(
            (): ShadowRoot => this.lovelace?.shadowRoot?.querySelector(ELEMENT.HUI_ROOT)?.shadowRoot,
            (huiRoot: ShadowRoot) => !!huiRoot,
            `${ELEMENT.HOME_ASSISTANT_MAIN} > ${ELEMENT.HA_PANEL_LOVELACE} > ${ELEMENT.HUI_ROOT}${SHADOW_ROOT_SUFFIX}`
        );

        this.appToolbar = await getPromisableElement(
            (): HTMLElement => this.huiRoot.querySelector<HTMLElement>(ELEMENT.TOOLBAR),
            (appToolbar: HTMLElement) => !!appToolbar,
            `${ELEMENT.HOME_ASSISTANT_MAIN} > ${ELEMENT.HA_PANEL_LOVELACE} > ${ELEMENT.HUI_ROOT}${SHADOW_ROOT_SUFFIX} > ${ELEMENT.TOOLBAR}`
        );

        // Get the configuration and process it
        const config = await getPromisableElement(
            () => this.lovelace?.lovelace?.config,
            (config: Lovelace['lovelace']['config']) => !!config,
            'Lovelace config'
        );

        addStyle(this.appToolbar);

        this.lovelaceResolver = new MutationObserver(this.lovelaceChanged.bind(this));
        this.lovelaceResolver.observe(this.lovelace.shadowRoot, {
            childList: true,
        });

        this.toolBarObserver = new MutationObserver(this.process.bind(this, config.keep_texts_in_tabs));
        this.toolBarObserver.observe(this.appToolbar, {
            childList: true,
        });

        this.process(config.keep_texts_in_tabs);

    }

    protected process(config: KeepTextsInTabsConfig | undefined) {

        if (this.paperTabsEditionResolver) {
            this.paperTabsEditionResolver.disconnect();
        }

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
                const label = paperTab.getAttribute(ARIA_LABEL_ATTRIBUTE);
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
                mutations.forEach(({ removedNodes, target }): void => {
                    removedNodes.forEach((node: Element): void => {
                        if (
                            node.nodeType === NODE_TYPE.TEXT &&
                            target.nodeName === ELEMENT.PAPER_TAB.toUpperCase()
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

    protected dashboardChanged(mutations: MutationRecord[]) {
        mutations.forEach(({ addedNodes }): void => {
            addedNodes.forEach((node: Element): void => {
                if (node.localName === ELEMENT.HA_PANEL_LOVELACE) {
                    this.lovelace = node as Lovelace;
                    this.run();
                }
            });
        });
    }

    protected lovelaceChanged(mutations: MutationRecord[]) {
        mutations.forEach(({ addedNodes }): void => {
            addedNodes.forEach((node: Element): void => {
                if (node.localName === ELEMENT.HUI_ROOT) {
                    this.run();
                }
            });
        });
    }

    protected resizeWindow() {
        window.clearTimeout(this.resizeDelay);
        this.resizeDelay = window.setTimeout(() => {
          this.start();
        }, WINDOW_RESIZE_DELAY);
      }

}

logVersionToConsole();

Promise.resolve(customElements.whenDefined(ELEMENT.HUI_VIEW))
    .then(() => {
        new KeepTextsInTabs();
    });