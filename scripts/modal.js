import { createElement } from './dom.js';

let currentModal = null;

export function openModal({ title, content, onClose }) {
    if (currentModal) closeModal();

    function handleClose() {
        if (currentModal) closeModal();
    }

    const backdrop = createElement('div', { class: 'modal-backdrop' },
        createElement('div', {
            class: 'modal',
            onClick: (e) => e.stopPropagation(),
        },
            createElement('h2', { class: 'modal__title' }, title),
            createElement('div', { class: 'modal__content' }, content),
        )
    );

    backdrop.addEventListener('click', handleClose);

    const onKeydown = (e) => {
        if (e.key === 'Escape') handleClose();
    };

    document.addEventListener('keydown', onKeydown);

    document.body.appendChild(backdrop);
    document.body.style.overflow = 'hidden';

    currentModal = { backdrop, onKeydown, onClose, handleClose };
}

export function closeModal() {
    if (!currentModal) return;

    const { backdrop, onKeydown, onClose } = currentModal;

    backdrop.remove();
    document.removeEventListener('keydown', onKeydown);
    document.body.style.overflow = '';

    currentModal = null;

    if (typeof onClose === 'function') onClose();
}