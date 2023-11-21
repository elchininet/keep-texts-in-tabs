import { Position } from '@types';
import { NAMESPACE } from '@constants';
import { version } from '../../package.json';

export const getSpan = (text: string, position: Position): HTMLSpanElement => {
    const textNode = document.createTextNode(text);
    const span = document.createElement('span');
    span.classList.add(NAMESPACE, `${NAMESPACE}-${position}`);
    span.appendChild(textNode);
    return span;
};

const buildStyles = (): string => {
    return `
        paper-tab span.${NAMESPACE} {
            display: inline-block;
        }
        paper-tab span.${NAMESPACE}-${Position.BEFORE} {
            padding-right: 5px;
        }
        paper-tab span.${NAMESPACE}-${Position.AFTER} {
            padding-left: 5px;
        }
    `;
};

const styleExists = (elem: Element): HTMLStyleElement => {
    return elem.querySelector<HTMLStyleElement>(`#${NAMESPACE}`);
};

export const addStyle = (elem: Element): void => {
    let style = styleExists(elem);
    if (!style) {
        style = document.createElement('style');
        style.setAttribute('id', NAMESPACE);
        elem.appendChild(style);
    }
    style.innerHTML = buildStyles();
};

export const removeStyle = (element: Element): void => {
    if (styleExists(element)) {
        element.querySelector(`#${NAMESPACE}`).remove();
    }
};

export const logVersionToConsole = () => {
    console.info(
        `%c＋ ${NAMESPACE.toUpperCase()}%cv${version}`,
        'font-weight: bold; color: #038fc7; padding: 2px;',
        'font-weight: normal; color: #212121; padding: 2px'
    );
};