import DB from "../../../db.js";
import createBookCard from "../ui/bookCard.js";

const readSearchTermFromHash = () => {
    const hash = window.location.hash || "";
    if (!hash.startsWith("#search?")) return "";
    return decodeURIComponent(hash.slice("#search?".length)).trim();
};

const scoreBookMatch = (book, term) => {
    const q = term.toLowerCase();
    const title = (book.title || "").toLowerCase();
    const author = (book.author || "").toLowerCase();
    const genre = (book.genre || "").toLowerCase();
    const description = (book.description || "").toLowerCase();

    let score = 0;

    if (title === q) score += 1000;
    else if (title.startsWith(q)) score += 700;
    else if (title.includes(q)) score += 500;

    if (author.startsWith(q)) score += 250;
    else if (author.includes(q)) score += 180;

    if (genre.startsWith(q)) score += 120;
    else if (genre.includes(q)) score += 80;

    if (description.includes(q)) score += 30;

    return score;
};

const initSearchPage = () => {
    const keywordEl = document.getElementById("search-keyword-label");
    const countEl = document.getElementById("search-results-count");
    const listEl = document.getElementById("search-results-list");
    if (!keywordEl || !countEl || !listEl) return;

    const term = readSearchTermFromHash();
    const books = DB.getAllBooks();

    if (!term) {
        keywordEl.textContent = "Type a keyword in the header search bar.";
        countEl.textContent = "";
        listEl.innerHTML = `<p class="text-gray-400">No keyword provided.</p>`;
        return;
    }

    keywordEl.textContent = `Showing best matches for "${term}"`;

    const rankedResults = books
        .map((book) => ({ book, score: scoreBookMatch(book, term) }))
        .filter((row) => row.score > 0)
        .sort((a, b) => b.score - a.score || a.book.title.localeCompare(b.book.title))
        .map((row) => row.book);

    countEl.textContent = `${rankedResults.length} result${rankedResults.length !== 1 ? "s" : ""}`;
    listEl.innerHTML = "";

    if (rankedResults.length === 0) {
        listEl.innerHTML = `<p class="text-gray-400">No books matched your search.</p>`;
        return;
    }

    rankedResults.forEach((book) => {
        listEl.appendChild(createBookCard(book));
    });
};

export default initSearchPage;
