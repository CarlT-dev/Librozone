import DB from "../../../db.js";

// Helpers

const closeModal = () => {
    const overlay = document.getElementById("update-book-modal");
    const card    = document.getElementById("update-book-modal-card");
    if (!overlay) return;

    overlay.classList.remove("animate-fade-in");
    overlay.classList.add("animate-fade-out");
    card.classList.remove("animate-slide-up");
    card.classList.add("animate-slide-down");

    card.addEventListener("animationend", () => overlay.remove(), { once: true });
};

// Field builder helper
export const field = (id, label, type, value, extra = "") => `
    <div class="flex flex-col gap-1">
        <label for="${id}" class="text-xs font-semibold text-gray-500 uppercase tracking-wider">${label}</label>
        <input
            id="${id}"
            type="${type}"
            value="${String(value).replace(/"/g, "&quot;")}"
            ${extra}
            class="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800
                   focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent
                   transition-all bg-gray-50 focus:bg-white"
        />
    </div>
`;


const openUpdateBookModal = (book, refreshCallback) => {
    document.getElementById("update-book-modal")?.remove();

    const overlay = document.createElement("div");
    overlay.id = "update-book-modal";
    overlay.className = [
        "fixed inset-0 z-50",
        "bg-black/50 backdrop-blur-sm",
        "flex items-center justify-center p-4",
        "animate-fade-in"
    ].join(" ");

    overlay.innerHTML = `
        <div
            id="update-book-modal-card"
            class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-slide-up flex flex-col overflow-hidden"
            style="max-height: 90vh;"
        >
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
                <div>
                    <h2 class="text-lg font-bold text-gray-800">Edit Book</h2>
                    <p class="text-xs text-gray-400 mt-0.5">ID #${book.id} · changes save immediately</p>
                </div>
                <button
                    id="update-modal-close"
                    class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100
                           hover:bg-red-100 hover:text-red-500 text-gray-500 transition-all"
                    aria-label="Close"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>

            <!-- Scrollable form body -->
            <div class="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-4">

                ${field("ub-title",     "Title",             "text",   book.title)}
                ${field("ub-author",    "Author",            "text",   book.author)}
                ${field("ub-genre",     "Genre",             "text",   book.genre)}
                ${field("ub-year",      "Year",              "number", book.year,  'min="1000" max="2099"')}

                <!-- Cover URL with live preview -->
                <div class="flex flex-col gap-1">
                    <label for="ub-cover" class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cover URL</label>
                    <div class="flex gap-3 items-start">
                        <input
                            id="ub-cover"
                            type="text"
                            value="${String(book.cover).replace(/"/g, "&quot;")}"
                            class="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800
                                   focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent
                                   transition-all bg-gray-50 focus:bg-white"
                        />
                        <img
                            id="ub-cover-preview"
                            src="${book.cover}"
                            alt="cover preview"
                            class="w-12 h-16 object-cover rounded-lg shadow-sm shrink-0 border border-gray-100"
                            onerror="this.src='https://placehold.co/48x64/d1fae5/16a34a?text=?'"
                        />
                    </div>
                </div>

                <!-- Available / Total side by side -->
                <div class="flex gap-3">
                    <div class="flex-1 flex flex-col gap-1">
                        <label for="ub-available" class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Available</label>
                        <input
                            id="ub-available"
                            type="number" min="0"
                            value="${book.available}"
                            class="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800
                                   focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent
                                   transition-all bg-gray-50 focus:bg-white"
                        />
                    </div>
                    <div class="flex-1 flex flex-col gap-1">
                        <label for="ub-total" class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Copies</label>
                        <input
                            id="ub-total"
                            type="number" min="1"
                            value="${book.total}"
                            class="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800
                                   focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent
                                   transition-all bg-gray-50 focus:bg-white"
                        />
                    </div>
                </div>

                <!-- Description -->
                <div class="flex flex-col gap-1">
                    <label for="ub-description" class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</label>
                    <textarea
                        id="ub-description"
                        rows="4"
                        class="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800
                               focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent
                               transition-all bg-gray-50 focus:bg-white resize-none"
                    >${book.description ?? ""}</textarea>
                </div>

                <!-- Trending toggle -->
                <label class="flex items-center gap-3 cursor-pointer select-none">
                    <div class="relative">
                        <input id="ub-trending" type="checkbox" class="sr-only peer" ${book.trending ? "checked" : ""}/>
                        <div class="w-10 h-6 bg-gray-200 rounded-full peer-checked:bg-lime-500 transition-colors"></div>
                        <div class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4"></div>
                    </div>
                    <span class="text-sm font-semibold text-gray-700">Trending</span>
                </label>

                <!-- Inline error message -->
                <p id="ub-error" class="text-xs text-red-500 hidden"></p>
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 border-t border-gray-100 shrink-0 flex gap-3">
                <button
                    id="update-modal-cancel"
                    class="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 active:scale-95
                           text-gray-600 font-semibold text-sm transition-all"
                >
                    Cancel
                </button>
                <button
                    id="update-modal-save"
                    class="flex-1 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 active:scale-95
                           text-white font-bold text-sm transition-all shadow-sm"
                >
                    Save Changes
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Live cover preview 
    document.getElementById("ub-cover").addEventListener("input", (e) => {
        const preview = document.getElementById("ub-cover-preview");
        preview.src = e.target.value || "https://placehold.co/48x64/d1fae5/16a34a?text=?";
    });

    // Close logic 
    document.getElementById("update-modal-close").onclick  = closeModal;
    document.getElementById("update-modal-cancel").onclick = closeModal;

    // Close on backdrop click
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeModal();
    });

    // Close on Escape
    const onKey = (e) => {
        if (e.key === "Escape") {
            closeModal();
            document.removeEventListener("keydown", onKey);
        }
    };
    document.addEventListener("keydown", onKey);

    // Save handler
    document.getElementById("update-modal-save").onclick = () => {
        const errorEl = document.getElementById("ub-error");

        const title       = document.getElementById("ub-title").value.trim();
        const author      = document.getElementById("ub-author").value.trim();
        const genre       = document.getElementById("ub-genre").value.trim();
        const year        = parseInt(document.getElementById("ub-year").value, 10);
        const cover       = document.getElementById("ub-cover").value.trim();
        const available   = parseInt(document.getElementById("ub-available").value, 10);
        const total       = parseInt(document.getElementById("ub-total").value, 10);
        const description = document.getElementById("ub-description").value.trim();
        const trending    = document.getElementById("ub-trending").checked;

        // Basic validation 
        if (!title || !author || !genre) {
            errorEl.textContent = "Title, author, and genre are required.";
            errorEl.classList.remove("hidden");
            return;
        }
        if (isNaN(available) || isNaN(total) || available < 0 || total < 1) {
            errorEl.textContent = "Available must be ≥ 0 and total must be ≥ 1.";
            errorEl.classList.remove("hidden");
            return;
        }
        if (available > total) {
            errorEl.textContent = "Available copies cannot exceed total copies.";
            errorEl.classList.remove("hidden");
            return;
        }

        errorEl.classList.add("hidden");

        // ── Persist ───────────────────────────────────────────────────────────
        DB.updateBook(book.id, { title, author, genre, year, cover, available, total, description, trending });

        closeModal();

        // Re-render the inventory table so changes are visible immediately
        refreshCallback();
    };
};

export default openUpdateBookModal;