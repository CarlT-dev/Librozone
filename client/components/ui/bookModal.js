import Cart from "../scripts/cart.js";
import Auth from "../../../components/scripts/auth.js";
import openGuestLoginPrompt from "./guestLoginPrompt.js";

const openBookModal = (book) => {
    const existing = document.getElementById("book-modal-overlay");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.id = "book-modal-overlay";
    overlay.className = [
        "fixed inset-0 z-50",
        "bg-black/50 backdrop-blur-sm",
        "flex items-center justify-center p-4",
        "animate-fade-in"
    ].join(" ");

    const availabilityColor = book.available > 0
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700";

    const availabilityText = book.available > 0
        ? `${book.available} of ${book.total} available`
        : "Out of stock";

    const alreadyInCart = Cart.getItems().some(b => b.id === book.id);

    overlay.innerHTML = `
        <div 
            id="book-modal-card"
            class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row gap-0 animate-slide-up"
        >
            <!-- Exit Button -->
            <button
                id="book-modal-close"
                class="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-500 text-gray-500 transition-all"
                aria-label="Close"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>

            <!-- Cover -->
            <div class="md:w-52 shrink-0 bg-lime-50 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none overflow-hidden flex items-center justify-center p-4">
                <img
                    src="${book.cover}"
                    alt="${book.title} cover"
                    class="w-36 md:w-full h-52 md:h-72 object-cover rounded-xl shadow-md"
                    onerror="this.src='https://placehold.co/200x280/d1fae5/16a34a?text=No+Cover'"
                />
            </div>

            <!-- Details -->
            <div class="flex flex-col gap-3 p-6 flex-1">
                <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-xs font-semibold uppercase tracking-wider bg-lime-100 text-lime-700 px-2.5 py-1 rounded-full">
                        ${book.genre}
                    </span>
                    <span class="text-xs text-gray-400">${book.year}</span>
                </div>

                <h2 class="text-2xl font-bold text-gray-800 leading-tight">${book.title}</h2>
                <p class="text-sm text-gray-500 font-medium">by <span class="text-lime-600">${book.author}</span></p>

                <hr class="border-gray-100">

                <p class="text-sm text-gray-600 leading-relaxed">${book.description}</p>

                <div class="flex items-center gap-2 mt-auto pt-2">
                    <span class="text-xs font-semibold px-3 py-1 rounded-full ${availabilityColor}">
                        ${availabilityText}
                    </span>
                </div>

                <!-- Add to Cart Button -->
                <button
                    id="book-modal-add-btn"
                    data-book-id="${book.id}"
                    ${book.available <= 0 || alreadyInCart ? "disabled" : ""}
                    class="mt-2 w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-sm
                        ${book.available <= 0
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : alreadyInCart
                                ? "bg-lime-100 text-lime-500 cursor-not-allowed"
                                : "bg-lime-500 hover:bg-lime-400 active:scale-95 text-white cursor-pointer"
                        }"
                >
                    ${book.available <= 0
                        ? "Unavailable"
                        : alreadyInCart
                            ? "Already in Cart"
                            : "Add to Borrow Cart"
                    }
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById("book-modal-close").onclick = closeBookModal;

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeBookModal();
    });

    const onKeyDown = (e) => {
        if (e.key === "Escape") {
            closeBookModal();
            document.removeEventListener("keydown", onKeyDown);
        }
    };
    document.addEventListener("keydown", onKeyDown);

    // Add to cart 
    document.getElementById("book-modal-add-btn").onclick = () => {

        if (!Auth.isLoggedIn()) {
            openGuestLoginPrompt();
            return;
        }

        const added = Cart.addItem(book);
        if (!added) return;

        // Update button state without closing the modal
        const btn = document.getElementById("book-modal-add-btn");
        btn.disabled = true;
        btn.textContent = "Added to Cart ✓";
        btn.className = btn.className
            .replace("bg-lime-500 hover:bg-lime-400 active:scale-95 text-white cursor-pointer", "")
            + " bg-lime-100 text-lime-500 cursor-not-allowed";
    };
};

const closeBookModal = () => {
    const overlay = document.getElementById("book-modal-overlay");
    const card    = document.getElementById("book-modal-card");
    if (!overlay) return;

    overlay.classList.remove("animate-fade-in");
    overlay.classList.add("animate-fade-out");
    card.classList.remove("animate-slide-up");
    card.classList.add("animate-slide-down");

    card.addEventListener("animationend", () => overlay.remove(), { once: true });
};

export { openBookModal, closeBookModal };