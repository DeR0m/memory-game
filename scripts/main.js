import { createElement, clear, mount } from './dom.js';
import { Header } from './components/header.js';
import { Board } from './components/board.js';
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
            console.log('Победа! Ходов:', moves + 1);
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
    const { cards } = getState();
    clear(root);
    mount(root,
        Header({
            onNewGame: handleNewGame,
            onLeaderboard: () => console.log('leaderboard'),
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