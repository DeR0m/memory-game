import { createElement } from '../dom.js';
import { Card } from './card.js';

export function Board({ cards, onCardClick }) {
    const cardElements = cards.map((card) => Card({ card, onCardClick }));

    return createElement('div', { class: 'board' }, cardElements);
}