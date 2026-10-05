import { createElement, clear, mount } from './dom.js';
import { Header } from './components/header.js';
import { Counters } from './components/counters.js';
import { Board } from './components/board.js';
import { openModal, closeModal } from './modal.js';
import { loadResults, saveResult, formatDate } from './storage.js';
import { createDeck, shuffle, TOTAL_PAIRS } from './game.js';
import { initState, getState, setState, subscribe } from './state.js';

const root = createElement('div', { class: 'app' });
document.body.appendChild(root);

let closeTimerId = null;

function createInitialState() {
    return {
        cards: shuffle(createDeck()),
        firstCard: null,
        secondCard: null,
        moves: 0,
        matchedPairs: 0,
        isLocked: false,
        isGameOver: false,
    };
}

initState(createInitialState());

subscribe(render);

render();

function showWinModal(moves) {
    openModal({
        title: 'Победа!',
        content: [
            createElement('p', {}, `Вы нашли все пары за ${moves} ходов.`),
            createElement('div', { class: 'modal__actions' },
                createElement('button', {
                    class: 'modal__button',
                    onClick: () => {
                        closeModal();
                        handleNewGame();
                    },
                }, 'Новая игра'),
                createElement('button', {
                    class: 'modal__button',
                    onClick: () => closeModal(),
                }, 'Закрыть'),
            ),
        ],
    });
}

function showLeaderboardModal() {
    const results = loadResults();
    if (results.length === 0) {
        return createElement('p', { class: 'leaderboard__empty' }, 'Пока нет результатов');
    }
    return createElement('ol', { class: 'leaderboard' },
        results.map((result, index) =>
            createElement('li', { class: 'leaderboard__item' },
                createElement('span', { class: 'leaderboard__place' }, `${index + 1}.`),
                createElement('span', { class: 'leaderboard__moves' }, `${result.moves} ходов`),
                createElement('span', { class: 'leaderboard__date' }, formatDate(result.date)),
            )
        )
    );
}

function handleLeaderboard() {
    openModal({
        title: 'Таблица лидеров',
        content: showLeaderboardModal(),
    });
}

function handleCardClick(id) {
    const { cards, isLocked, isGameOver, firstCard, moves, matchedPairs } = getState();
    if (isLocked) return;
    if (isGameOver) return;

    const card = cards.find((c) => c.id === id);
    if (!card) return;
    if (card.isFlipped || card.isMatched) return;

    if (firstCard === null) {
        const newCards = cards.map((c) =>
            c.id === id ? { ...c, isFlipped: true } : c
        );

        setState({ cards: newCards, firstCard: id });
        return;
    }

    const first = cards.find((c) => c.id === firstCard);

    if (first.imageId === card.imageId) {
        const newCards = cards.map((c) => {
            if (c.id === firstCard || c.id === id) {
                return { ...c, isFlipped: true, isMatched: true };
            }
            return c;
        });

        const newMatchedPairs = matchedPairs + 1;
        const isGameOver = newMatchedPairs === TOTAL_PAIRS;

        setState({
            cards: newCards,
            firstCard: null,
            moves: moves + 1,
            matchedPairs: newMatchedPairs,
            isGameOver,
        });

        if (isGameOver) {
            saveResult(moves + 1);
            showWinModal(moves + 1);
        }
        return;
    }

    const newCards = cards.map((c) => {
        if (c.id === id) {
            return { ...c, isFlipped: true };
        }
        return c;
    });

    setState({
        cards: newCards,
        moves: moves + 1,
        isLocked: true,
    });

    closeTimerId = setTimeout(() => {
        const { cards: freshCards } = getState();
        const closedCards = freshCards.map((c) => {
            if (c.id === firstCard || c.id === id) {
                return { ...c, isFlipped: false };
            }
            return c;
        });
        setState({
            cards: closedCards,
            firstCard: null,
            isLocked: false,
        });
        closeTimerId = null;
    }, 1000);

}

function render() {
    const { cards, moves, matchedPairs } = getState();
    clear(root);
    mount(root,
        Header({
            onNewGame: handleNewGame,
            onLeaderboard: handleLeaderboard,
        }),
        Counters({
            moves,
            matchedPairs,
            totalPairs: TOTAL_PAIRS,
        }),
        Board({
            cards,
            onCardClick: handleCardClick,
        }),
    );
}

function handleNewGame() {
    if (closeTimerId !== null) {
        clearTimeout(closeTimerId);
        closeTimerId = null;
    }
    setState(createInitialState());
}