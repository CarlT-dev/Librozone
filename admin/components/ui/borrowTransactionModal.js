import DB from "../../../db.js";

const closeModal = () => {
    const overlay = document.getElementById("borrow-tx-modal");
    const card = document.getElementById("borrow-tx-modal-card");
    if (!overlay || !card) return;

    overlay.classList.remove("animate-fade-in");
    overlay.classList.add("animate-fade-out");
    card.classList.remove("animate-slide-up");
    card.classList.add("animate-slide-down");

    card.addEventListener("animationend", () => overlay.remove(), { once: true });
};

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

const openBorrowTransactionModal = (transactionId, onSaved) => {
    document.getElementById("borrow-tx-modal")?.remove();

    const items = DB.getBorrowingsByTransactionId(transactionId);
    if (items.length === 0) return;

    const user = DB.getUserById(items[0].userId);
    const borrowerName = user
        ? (user.name || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim())
        : `User #${items[0].userId}`;

    const txStatus = DB.getTransactionStatus(transactionId);

    const overlay = document.createElement("div");
    overlay.id = "borrow-tx-modal";
    overlay.className = [
        "fixed inset-0 z-50",
        "bg-black/50 backdrop-blur-sm",
        "flex items-center justify-center p-4",
        "animate-fade-in"
    ].join(" ");

    const bookLines = items.map((b) => {
        const book = DB.getBookById(b.bookId);
        return {
            borrowingId: b.id,
            bookId: b.bookId,
            status: b.status ?? "pending",
            cover: book?.cover ?? "https://placehold.co/56x80/d1fae5/16a34a?text=?",
            title: book?.title ?? `Book #${b.bookId}`,
            author: book?.author ?? "—",
            borrowedAt: b.borrowedAt,
            dueAt: b.dueAt,
        };
    });

    overlay.innerHTML = `
        <div
            id="borrow-tx-modal-card"
            class="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl animate-slide-up flex flex-col overflow-hidden"
            style="max-height: 90vh;"
        >
            <div class="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 shrink-0">
                <div class="flex flex-col gap-1">
                    <h2 class="text-lg font-bold text-gray-800">Borrow Transaction #${transactionId}</h2>
                    <p class="text-xs text-gray-400">Borrower: <span class="text-gray-700 font-semibold">${borrowerName}</span></p>
                </div>
                <button
                    id="borrow-tx-close"
                    class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100
                           hover:bg-red-100 hover:text-red-500 text-gray-500 transition-all"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>

            <div class="overflow-y-auto flex-1 px-4 sm:px-6 py-5 flex flex-col gap-6">
                <div class="flex items-center gap-3 flex-wrap">
                    <div class="text-sm text-gray-600">Current status:</div>
                    ${badge(txStatus)}
                </div>

                <div class="rounded-xl border border-gray-100 p-4 flex flex-col gap-3">
                    <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Set status for all books</p>
                    <div class="flex flex-wrap gap-3">
                        <label class="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
                            <input id="tx-status-pending" type="radio" name="tx-status" value="pending" ${txStatus === "pending" ? "checked" : ""}/>
                            <span class="text-sm font-semibold text-gray-700">Pending</span>
                        </label>
                        <label class="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
                            <input id="tx-status-borrowed" type="radio" name="tx-status" value="borrowed" ${(txStatus === "borrowed" || txStatus === "overdue") ? "checked" : ""}/>
                            <span class="text-sm font-semibold text-gray-700">Borrowed</span>
                        </label>
                        <label class="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
                            <input id="tx-status-returned" type="radio" name="tx-status" value="returned" ${txStatus === "returned" ? "checked" : ""}/>
                            <span class="text-sm font-semibold text-gray-700">Returned</span>
                        </label>
                        <label class="flex items-center gap-2 px-3 py-2 rounded-xl border border-red-200 cursor-pointer hover:bg-red-50">
                            <input id="tx-status-declined" type="radio" name="tx-status" value="declined" ${txStatus === "declined" ? "checked" : ""}/>
                            <span class="text-sm font-semibold text-red-600">Declined</span>
                        </label>
                    </div>
                    <p class="text-[11px] text-gray-400">
                        Tip: choose a status here to apply it to every book below, then fine-tune per book if needed.
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div class="p-4 rounded-xl border border-gray-100 bg-gray-50">
                        <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Borrowed Date</p>
                        <p class="text-sm font-semibold text-gray-800 mt-1">${txStatus === "pending" ? "—" : fmt(items[0].borrowedAt)}</p>
                    </div>
                    <div class="p-4 rounded-xl border border-gray-100 bg-gray-50">
                        <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Due Date</p>
                        <p class="text-sm font-semibold text-gray-800 mt-1">${txStatus === "pending" ? "—" : fmt(items[0].dueAt)}</p>
                    </div>
                    <div class="p-4 rounded-xl border border-gray-100 bg-gray-50">
                        <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Books</p>
                        <p class="text-sm font-semibold text-gray-800 mt-1">${items.length}</p>
                    </div>
                </div>

                <div class="rounded-xl border border-gray-100 overflow-hidden flex flex-col">
                    <div class="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider shrink-0">
                        Book Items (set status per book)
                    </div>
                    <div class="divide-y divide-gray-100 overflow-y-auto bg-white" style="max-height: 420px;">
                        ${bookLines.map((b) => {
                            const computedOverdue = (b.status === "borrowed" && b.dueAt && new Date(b.dueAt) < new Date());
                            const displayStatus = computedOverdue ? "overdue" : b.status;
                            return `
                                <div class="px-4 py-4 flex flex-col md:flex-row md:items-center gap-4">
                                    <div class="flex items-center gap-4 min-w-0 flex-1">
                                        <img
                                            src="${b.cover}"
                                            alt="${b.title}"
                                            class="w-14 h-20 object-cover rounded-lg shadow-sm border border-gray-100 shrink-0"
                                            onerror="this.src='https://placehold.co/56x80/d1fae5/16a34a?text=?'"
                                        />
                                        <div class="min-w-0">
                                            <p class="text-sm font-semibold text-gray-800 truncate">${b.title}</p>
                                            <p class="text-xs text-gray-400 truncate">${b.author}</p>
                                            <div class="mt-2 flex items-center gap-2 flex-wrap">
                                                <span class="inline-flex items-center justify-center px-2 py-1 rounded-md bg-gray-100 text-[10px] font-bold text-gray-500">
                                                    QTY: 1
                                                </span>
                                                ${badge(displayStatus)}
                                            </div>
                                        </div>
                                    </div>

                                    <div class="w-full md:w-105">
                                        <div class="grid grid-cols-2 gap-2">
                                            <label class="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
                                                <input type="radio" name="item-status-${b.borrowingId}" value="pending" ${b.status === "pending" ? "checked" : ""}/>
                                                <span class="text-sm font-semibold text-gray-700">Pending</span>
                                            </label>
                                            <label class="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
                                                <input type="radio" name="item-status-${b.borrowingId}" value="borrowed" ${b.status === "borrowed" ? "checked" : ""}/>
                                                <span class="text-sm font-semibold text-gray-700">Borrowed</span>
                                            </label>
                                            <label class="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
                                                <input type="radio" name="item-status-${b.borrowingId}" value="returned" ${b.status === "returned" ? "checked" : ""}/>
                                                <span class="text-sm font-semibold text-gray-700">Returned</span>
                                            </label>
                                            <label class="flex items-center gap-2 px-3 py-2 rounded-xl border border-red-200 cursor-pointer hover:bg-red-50">
                                                <input type="radio" name="item-status-${b.borrowingId}" value="declined" ${b.status === "declined" ? "checked" : ""}/>
                                                <span class="text-sm font-semibold text-red-600">Declined</span>
                                            </label>
                                        </div>
                                        <p class="text-[11px] text-gray-400 mt-2">
                                            Overdue is automatic when Borrowed and past due.
                                        </p>
                                    </div>
                                </div>
                            `;
                        }).join("")}
                    </div>
                </div>
            </div>

            <div class="px-4 sm:px-6 py-4 border-t border-gray-100 shrink-0 flex flex-col sm:flex-row gap-3">
                <button
                    id="borrow-tx-cancel"
                    class="w-full sm:flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 active:scale-95
                           text-gray-600 font-semibold text-sm transition-all"
                >
                    Cancel
                </button>
                <button
                    id="borrow-tx-save"
                    class="w-full sm:flex-1 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 active:scale-95
                           text-white font-bold text-sm transition-all shadow-sm"
                >
                    Save
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Close handlers
    document.getElementById("borrow-tx-close").onclick = closeModal;
    document.getElementById("borrow-tx-cancel").onclick = closeModal;
    overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });

    const onKey = (e) => {
        if (e.key === "Escape") {
            closeModal();
            document.removeEventListener("keydown", onKey);
        }
    };
    document.addEventListener("keydown", onKey);

    // Global status -> apply to all book radios
    const applyStatusToAll = (statusValue) => {
        bookLines.forEach((b) => {
            const selector = `input[name="item-status-${b.borrowingId}"][value="${statusValue}"]`;
            const radio = overlay.querySelector(selector);
            if (radio) radio.checked = true;
        });
    };

    overlay.querySelectorAll('input[name="tx-status"]').forEach((radio) => {
        radio.addEventListener("change", (e) => {
            applyStatusToAll(e.target.value);
        });
    });

    // Save handler
    document.getElementById("borrow-tx-save").onclick = () => {
        bookLines.forEach((b) => {
            const selected = overlay.querySelector(`input[name="item-status-${b.borrowingId}"]:checked`)?.value;
            if (!selected) return;
            DB.setBorrowingStatus(b.borrowingId, selected);
        });
        closeModal();
        if (onSaved) onSaved();
    };
};

export default openBorrowTransactionModal;
