import DB from "../../../db.js";
import openUpdateBookModal from "./updateBookModal.js";
import { BASE } from "../../../components/scripts/basePath.js";

export const createBookInventoryRow = (book, refreshCallback) => {
    const tr = document.createElement("tr");
    tr.className = "border-b hover:bg-gray-50 transition-colors";

    tr.innerHTML = `
        <td class="p-4 text-gray-600 font-mono text-sm">#${book.id}</td>
        <td class="p-4 font-medium text-gray-800">${book.title}</td>
        <td class="p-4 text-gray-600">${book.author}</td>
        <td class="p-4 text-gray-500 text-sm">${book.genre}</td>
        <td class="pt-6 px-1 flex justify-center items-center">
            <span class="px-2 py-1 rounded-full text-xs font-semibold ${
                book.available > 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
            }">
                ${book.available} / ${book.total}
            </span>
        </td>
        <td class="p-4 text-right">
            <span class="inline-flex gap-2 items-center justify-end">
                <button data-id="${book.id}" class="edit-btn p-1 rounded hover:bg-sky-50 transition-colors" title="Edit">
                    <svg class="w-5 h-5 text-sky-700 hover:text-sky-500 transition-colors">
                        <use href="${BASE}assets/sprite.svg#icon-pen"></use>
                    </svg>
                </button>
                <button data-id="${book.id}" class="delete-btn p-1 rounded hover:bg-red-50 transition-colors" title="Delete">
                    <svg class="w-5 h-5 fill-red-500 hover:fill-red-400 transition-colors">
                        <use href="${BASE}assets/sprite.svg#icon-trash"></use>
                    </svg>
                </button>
            </span>
        </td>
    `;

    tr.querySelector(".edit-btn").onclick = () => {
        openUpdateBookModal(book, refreshCallback);
    }

    tr.querySelector(".delete-btn").onclick = () => {
        if (confirm(`Delete "${book.title}"?`)) {
            DB.deleteBook(book.id);
            window.dispatchEvent(new Event("app:books-changed"));
            refreshCallback();
        }
    };

    return tr;
};