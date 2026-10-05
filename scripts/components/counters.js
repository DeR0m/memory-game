import { createElement } from '../dom.js';

export function Counters({ moves, matchedPairs, totalPairs }) {
    return createElement('div', { class: 'counters' },
        createElement('span', { class: 'counters__item' }, `Ходы: ${moves}`),
        createElement('span', { class: 'counters__item' }, `Пары ${matchedPairs} из ${totalPairs}`)
    );
}