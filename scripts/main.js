import { createElement, clear, mount } from './dom.js';
import { Header } from './components/header.js';

const root = createElement('div', { class: 'app' });
document.body.appendChild(root);

function render() {
    clear(root);

    mount(root,
        Header({}),
    );

}

function newGame() {
    render();
}

newGame();