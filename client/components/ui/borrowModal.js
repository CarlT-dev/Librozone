import Cart from "../scripts/cart.js";
import DB from "../../../db.js";
import Auth from "../../../components/scripts/auth.js";

// Helpers 

const fmt = (isoString) => new Date(isoString).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric"
});

const closeModal = () => {
    const overlay = document.getElementById("borrow-modal-overlay");
    const card    = document.getElementById("borrow-modal-card");
    if (!overlay) return;

    overlay.classList.remove("animate-fade-in");
    overlay.classList.add("animate-fade-out");
    card.classList.remove("animate-slide-up");
    card.classList.add("animate-slide-down");

    card.addEventListener("animationend", () => overlay.remove(), { once: true });
};

// Success screen (replaces card content after confirm)

const showSuccess = (results) => {
    const card = document.getElementById("borrow-modal-card");
    if (!card) return;

    const borrowed = results.filter(r => r.success);
    const failed   = results.filter(r => !r.success);

    card.innerHTML = `
        <div class="flex flex-col items-center gap-4 p-10 text-center">
            <div class="w-16 h-16 rounded-full bg-lime-100 flex items-center justify-center">
                <svg class="w-8 h-8 text-lime-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
            </div>

            <h2 class="text-xl font-bold text-gray-800">Borrow Confirmed!</h2>
            <p class="text-sm text-gray-500">
                ${borrowed.length} book${borrowed.length !== 1 ? "s" : ""} borrowed successfully.
                ${failed.length > 0 ? `<br><span class="text-red-400">${failed.length} could not be borrowed (unavailable).</span>` : ""}
            </p>

            ${borrowed.length > 0 ? `
            <div class="w-full border border-lime-100 rounded-xl overflow-hidden text-left">
                <div class="bg-lime-50 px-4 py-2 text-xs font-semibold text-lime-700 uppercase tracking-wider">Borrowed Books</div>
                <div class="divide-y divide-gray-100">
                    ${borrowed.map(r => `
                        <div class="flex items-center gap-3 px-4 py-3">
                            <img src="${r.book.cover}" class="w-8 h-11 object-cover rounded-md shadow-sm shrink-0"
                                 onerror="this.src='https://placehold.co/32x44/d1fae5/16a34a?text=?'"/>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-semibold text-gray-800 truncate">${r.book.title}</p>
                                <p class="text-xs text-gray-400">Due: <span class="text-lime-600 font-medium">${fmt(r.borrowing.dueAt)}</span></p>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
            ` : ""}

            <button
                id="borrow-success-close"
                class="mt-2 w-full py-3 rounded-xl bg-lime-500 hover:bg-lime-400 active:scale-95
                       text-white font-bold text-sm transition-all"
            >Done</button>
        </div>
    `;

    document.getElementById("borrow-success-close").onclick = closeModal;
};

// Main modal

const openBorrowModal = () => {
    const existing = document.getElementById("borrow-modal-overlay");
    if (existing) existing.remove();

    const items = Cart.getItems();
    if (items.length === 0) return;

    // Pre-fetch live book data to check availability
    const liveBooks = items.map(item => ({
        cartItem: item,
        book: DB.getBookById(item.id)
    }));

    const overlay = document.createElement("div");
    overlay.id = "borrow-modal-overlay";
    overlay.className = [
        "fixed inset-0 z-50",
        "bg-black/50",
        "flex items-center justify-center p-4",
        "animate-fade-in"
    ].join(" ");

    const hasUnavailable = liveBooks.some(({ book }) => !book || book.available <= 0);

    overlay.innerHTML = `
        <div
            id="borrow-modal-card"
            class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-slide-up flex flex-col overflow-hidden"
            style="max-height: 90vh;"
        >
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
                <div>
                    <h2 class="text-lg font-bold text-gray-800">Confirm Borrow</h2>
                    <p class="text-xs text-gray-400 mt-0.5">${items.length} book${items.length !== 1 ? "s" : ""} · 14-day loan period</p>
                </div>
                <button
                    id="borrow-modal-close"
                    class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100
                           hover:bg-red-100 hover:text-red-500 text-gray-500 transition-all"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>

            <!-- Scrollable book list -->
            <div class="overflow-y-auto flex-1 px-6 py-4 flex flex-col gap-3">
                ${liveBooks.map(({ cartItem, book }) => {
                    const unavailable = !book || book.available <= 0;
                    return `
                    <div class="flex items-center gap-3 p-3 rounded-xl border ${
                        unavailable ? "border-red-100 bg-red-50" : "border-gray-100 bg-gray-50"
                    }">
                        <img
                            src="${cartItem.cover}"
                            alt="${cartItem.title}"
                            class="w-10 h-14 object-cover rounded-lg shadow-sm shrink-0"
                            onerror="this.src='https://placehold.co/40x56/d1fae5/16a34a?text=?'"
                        />
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-semibold text-gray-800 truncate">${cartItem.title}</p>
                            <p class="text-xs text-gray-500 truncate">${cartItem.author}</p>
                            <p class="text-[11px] mt-1 font-medium ${unavailable ? "text-red-400" : "text-lime-600"}">
                                ${unavailable ? "⚠ Currently unavailable" : `${book.available} copies available`}
                            </p>
                        </div>
                        <div class="text-right shrink-0 text-xs text-gray-400">
                            ${unavailable ? "" : `
                                <p class="text-gray-500">Due</p>
                                <p class="font-semibold text-gray-700">${fmt(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString())}</p>
                            `}
                        </div>
                    </div>
                `}).join("")}
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 border-t border-gray-100 shrink-0 flex flex-col gap-2">
                ${hasUnavailable ? `
                <p class="text-xs text-red-400 text-center">
                    Unavailable books will be skipped. Only available books will be borrowed.
                </p>
                ` : ""}
                <button
                    id="borrow-confirm-btn"
                    class="w-full py-3 rounded-xl bg-lime-500 hover:bg-lime-400 active:scale-95
                           text-white font-bold text-sm transition-all shadow-sm"
                >
                    Confirm Borrow
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Close events
    document.getElementById("borrow-modal-close").onclick = closeModal;
    overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
    const onKey = (e) => { if (e.key === "Escape") { closeModal(); document.removeEventListener("keydown", onKey); } };
    document.addEventListener("keydown", onKey);

    // Confirm 
    document.getElementById("borrow-confirm-btn").onclick = () => {
        const user = Auth.getUser();
        if (!user) {
            alert("You must be logged in to borrow.");
            return;
        }

        const btn = document.getElementById("borrow-confirm-btn");
        btn.disabled = true;
        btn.textContent = "Processing...";

        // One transaction id for the whole checkout
        const transactionId = Date.now();

        const results = liveBooks.map(({ cartItem, book }) => {
            if (!book || book.available <= 0) {
                return { success: false, book: cartItem, borrowing: null };
            }
            const borrowing = DB.borrowBook(user.id, book.id, transactionId);
            return borrowing
                ? { success: true,  book, borrowing }
                : { success: false, book: cartItem, borrowing: null };
        });

        // Clear cart after processing
        Cart.clear();
        window.dispatchEvent(new Event("hashchange"));  

        showSuccess(results);
    };
};

export { openBorrowModal, closeModal as closeBorrowModal };