const STORAGE_KEY = 'memory-game-leaderboard';

export function loadResults() {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function saveResult(moves) {
    const results = loadResults();

    results.push({
        moves,
        date: new Date().toISOString(),
    });

    results.sort((a, b) => {
        if (a.moves !== b.moves) return a.moves - b.moves;
        return new Date(a.date) - new Date(b.date);
    });

    const top10 = results.slice(0, 10);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(top10));
}

export function formatDate(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}