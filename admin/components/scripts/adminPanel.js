    import DB from "../../../db.js";
import { createBookInventoryRow } from "../ui/bookInventoryRow.js";
import Auth from "../../../components/scripts/auth.js"
import openNewBookModal from "../ui/newBookModal.js";
import openBorrowTransactionModal from "../ui/borrowTransactionModal.js";

const renderInventorySection = () => {
    const section = document.getElementById("admin-content-section");
    if (!section) return;

    section.innerHTML = `
        <div class="overflow-hidden min-h-0 flex flex-col">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6 shrink-0">
            <div>
                <h2 class="text-xl sm:text-2xl font-bold text-gray-800">Library Inventory</h2>
                <p class="text-sm text-gray-400 mt-0.5">Manage all books in the library</p>
            </div>
            <button id="add-book-btn" class="bg-lime-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-lime-600 active:scale-95 transition-all text-sm">
                + Upload New Book
            </button>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1 min-h-0">
            <div class="h-full overflow-y-auto">
                <table class="w-full text-left border-collapse">
                    <thead class="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                        <tr>
                            <th class="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                            <th class="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                            <th class="hidden sm:table-cell p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Author</th>
                            <th class="hidden lg:table-cell p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Genre</th>
                            <th class="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                            <th class="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="inventory-table-body"></tbody>
                </table>
            </div>
        </div>
        </div>
    `;

    document.getElementById("add-book-btn").onclick = () => {
        openNewBookModal(renderInventorySection);
    };

    const tbody = document.getElementById("inventory-table-body");
    const books = DB.getAllBooks();

    books.forEach(book => {
        const row = createBookInventoryRow(book, renderInventorySection);
        tbody.appendChild(row);
    });
};

const renderBorrowsSection = () => {
    const section = document.getElementById("admin-content-section");
    if (!section) return;

    section.innerHTML = `
        <div class="h-full flex flex-col">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4 sm:mb-6 shrink-0">
            <div>
                <h2 class="text-xl sm:text-2xl font-bold text-gray-800">Borrow Records</h2>
                <p class="text-sm text-gray-400 mt-0.5">One record per borrow transaction</p>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1 min-h-0">
            <div class="h-full overflow-y-auto">
                <table class="w-full text-left border-collapse">
                <thead class="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                    <tr>
                        <th class="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                        <th class="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Borrower</th>
                        <th class="hidden sm:table-cell p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Borrowed Date</th>
                        <th class="hidden sm:table-cell p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Due Date</th>
                        <th class="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                </thead>
                <tbody id="borrows-table-body"></tbody>
            </table>
            </div>
        </div>
        </div>
    `;

    const tbody = document.getElementById("borrows-table-body");
    const borrowings = DB.getBorrowings();

    if (borrowings.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="p-8 text-center text-gray-400 text-sm">No borrow records yet.</td>
            </tr>
        `;
        return;
    }

    const fmt = (iso) => iso
        ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "—";

    const badge = (status) => {
        if (status === "pending")  return `<span class="px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Pending</span>`;
        if (status === "borrowed") return `<span class="px-2 py-1 rounded-full text-xs font-semibold bg-lime-100 text-lime-700">Borrowed</span>`;
        if (status === "returned") return `<span class="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">Returned</span>`;
        if (status === "overdue")  return `<span class="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">Overdue</span>`;
        if (status === "declined") return `<span class="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">Declined</span>`;
        return `<span class="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">${status}</span>`;
    };

    // Group by transactionId (one row per transaction)
    const txMap = new Map();
    borrowings.forEach((b) => {
        const txId = String(b.transactionId ?? b.id);
        if (!txMap.has(txId)) txMap.set(txId, []);
        txMap.get(txId).push(b);
    });

    const txRows = Array.from(txMap.entries()).map(([txId, items]) => {
        // Most recent: use max id
        const maxId = Math.max(...items.map(i => i.id));
        return { txId, items, maxId };
    }).sort((a, b) => b.maxId - a.maxId);

    txRows.forEach(({ txId, items }) => {
        const user = DB.getUserById(items[0].userId);
        const borrowerName = user
            ? (user.name || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim())
            : `User #${items[0].userId}`;

        const status = DB.getTransactionStatus(txId);

        // For display: "-" when pending
        const borrowedAt = status === "pending" ? null : items[0].borrowedAt;
        const dueAt = status === "pending" ? null : items[0].dueAt;

        const tr = document.createElement("tr");
        tr.className = "border-b hover:bg-gray-50 transition-colors cursor-pointer";
        tr.innerHTML = `
            <td class="p-4 text-gray-600 font-mono text-sm">#${txId}</td>
            <td class="p-4 font-medium text-gray-800 truncate">${borrowerName}</td>
            <td class="hidden sm:table-cell p-4 text-sm text-gray-500">${fmt(borrowedAt)}</td>
            <td class="hidden sm:table-cell p-4 text-sm text-gray-500">${fmt(dueAt)}</td>
            <td class="p-4">${badge(status)}</td>
        `;

        tr.addEventListener("click", () => {
            openBorrowTransactionModal(txId, renderBorrowsSection);
        });

        tbody.appendChild(tr);
    });
};

// for styling active navigation
const setActiveNav = (activeId) => {
    const navItems = document.querySelectorAll(".admin-nav-item");
    navItems.forEach(item => {
        const isActive = item.dataset.nav === activeId;
        item.classList.toggle("bg-lime-500",   isActive);
        item.classList.toggle("text-white",    isActive);
        item.classList.toggle("shadow-md",     isActive);
        item.classList.toggle("text-gray-600", !isActive);
        item.classList.toggle("hover:bg-lime-50", !isActive);
    });
};

const initAdminPanel = () => {
    const navInventory = document.getElementById("nav-inventory");
    const navBorrows   = document.getElementById("nav-borrows");
    const logout = document.getElementById("logout-admin");

    if (!navInventory || !navBorrows || !logout) return;

    logout.addEventListener("click", () => {
        Auth.logout();
    })


    navInventory.addEventListener("click", () => {
        setActiveNav("inventory");
        renderInventorySection();
    });

    navBorrows.addEventListener("click", () => {
        setActiveNav("borrows");
        renderBorrowsSection();
    });

    // Default: open Inventory
    setActiveNav("inventory");
    renderInventorySection();
};

export default initAdminPanel;