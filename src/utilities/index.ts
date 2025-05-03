import { Position, TextTransform } from '@types';
import { NAMESPACE } from '@constants';
import { version } from '../../package.json';

export const getSpan = (
    text: string,
    position: Position,
    textTransform: `${TextTransform}` = TextTransform.CAPITALIZE
): HTMLSpanElement => {
    const textNode = document.createTextNode(text);
    const span = document.createElement('span');
    span.classList.add(
        NAMESPACE,
        `${NAMESPACE}-${position}`,
        `${NAMESPACE}-${textTransform}`
    );
    span.appendChild(textNode);
    return span;
};

export const logVersionToConsole = () => {
    console.info(
        `%c＋ ${NAMESPACE.toUpperCase()}%cv${version}`,
        'font-weight: bold; color: #038fc7; padding: 2px;',
        'font-weight: normal; color: #212121; padding: 2px'
    );
};