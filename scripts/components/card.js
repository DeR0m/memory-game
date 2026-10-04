import { createElement } from '../dom.js';
import { CARD_IMAGES } from '../data.js';

export function Card({ card, onCardClick }) {
  const isOpen = card.isFlipped || card.isMatched;

  const classes = ['card'];
  if (isOpen) classes.push('card--flipped');
  if (card.isMatched) classes.push('card--matched');

  const content = isOpen
    ? createElement('span', { class: 'card__front' }, CARD_IMAGES[card.imageId])
    : createElement('span', { class: 'card__back' }, '?');

  return createElement('button', {
    class: classes.join(' '),
    dataset: { id: card.id },
    onClick: () => onCardClick(card.id),
    'aria-label': isOpen ? 'Открытая карточка' : 'Закрытая карточка',
  }, content
  );
}