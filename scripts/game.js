import { CARD_IMAGES } from './data.js';

export const TOTAL_PAIRS = CARD_IMAGES.length;

export function createDeck() {
    const deck = [];

    for (let imageId = 0; imageId < CARD_IMAGES.length; imageId++) {
        for (let copy = 0; copy < 2; copy++) {
            deck.push({
                id: deck.length,
                imageId,
                isFlipped: false,
                isMatched: false,
            });
        }
    }

    return deck;
}

export function shuffle(array) {
    const copy = array.slice();

    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
}

export function isMatch(cardA, cardB) {
    return cardA.imageId === cardB.imageId;
}

export function isWin(matchedPairs, totalPairs) {
    return matchedPairs === totalPairs;
}
