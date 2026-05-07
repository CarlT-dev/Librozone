import { openBookModal } from "./bookModal.js";

const createBookCard = (book) => {
    const card = document.createElement("div");
    card.className = [
        "snap-start shrink-0 w-36",
        "flex flex-col gap-2",
        "hover:cursor-pointer group"
    ].join(" ");

    card.innerHTML = `
        <div class="relative w-36 h-52 rounded-xl overflow-hidden shadow-md group-hover:shadow-xl group-hover:scale-105 transition-all duration-200">
            <img
                src="${book.cover}"
                alt="${book.title}"
                class="w-full h-full object-cover"
                onerror="this.src='https://placehold.co/144x208/d1fae5/16a34a?text=No+Cover'"
            />
            <!-- Availability badge -->
            <span class="absolute top-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                book.available > 0
                    ? "bg-green-500/90 text-white"
                    : "bg-red-500/90 text-white"
            }">
                ${book.available > 0 ? book.available + " left" : "Out"}
            </span>
        </div>
        <div class="px-1">
            <p class="text-xs font-semibold text-gray-800 truncate leading-tight">${book.title}</p>
            <p class="text-[11px] text-gray-500 truncate">${book.author}</p>
        </div>
    `;

    card.addEventListener("click", () => openBookModal(book));

    return card;
};

export default createBookCard;