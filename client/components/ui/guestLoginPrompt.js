// client/components/ui/guestLoginPrompt.js
// Shows a "login required" prompt when a guest tries to add a book to cart.

const openGuestLoginPrompt = () => {
    const existing = document.getElementById("guest-prompt-overlay");

    const overlay = document.createElement("div");
    overlay.id = "guest-prompt-overlay";
    overlay.className = [
        "fixed inset-0 z-[60]",          // above book modal (z-50)
        "bg-black/60 backdrop-blur-sm",
        "flex items-center justify-center p-4",
        "animate-fade-in"
    ].join(" ");

    overlay.innerHTML = `
        <div
            id="guest-prompt-card"
            class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center gap-5 animate-slide-up"
        >
            <!-- Icon -->
            <div class="w-14 h-14 rounded-full bg-lime-100 flex items-center justify-center">
                <svg class="w-7 h-7 text-lime-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z"/>
                </svg>
            </div>

            <!-- Text -->
            <div class="text-center">
                <h3 class="text-lg font-bold text-gray-800 mb-1">Login Required</h3>
                <p class="text-sm text-gray-500 leading-relaxed">
                    You need to be logged in to add books to your borrow cart.
                </p>
            </div>

            <!-- Buttons -->
            <div class="flex flex-col gap-2 w-full">
                <button
                    id="guest-prompt-confirm"
                    class="w-full py-3 rounded-xl bg-lime-500 hover:bg-lime-400 active:scale-95
                           text-white font-bold text-sm transition-all shadow-sm cursor-pointer"
                >
                    Go to Login
                </button>
                <button
                    id="guest-prompt-cancel"
                    class="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 active:scale-95
                           text-gray-600 font-semibold text-sm transition-all cursor-pointer"
                >
                    Cancel
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // ── Close helper ─────────────────────────────────────────────────────────
    const closePrompt = () => {
        const card = document.getElementById("guest-prompt-card");
        overlay.classList.remove("animate-fade-in");
        overlay.classList.add("animate-fade-out");
        card.classList.remove("animate-slide-up");
        card.classList.add("animate-slide-down");
        card.addEventListener("animationend", () => overlay.remove(), { once: true });
    };

    // ── "Go to Login" — close both modals, then navigate ────────────────────
    document.getElementById("guest-prompt-confirm").onclick = () => {
        closePrompt();

        // Also close the book modal if it's open
        const bookOverlay = document.getElementById("book-modal-overlay");
        const bookCard    = document.getElementById("book-modal-card");
        if (bookOverlay && bookCard) {
            bookOverlay.classList.remove("animate-fade-in");
            bookOverlay.classList.add("animate-fade-out");
            bookCard.classList.remove("animate-slide-up");
            bookCard.classList.add("animate-slide-down");
            bookCard.addEventListener("animationend", () => {
                bookOverlay.remove();
                window.location.hash = "#login";
            }, { once: true });
        } else {
            window.location.hash = "#login";
        }
    };

    // ── "Cancel" — just close the prompt ────────────────────────────────────
    document.getElementById("guest-prompt-cancel").onclick = closePrompt;

    // Close on backdrop click
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closePrompt();
    });

    // Close on Escape
    const onKey = (e) => {
        if (e.key === "Escape") {
            closePrompt();
            document.removeEventListener("keydown", onKey);
        }
    };
    document.addEventListener("keydown", onKey);
};

export default openGuestLoginPrompt;