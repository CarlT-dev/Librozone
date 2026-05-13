import DB from "../../../db.js";

// Helpers
const closeModal = () => {
    const overlay = document.getElementById("borrow-tx-modal");
    const card    = document.getElementById("borrow-tx-modal-card");
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
    const map = {
        pending:  "bg-amber-100 text-amber-700",
        borrowed: "bg-lime-100 text-lime-700",
        returned: "bg-gray-100 text-gray-600",
        overdue:  "bg-red-100 text-red-600",
        declined: "bg-red-100 text-red-700",
    };
    const cls = map[status] ?? "bg-gray-100 text-gray-600";
    const label = status.charAt(0).toUpperCase() + status.slice(1);
    return `<span class="px-2 py-1 rounded-full text-xs font-semibold ${cls}">${label}</span>`;
};

/**
 * Derives the effective display status for a single borrowing row.
 * Borrowed items past their due date show as "overdue".
 */
const effectiveStatus = (b) => {
    if (b.status === "borrowed" && b.dueAt && new Date(b.dueAt) < new Date()) return "overdue";
    return b.status ?? "pending";
};

// Modal
const openBorrowTransactionModal = (transactionId, onSaved) => {
    document.getElementById("borrow-tx-modal")?.remove();

    const items = DB.getBorrowingsByTransactionId(transactionId);
    if (items.length === 0) return;

    const user         = DB.getUserById(items[0].userId);
    const borrowerName = user
        ? (user.name || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim())
        : `User #${items[0].userId}`;

    const txStatus = DB.getTransactionStatus(transactionId);

    // Build book-line data
    const bookLines = items.map((b) => {
        const book = DB.getBookById(b.bookId);
        return {
            borrowingId : b.id,
            bookId      : b.bookId,
            status      : b.status ?? "pending",
            cover       : book?.cover  ?? "https://placehold.co/56x80/d1fae5/16a34a?text=?",
            title       : book?.title  ?? `Book #${b.bookId}`,
            author      : book?.author ?? "—",
            borrowedAt  : b.borrowedAt,
            dueAt       : b.dueAt,
            returnedAt  : b.returnedAt,
        };
    });

    // Separate into "actionable" (pending, borrowed, overdue) and "settled" (returned, declined)
    const actionable = bookLines.filter(b => !["returned", "declined"].includes(b.status));
    const settled = bookLines.filter(b =>  ["returned", "declined"].includes(b.status));

    // Overlay shell
    const overlay = document.createElement("div");
    overlay.id        = "borrow-tx-modal";
    overlay.className = [
        "fixed inset-0 z-50",
        "bg-black/50 backdrop-blur-sm",
        "flex items-center justify-center p-4",
        "animate-fade-in",
    ].join(" ");

    // Book row HTML builder

    /*
      Renders a single actionable book row.
     
      The checkbox drives the primary approval action.
      The override <select> lets the admin fine-tune after checking.
     
      Checkbox state:
        pending  → unchecked by default (admin must check to approve)
        borrowed / overdue → checked and locked (already approved)
     */
    const actionableRow = (b) => {
        const eff = effectiveStatus(b);
        const isActive = eff === "borrowed" || eff === "overdue"; // already approved
        const isPending = b.status === "pending";

        // Override options depend on current status
        const overrideOptions = [
            { value: "pending",  label: "Pending",  cls: "text-amber-700"  },
            { value: "borrowed", label: "Borrowed", cls: "text-lime-700"   },
            { value: "returned", label: "Returned", cls: "text-gray-600"   },
            { value: "declined", label: "Declined", cls: "text-red-700"    },
        ].map(o => `<option value="${o.value}" ${b.status === o.value ? "selected" : ""}>${o.label}</option>`).join("");

        return `
        <div
            class="book-row flex gap-4 items-start p-4 rounded-xl border transition-all
                   ${isActive
                       ? "border-lime-200 bg-lime-50/60"
                       : isPending
                           ? "border-amber-100 bg-amber-50/40"
                           : "border-gray-100 bg-gray-50"}"
            data-borrowing-id="${b.borrowingId}"
        >
            <!-- Approval checkbox -->
            <div class="flex flex-col items-center gap-1 pt-1 shrink-0">
                <input
                    type="checkbox"
                    id="approve-cb-${b.borrowingId}"
                    data-borrowing-id="${b.borrowingId}"
                    class="approval-checkbox w-5 h-5 rounded accent-lime-500 cursor-pointer"
                    ${isActive  ? "checked disabled" : ""}
                    ${isPending ? "" : ""}
                    title="${isActive ? "Already approved" : "Check to approve this book"}"
                />
                <span class="text-[9px] font-bold uppercase tracking-wide
                             ${isActive ? "text-lime-500" : "text-gray-400"}">
                    ${isActive ? "OK" : "Approve"}
                </span>
            </div>

            <!-- Book cover -->
            <img
                src="${b.cover}"
                alt="${b.title}"
                class="w-12 h-16 object-cover rounded-lg shadow-sm border border-gray-100 shrink-0"
                onerror="this.src='https://placehold.co/48x64/d1fae5/16a34a?text=?'"
            />

            <!-- Book info -->
            <div class="flex-1 min-w-0 flex flex-col gap-1">
                <p class="text-sm font-bold text-gray-800 truncate">${b.title}</p>
                <p class="text-xs text-gray-400 truncate">${b.author}</p>

                <!-- Current status badge + dates -->
                <div class="flex flex-wrap items-center gap-2 mt-1">
                    ${badge(eff)}
                    ${b.borrowedAt
                        ? `<span class="text-[11px] text-gray-400">Borrowed: ${fmt(b.borrowedAt)}</span>`
                        : `<span class="text-[11px] text-gray-400 italic">Not yet borrowed</span>`}
                    ${b.dueAt && b.status !== "pending"
                        ? `<span class="text-[11px] ${eff === "overdue" ? "text-red-500 font-semibold" : "text-gray-400"}">Due: ${fmt(b.dueAt)}</span>`
                        : ""}
                </div>

                <!-- Override dropdown (fine-grained control) -->
                <div class="mt-2 flex items-center gap-2">
                    <label for="override-${b.borrowingId}" class="text-[11px] font-semibold text-gray-400 uppercase tracking-wide shrink-0">
                        Override:
                    </label>
                    <select
                        id="override-${b.borrowingId}"
                        data-borrowing-id="${b.borrowingId}"
                        class="override-select text-xs border border-gray-200 rounded-lg px-2 py-1
                               bg-white focus:outline-none focus:ring-2 focus:ring-lime-400
                               cursor-pointer"
                    >
                        ${overrideOptions}
                    </select>
                    <span class="text-[10px] text-gray-300 italic">optional fine-tune</span>
                </div>
            </div>
        </div>`;
    };

    /**
     * Renders a settled (returned / declined) book row — read-only.
     */
    const settledRow = (b) => {
        const eff = effectiveStatus(b);
        return `
        <div class="flex gap-4 items-center p-4 rounded-xl border border-gray-100 bg-gray-50 opacity-70">
            <img
                src="${b.cover}"
                alt="${b.title}"
                class="w-10 h-14 object-cover rounded-lg shadow-sm border border-gray-100 shrink-0"
                onerror="this.src='https://placehold.co/40x56/d1fae5/16a34a?text=?'"
            />
            <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-700 truncate">${b.title}</p>
                <p class="text-xs text-gray-400 truncate">${b.author}</p>
                <div class="flex items-center gap-2 mt-1 flex-wrap">
                    ${badge(eff)}
                    ${b.returnedAt
                        ? `<span class="text-[11px] text-gray-400">Returned: ${fmt(b.returnedAt)}</span>`
                        : ""}
                    ${b.status === "declined"
                        ? `<span class="text-[11px] text-red-400 italic">Stock restored</span>`
                        : ""}
                </div>
            </div>
            <span class="text-[10px] text-gray-400 italic shrink-0">read-only</span>
        </div>`;
    };

    // Summary counts for header
    const pendingCount  = bookLines.filter(b => b.status === "pending").length;
    const approvedCount = bookLines.filter(b => b.status === "borrowed").length;

    // Modal HTML 
    overlay.innerHTML = `
        <div
            id="borrow-tx-modal-card"
            class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-slide-up flex flex-col overflow-hidden"
            style="max-height: 92vh;"
        >
            <!-- Header -->
            <div class="flex items-start justify-between px-6 py-4 border-b border-gray-100 shrink-0">
                <div class="flex flex-col gap-0.5">
                    <h2 class="text-lg font-bold text-gray-800">Transaction #${transactionId}</h2>
                    <p class="text-xs text-gray-400">
                        Borrower: <span class="text-gray-700 font-semibold">${borrowerName}</span>
                    </p>
                    <div class="flex items-center gap-2 mt-1 flex-wrap">
                        ${badge(txStatus)}
                        <span class="text-xs text-gray-400">${bookLines.length} book${bookLines.length !== 1 ? "s" : ""}</span>
                        ${pendingCount  > 0 ? `<span class="text-xs text-amber-600 font-medium">${pendingCount} pending</span>`  : ""}
                        ${approvedCount > 0 ? `<span class="text-xs text-lime-600 font-medium">${approvedCount} borrowed</span>` : ""}
                    </div>
                </div>
                <button
                    id="borrow-tx-close"
                    class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100
                           hover:bg-red-100 hover:text-red-500 text-gray-500 transition-all shrink-0 mt-1"
                    aria-label="Close"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>

            <!-- Legend / instruction banner -->
            ${pendingCount > 0 ? `
            <div class="px-6 py-3 bg-amber-50 border-b border-amber-100 flex items-start gap-3 shrink-0">
                <svg class="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p class="text-xs text-amber-700 leading-relaxed">
                    <strong>Approval mode:</strong> Check ☑ the books the client actually wants to borrow,
                    then hit <strong>Save</strong>. Checked books will be marked <em>Borrowed</em> and dates will be set automatically.
                    Unchecked pending books remain <em>Pending</em>. Use the <em>Override</em> dropdown to decline or return individual books.
                </p>
            </div>` : ""}

            <!-- Scrollable body -->
            <div class="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-4">

                <!-- Actionable books -->
                ${actionable.length > 0 ? `
                <div class="flex flex-col gap-3">
                    <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Books to process (${actionable.length})
                    </p>
                    ${actionable.map(actionableRow).join("")}
                </div>` : ""}

                <!-- Settled books (read-only) -->
                ${settled.length > 0 ? `
                <div class="flex flex-col gap-3 ${actionable.length > 0 ? "pt-2 border-t border-gray-100" : ""}">
                    <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Settled books (${settled.length})
                    </p>
                    ${settled.map(settledRow).join("")}
                </div>` : ""}

            </div>

            <!-- Footer -->
            <div class="px-6 py-4 border-t border-gray-100 shrink-0 flex flex-col sm:flex-row gap-3">
                <button
                    id="borrow-tx-cancel"
                    class="w-full sm:flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 active:scale-95
                           text-gray-600 font-semibold text-sm transition-all cursor-pointer"
                >
                    Cancel
                </button>
                <button
                    id="borrow-tx-save"
                    class="w-full sm:flex-1 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 active:scale-95
                           text-white font-bold text-sm transition-all shadow-sm cursor-pointer"
                >
                    Save Changes
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Event: close
    document.getElementById("borrow-tx-close").onclick  = closeModal;
    document.getElementById("borrow-tx-cancel").onclick = closeModal;
    overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });

    const onKey = (e) => {
        if (e.key === "Escape") {
            closeModal();
            document.removeEventListener("keydown", onKey);
        }
    };
    document.addEventListener("keydown", onKey);

    // Event: checkbox → sync override dropdown
    // When the admin checks a pending book, auto-set the override to "borrowed".
    // When unchecked, revert override to "pending".
    overlay.querySelectorAll(".approval-checkbox").forEach((cb) => {
        cb.addEventListener("change", () => {
            const id       = cb.dataset.borrowingId;
            const select   = overlay.querySelector(`#override-${id}`);
            const row      = overlay.querySelector(`[data-borrowing-id="${id}"].book-row`);
            if (!select) return;

            if (cb.checked) {
                select.value = "borrowed";
                row?.classList.remove("border-amber-100", "bg-amber-50/40");
                row?.classList.add("border-lime-200", "bg-lime-50/60");
            } else {
                // Only revert to pending if the original status was pending
                const original = actionable.find(b => String(b.borrowingId) === String(id));
                if (original?.status === "pending") {
                    select.value = "pending";
                    row?.classList.remove("border-lime-200", "bg-lime-50/60");
                    row?.classList.add("border-amber-100", "bg-amber-50/40");
                }
            }
        });
    });

    // Event: override dropdown → sync checkbox
    overlay.querySelectorAll(".override-select").forEach((select) => {
        select.addEventListener("change", () => {
            const id = select.dataset.borrowingId;
            const cb = overlay.querySelector(`#approve-cb-${id}`);
            const row = overlay.querySelector(`[data-borrowing-id="${id}"].book-row`);
            if (!cb || cb.disabled) return; // locked rows stay locked

            if (select.value === "borrowed") {
                cb.checked = true;
                row?.classList.remove("border-amber-100", "bg-amber-50/40");
                row?.classList.add("border-lime-200", "bg-lime-50/60");
            } else {
                cb.checked = false;
                row?.classList.remove("border-lime-200", "bg-lime-50/60");
                if (select.value === "pending") {
                    row?.classList.add("border-amber-100", "bg-amber-50/40");
                } else {
                    row?.classList.add("border-gray-100", "bg-gray-50");
                }
            }
        });
    });

    // Event: save 
    /**
     * Save logic per actionable book:
     *
     *   1. Read the override <select> value — this is the source of truth.
     *   2. If override is "borrowed" AND item was previously pending,
     *      call setBorrowingStatus("borrowed") which sets borrowedAt + dueAt.
     *   3. Any other status change goes through setBorrowingStatus normally.
     *   4. Settled rows are skipped.
     */
    document.getElementById("borrow-tx-save").onclick = () => {
        actionable.forEach((b) => {
            const select   = overlay.querySelector(`#override-${b.borrowingId}`);
            const nextStatus = select?.value ?? b.status;

            // No change → skip
            if (nextStatus === b.status) return;

            DB.setBorrowingStatus(b.borrowingId, nextStatus);
        });

        closeModal();
        if (onSaved) onSaved();
    };
};

export default openBorrowTransactionModal;