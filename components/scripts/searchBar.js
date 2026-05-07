const readSearchTermFromHash = () => {
    const hash = window.location.hash || "";
    if (!hash.startsWith("#search?")) return "";
    return decodeURIComponent(hash.slice("#search?".length));
};

const initSearchBar = () => {
    const input = document.getElementById("searchInput");
    const submitBtn = document.getElementById("searchSubmit");
    if (!input || !submitBtn) return;

    if (input.dataset.searchBound === "true") return;
    input.dataset.searchBound = "true";

    const syncInputFromHash = () => {
        input.value = readSearchTermFromHash();
    };

    const submitSearch = () => {
        const raw = input.value.trim();
        if (!raw) return;
        window.location.hash = `#search?${encodeURIComponent(raw)}`;
    };

    submitBtn.addEventListener("click", submitSearch);
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            submitSearch();
        }
    });

    window.addEventListener("hashchange", syncInputFromHash);
    syncInputFromHash();
};

export default initSearchBar;
