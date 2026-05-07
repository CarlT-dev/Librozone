import DB from "../../../db.js";

export const createBorrowRow = (borrowing, refreshCallback) => {
    const user = DB.getUserById(borrowing.userId);
    const book = DB.getBookById(borrowing.bookId);

    const userName   = user
        ? (user.name || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim())
        : `User #${borrowing.userId}`;
    const bookTitle  = book?.title  ?? `Book #${borrowing.bookId}`;
    const bookAuthor = book?.author ?? "—";

    const fmt = (iso) => iso
        ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "—";

    const isReturned  = !!borrowing.returnedAt;
    const isOverdue   = !isReturned && new Date(borrowing.dueAt) < new Date();

    let statusBadge;
    if (isReturned) {
        statusBadge = `<span class="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">Returned</span>`;
    } else if (isOverdue) {
        statusBadge = `<span class="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">Overdue</span>`;
    } else {
        statusBadge = `<span class="px-2 py-1 rounded-full text-xs font-semibold bg-lime-100 text-lime-700">Active</span>`;
    }

    const tr = document.createElement("tr");
    tr.className = "border-b hover:bg-gray-50 transition-colors";

    tr.innerHTML = `
        <td class="p-4 text-gray-600 font-mono text- truncate">#${borrowing.id}</td>
        <td class="p-4 font-medium text-gray-800 truncate">${userName}</td>
        <td class="p-4 text-gray-800 truncate">${bookTitle}</td>
        <td class="p-4 text-gray-500 text-sm truncate">${bookAuthor}</td>
        <td class="p-4 text-gray-500 text-sm truncate">${fmt(borrowing.borrowedAt)}</td>
        <td class="p-4 text-sm truncate ${isOverdue && !isReturned ? "text-red-500 font-semibold" : "text-gray-500"}">${fmt(borrowing.dueAt)}</td>
        <td class="p-4">${statusBadge}</td>
        <td class="p-4 text-right">
            ${!isReturned ? `
            <button class="return-btn px-3 py-1 text-xs font-semibold rounded-lg
                           bg-lime-100 text-lime-700 hover:bg-lime-200 transition-colors"
            >
                Mark Returned
            </button>
            ` : `<span class="text-xs text-gray-400">${fmt(borrowing.returnedAt)}</span>`}
        </td>
    `;

    // Mark returned handler
    const returnBtn = tr.querySelector(".return-btn");
    if (returnBtn) {
        returnBtn.onclick = () => {
            if (confirm(`Mark this borrow of "${bookTitle}" as returned?`)) {
                DB.returnBook(borrowing.id);
                refreshCallback();
            }
        };
    }

    return tr;
};