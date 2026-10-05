import { createElement } from '../dom.js';

export function Header({ onNewGame, onLeaderboard }) {
    return createElement('header', { class: 'header' },
        createElement('h1', { class: 'header__title' }, 'Memory game'),
        createElement('div', { class: 'header__actions' },
            createElement('button', {
                class: 'header__btn',
                onClick: onNewGame,
            }, 'Новая игра'),
            createElement('button', {
                class: 'header__btn',
                onClick: onLeaderboard,
            }, 'Таблица лидеров')
        )
    );
}