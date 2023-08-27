import { Position } from '@types';
import {
    NAMESPACE,
    MAX_ATTEMPTS,
    RETRY_DELAY
} from '@constants';

export const getPromisableElement = <T>(
    getElement: () => T,
    check: (element: T) => boolean,
    elementName: string
): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
        let attempts = 0;
        const select = () => {
            const element: T = getElement();
            if (element && check(element)) {
                resolve(element);
            } else {
                attempts++;
                if (attempts < MAX_ATTEMPTS) {
                    setTimeout(select, RETRY_DELAY);
                } else {
                    reject(new Error(`${NAMESPACE}: Cannot select ${elementName} after ${MAX_ATTEMPTS} attempts. Giving up!`));
                }
            }
        };
        select();
    });
};

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

const styleExists = (elem: HTMLElement): HTMLStyleElement => {
    return elem.querySelector<HTMLStyleElement>(`#${NAMESPACE}`);
};

export const addStyle = (elem: HTMLElement): void => {
    let style = styleExists(elem);
    if (!style) {
        style = document.createElement('style');
        style.setAttribute('id', NAMESPACE);
        elem.appendChild(style);
    }
    style.innerHTML = buildStyles();
};

export const removeStyle = (element: HTMLElement): void => {
    if (styleExists(element)) {
        element.querySelector(`#${NAMESPACE}`).remove();
    }
};