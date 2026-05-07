import Cart from "../scripts/cart.js";
import { openBorrowModal } from "./borrowModal.js";

const initCartDropdown = () => {
    const cartIcon     = document.getElementById("cart-icon-wrapper");
    const cartBadge    = document.getElementById("cart-badge");
    const cartDropdown = document.getElementById("cart-dropdown");
    const cartList     = document.getElementById("cart-list");
    const cartEmpty    = document.getElementById("cart-empty");
    const proceedBtn = document.getElementById("cart-proceed-btn");

    if (!cartIcon) return;

    let isOpen = false;

    // Badge updater
    const updateBadge = (items) => {
        const count = items.length;
        cartBadge.textContent = count;
        cartBadge.style.display = count === 0 ? "none" : "flex";
    };

    // Dropdown list renderer
    const renderList = (items) => {
        cartList.innerHTML = "";

        if (items.length === 0) {
            cartEmpty.style.display = "flex";
            cartList.style.display  = "none";
            return;
        }

        cartEmpty.style.display = "none";
        cartList.style.display  = "flex";

        items.forEach(book => {
            const item = document.createElement("div");
            item.className = "flex items-center gap-3 p-2 rounded-xl hover:bg-lime-50 transition-colors group";
            item.innerHTML = `
                <img
                    src="${book.cover}"
                    alt="${book.title}"
                    class="w-10 h-14 object-cover rounded-lg shadow-sm shrink-0"
                    onerror="this.src='https://placehold.co/40x56/d1fae5/16a34a?text=?'"
                />
                <div class="flex flex-col flex-1 min-w-0">
                    <span class="text-sm font-semibold text-gray-800 truncate">${book.title}</span>
                    <span class="text-xs text-gray-400 truncate">${book.author}</span>
                    <span class="text-[10px] font-medium text-lime-600 uppercase tracking-wide mt-0.5">${book.genre}</span>
                </div>
                <button
                    data-remove-id="${book.id}"
                    class="shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-gray-300 hover:bg-red-100 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Remove"
                >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            `;

            item.querySelector("[data-remove-id]").onclick = (e) => {
                e.stopPropagation();
                Cart.removeItem(book.id);
            };

            cartList.appendChild(item);
        });
    };

    // Open / Close 
    const openDropdown = () => {
        renderList(Cart.getItems());
        cartDropdown.style.display = "flex";
        // Force reflow so the animation triggers from the start
        cartDropdown.getBoundingClientRect();
        cartDropdown.classList.remove("animate-slide-down", "opacity-0");
        cartDropdown.classList.add("animate-slide-up");
        isOpen = true;
    };

    const closeDropdown = () => {
        if (!isOpen) return;
        cartDropdown.classList.remove("animate-slide-up");
        cartDropdown.classList.add("animate-slide-down");
        cartDropdown.addEventListener("animationend", () => {
            cartDropdown.style.display = "none";
            cartDropdown.classList.remove("animate-slide-down");
            isOpen = false;
        }, { once: true });
    };

    // Toggle on icon click 
    cartIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        isOpen ? closeDropdown() : openDropdown();
    });

    // Close when clicking outside 
    document.addEventListener("click", (e) => {
        if (isOpen && !cartDropdown.contains(e.target) && !cartIcon.contains(e.target)) {
            closeDropdown();
        }
    });

    // Proceed to Borrow button
    if (proceedBtn) {
        proceedBtn.addEventListener("click", () => {
            closeDropdown();
            // Small delay so dropdown closes before modal opens
            setTimeout(() => openBorrowModal(), 250);
        });
    }

    // React to cart changes (add / remove) 
    Cart.onChange((items) => {
        updateBadge(items);
        if (isOpen) renderList(items); // live-update if dropdown is open
    });

    // Init badge on load 
    updateBadge(Cart.getItems());
};

export default initCartDropdown;