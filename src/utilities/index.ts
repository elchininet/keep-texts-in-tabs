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

export const buildStyles = (): string => {
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

export const logVersionToConsole = () => {
    console.info(
        `%c＋ ${NAMESPACE.toUpperCase()}%cv${version}`,
        'font-weight: bold; color: #038fc7; padding: 2px;',
        'font-weight: normal; color: #212121; padding: 2px'
    );
};