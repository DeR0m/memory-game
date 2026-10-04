let state = null;
const listeners = [];

export function initState(initial) {
    state = initial;
    notify();
}

export function getState() {
    if (!state) throw new Error('State NOT initialized. Call initState() first')
    return state;
}

export function setState(patch) {
    state = { ...state, ...patch };
    notify();
}

export function subscribe(fn) {
    listeners.push(fn);
}

function notify() {
    listeners.forEach((fn) => fn(state));
}