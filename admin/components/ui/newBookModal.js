import DB from "../../../db.js";

// ── Close animation ───────────────────────────────────────────────────────────

const closeNewBookModal = () => {
    const overlay = document.getElementById("new-book-modal");
    const card    = document.getElementById("new-book-modal-card");
    if (!overlay) return;

    overlay.classList.remove("animate-fade-in");
    overlay.classList.add("animate-fade-out");
    card.classList.remove("animate-slide-up");
    card.classList.add("animate-slide-down");

    card.addEventListener("animationend", () => overlay.remove(), { once: true });
};

// ── Dirty-state tracker ───────────────────────────────────────────────────────

/**
 * Watches every required text/number field plus the file input.
 * "Add Book" button stays disabled until every required field has a value.
 * Required fields: title, author, genre, year, available, total.
 * Cover image and description are optional but still tracked for the button.
 */
const watchFields = () => {
    const saveBtn  = document.getElementById("new-modal-save");
    const required = ["nb-title", "nb-author", "nb-genre", "nb-year", "nb-available", "nb-total"];

    const evaluate = () => {
        // Every required text/number input must be non-empty
        const allFilled = required.every(id => {
            const el = document.getElementById(id);
            return el && el.value.trim() !== "";
        });

        saveBtn.disabled = !allFilled;
        saveBtn.classList.toggle("bg-lime-500",        allFilled);
        saveBtn.classList.toggle("hover:bg-lime-400",  allFilled);
        saveBtn.classList.toggle("text-white",         allFilled);
        saveBtn.classList.toggle("cursor-pointer",     allFilled);
        saveBtn.classList.toggle("active:scale-95",    allFilled);
        saveBtn.classList.toggle("bg-gray-200",        !allFilled);
        saveBtn.classList.toggle("text-gray-400",      !allFilled);
        saveBtn.classList.toggle("cursor-not-allowed", !allFilled);
    };

    // Watch every required field
    required.forEach(id => {
        document.getElementById(id)?.addEventListener("input", evaluate);
    });

    evaluate(); // start disabled
};

// ── Main export ───────────────────────────────────────────────────────────────

const openNewBookModal = (refreshCallback) => {
    document.getElementById("new-book-modal")?.remove();

    const overlay = document.createElement("div");
    overlay.id = "new-book-modal";
    overlay.className = [
        "fixed inset-0 z-50",
        "bg-black/50 backdrop-blur-sm",
        "flex items-center justify-center p-4",
        "animate-fade-in",
    ].join(" ");

    overlay.innerHTML = `
        <div
            id="new-book-modal-card"
            class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-slide-up flex flex-col overflow-hidden"
            style="max-height: 90vh;"
        >
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
                <div>
                    <h2 class="text-lg font-bold text-gray-800">Add New Book</h2>
                    <p class="text-xs text-gray-400 mt-0.5">Fill in all required fields to enable saving</p>
                </div>
                <button
                    id="new-modal-close"
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

                <!-- Title -->
                <div class="flex flex-col gap-1">
                    <label for="nb-title" class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Title <span class="text-red-400">*</span>
                    </label>
                    <input id="nb-title" type="text"
                        placeholder="e.g. The Great Gatsby"
                        class="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800
                               focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent
                               transition-all bg-gray-50 focus:bg-white"/>
                </div>

                <!-- Author -->
                <div class="flex flex-col gap-1">
                    <label for="nb-author" class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Author <span class="text-red-400">*</span>
                    </label>
                    <input id="nb-author" type="text"
                        placeholder="e.g. F. Scott Fitzgerald"
                        class="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800
                               focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent
                               transition-all bg-gray-50 focus:bg-white"/>
                </div>

                <!-- Genre + Year side by side -->
                <div class="flex gap-3">
                    <div class="flex-1 flex flex-col gap-1">
                        <label for="nb-genre" class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Genre <span class="text-red-400">*</span>
                        </label>
                        <input id="nb-genre" type="text"
                            placeholder="e.g. Fiction"
                            class="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800
                                   focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent
                                   transition-all bg-gray-50 focus:bg-white"/>
                    </div>
                    <div class="flex-1 flex flex-col gap-1">
                        <label for="nb-year" class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Year <span class="text-red-400">*</span>
                        </label>
                        <input id="nb-year" type="number"
                            min="1000" max="2099"
                            placeholder="e.g. 1925"
                            class="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800
                                   focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent
                                   transition-all bg-gray-50 focus:bg-white"/>
                    </div>
                </div>

                <!-- Cover image upload with live preview -->
                <div class="flex flex-col gap-1">
                    <label for="nb-cover" class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Cover Image <span class="text-gray-400 font-normal normal-case">(optional)</span>
                    </label>
                    <div class="flex gap-3 items-center">
                        <!-- Hidden real file input -->
                        <input id="nb-cover" type="file" accept="image/*" class="hidden"/>

                        <!-- Styled trigger button -->
                        <button
                            type="button"
                            id="nb-cover-trigger"
                            class="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-gray-300
                                   bg-gray-50 hover:bg-lime-50 hover:border-lime-400 text-sm text-gray-500
                                   hover:text-lime-600 transition-all cursor-pointer"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                            </svg>
                            <span id="nb-cover-label">Choose image…</span>
                        </button>

                        <!-- Live preview thumbnail -->
                        <img
                            id="nb-cover-preview"
                            src=""
                            alt="cover preview"
                            class="w-12 h-16 object-cover rounded-lg shadow-sm shrink-0 border border-gray-100 hidden"
                        />
                    </div>
                    <p class="text-[11px] text-gray-400 mt-0.5">
                        Accepted: JPG, PNG, WEBP. Image is stored locally in your browser.
                    </p>
                </div>

                <!-- Available / Total -->
                <div class="flex gap-3">
                    <div class="flex-1 flex flex-col gap-1">
                        <label for="nb-available" class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Available <span class="text-red-400">*</span>
                        </label>
                        <input id="nb-available" type="number" min="0"
                            placeholder="0"
                            class="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800
                                   focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent
                                   transition-all bg-gray-50 focus:bg-white"/>
                    </div>
                    <div class="flex-1 flex flex-col gap-1">
                        <label for="nb-total" class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Total Copies <span class="text-red-400">*</span>
                        </label>
                        <input id="nb-total" type="number" min="1"
                            placeholder="1"
                            class="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800
                                   focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent
                                   transition-all bg-gray-50 focus:bg-white"/>
                    </div>
                </div>

                <!-- Description -->
                <div class="flex flex-col gap-1">
                    <label for="nb-description" class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Description <span class="text-gray-400 font-normal normal-case">(optional)</span>
                    </label>
                    <textarea id="nb-description" rows="4"
                        placeholder="Short summary of the book…"
                        class="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800
                               focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent
                               transition-all bg-gray-50 focus:bg-white resize-none"></textarea>
                </div>

                <!-- Trending toggle -->
                <label class="flex items-center gap-3 cursor-pointer select-none">
                    <div class="relative">
                        <input id="nb-trending" type="checkbox" class="sr-only peer"/>
                        <div class="w-10 h-6 bg-gray-200 rounded-full peer-checked:bg-lime-500 transition-colors"></div>
                        <div class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4"></div>
                    </div>
                    <span class="text-sm font-semibold text-gray-700">Mark as Trending</span>
                </label>

                <!-- Inline validation error -->
                <p id="nb-error" class="text-xs text-red-500 hidden"></p>
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 border-t border-gray-100 shrink-0 flex gap-3">
                <button
                    id="new-modal-cancel"
                    class="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 active:scale-95
                           text-gray-600 font-semibold text-sm transition-all cursor-pointer"
                >
                    Cancel
                </button>
                <!-- Disabled until all required fields are filled -->
                <button
                    id="new-modal-save"
                    disabled
                    class="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm
                           bg-gray-200 text-gray-400 cursor-not-allowed"
                >
                    Add Book
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // ── File input: proxy the styled button to the hidden <input type="file"> ──
    // line 176 — clicking the styled button opens the native file picker
    document.getElementById("nb-cover-trigger").onclick = () => {
        document.getElementById("nb-cover").click();
    };

    // line 180 — when a file is chosen, read it as base64 and show preview
    document.getElementById("nb-cover").addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (evt) => {
            const dataUrl = evt.target.result;                  // base64 string
            const preview = document.getElementById("nb-cover-preview");
            const label   = document.getElementById("nb-cover-label");

            preview.src = dataUrl;
            preview.classList.remove("hidden");
            label.textContent = file.name.length > 22
                ? file.name.slice(0, 20) + "…"
                : file.name;
        };

        reader.readAsDataURL(file);                             // converts to base64
    });

    // line 198 — dirty tracking (enables Add Book once required fields are filled)
    watchFields();

    // Close handlers
    document.getElementById("new-modal-close").onclick  = closeNewBookModal;
    document.getElementById("new-modal-cancel").onclick = closeNewBookModal;

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeNewBookModal();
    });

    const onKey = (e) => {
        if (e.key === "Escape") { closeNewBookModal(); document.removeEventListener("keydown", onKey); }
    };
    document.addEventListener("keydown", onKey);

    // Save / Add handler
    document.getElementById("new-modal-save").onclick = () => {
        const errorEl = document.getElementById("nb-error");

        const title       = document.getElementById("nb-title").value.trim();
        const author      = document.getElementById("nb-author").value.trim();
        const genre       = document.getElementById("nb-genre").value.trim();
        const year        = parseInt(document.getElementById("nb-year").value, 10);
        const available   = parseInt(document.getElementById("nb-available").value, 10);
        const total       = parseInt(document.getElementById("nb-total").value, 10);
        const description = document.getElementById("nb-description").value.trim();
        const trending    = document.getElementById("nb-trending").checked;

        // Cover: use base64 data URL if a file was chosen, otherwise empty placeholder
        const preview     = document.getElementById("nb-cover-preview");
        const cover       = preview.src && !preview.classList.contains("hidden")
            ? preview.src   // base64 data URL
            : "https://placehold.co/144x208/d1fae5/16a34a?text=No+Cover";

        // Validation
        if (!title || !author || !genre) {
            errorEl.textContent = "Title, author, and genre are required.";
            errorEl.classList.remove("hidden");
            return;
        }
        if (isNaN(year) || year < 1000 || year > 2099) {
            errorEl.textContent = "Please enter a valid year (1000 – 2099).";
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

        // add to local storage
        DB.addBook({ title, author, genre, year, cover, available, total, description, trending });

        closeNewBookModal();
        refreshCallback();   // re-render the inventory table
    };
};

export default openNewBookModal;