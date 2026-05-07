import DB from "../../../db.js";
import Auth from "../../../components/scripts/auth.js";

const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const getStatusBadge = (borrowing) => {
    const status = borrowing.status;

    if (status === "pending") {
        return `<span class="px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Pending</span>`;
    }

    if (status === "declined") {
        return `<span class="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">Declined</span>`;
    }

    if (status === "returned" || borrowing.returnedAt) {
        return `<span class="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">Returned</span>`;
    }

    const overdue = borrowing.dueAt && new Date(borrowing.dueAt) < new Date();
    if (overdue) {
        return `<span class="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">Overdue</span>`;
    }

    if (status === "borrowed") {
        return `<span class="px-2 py-1 rounded-full text-xs font-semibold bg-lime-100 text-lime-700">Borrowed</span>`;
    }

    return `<span class="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">${status ?? "—"}</span>`;
};

const initBorrowingsPage = () => {
    const tbody = document.getElementById("my-borrowings-tbody");
    const summary = document.getElementById("my-borrowings-summary");
    if (!tbody || !summary) return;

    const user = Auth.getUser();
    if (!user) {
        window.location.hash = "#login";
        return;
    }

    const userBorrowings = DB.getBorrowings()
        .filter((b) => b.userId === user.id)
        .sort((a, b) => new Date(b.borrowedAt) - new Date(a.borrowedAt));

    const activeCount = userBorrowings.filter((b) => !b.returnedAt).length;
    const returnedCount = userBorrowings.length - activeCount;

    summary.textContent = `${userBorrowings.length} total · ${activeCount} active · ${returnedCount} returned`;
    tbody.innerHTML = "";

    if (userBorrowings.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="p-8 text-center text-gray-400 text-sm">
                    You have no borrow records yet.
                </td>
            </tr>
        `;
        return;
    }

    userBorrowings.forEach((borrowing) => {
        const book = DB.getBookById(borrowing.bookId);
        const isPending = borrowing.status === "pending";
        const row = document.createElement("tr");
        row.className = "border-b border-gray-100 hover:bg-gray-50 transition-colors";
        row.innerHTML = `
            <td class="p-4 font-medium text-gray-800">${book?.title ?? `Book #${borrowing.bookId}`}</td>
            <td class="p-4 text-gray-600">${book?.author ?? "—"}</td>
            <td class="p-4 text-sm text-gray-500">${isPending ? "—" : formatDate(borrowing.borrowedAt)}</td>
            <td class="p-4 text-sm text-gray-500">${isPending ? "—" : formatDate(borrowing.dueAt)}</td>
            <td class="p-4 text-sm text-gray-500">${formatDate(borrowing.returnedAt)}</td>
            <td class="p-4">${getStatusBadge(borrowing)}</td>
        `;
        tbody.appendChild(row);
    });
};

export default initBorrowingsPage;
