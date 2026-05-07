import Auth from "../scripts/auth.js";

const initMenuToggle = () => {
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    if (!hamburgerBtn) return;

    // Inject sidebar + overlay into the DOM (only once) 
    if (!document.getElementById("sidebar-overlay")) {
        const overlay = document.createElement("div");
        overlay.id = "sidebar-overlay";
        overlay.style.cssText = `
            position: fixed; inset: 0; z-index: 40;
            background: rgba(0,0,0,0.45);
            opacity: 0; pointer-events: none;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(overlay);
    }

    if (!document.getElementById("app-sidebar")) {
        const user = Auth.getUser();
        const displayName = user?.name || `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "User";
        const displayEmail = user?.email || "";
        const initials = displayName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

        const sidebar = document.createElement("aside");
        sidebar.id = "app-sidebar";
        sidebar.style.cssText = `
            position: fixed; top: 0; right: 0; height: 100vh;
            width: 280px; z-index: 50;
            background: #fff;
            box-shadow: -4px 0 24px rgba(0,0,0,0.12);
            transform: translateX(100%);
            transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex; flex-direction: column;
        `;

        sidebar.innerHTML = `
            <!-- Header strip -->
            <div style="background: #84cc16; padding: 20px 20px 16px; position: relative;">
                <button id="sidebar-close-btn" style="
                    position: absolute; top: 12px; right: 12px;
                    background: rgba(255,255,255,0.25); border: none; border-radius: 8px;
                    width: 30px; height: 30px; cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    color: white; font-size: 18px; font-weight: bold;
                    transition: background 0.2s;
                " onmouseover="this.style.background='rgba(255,255,255,0.4)'"
                   onmouseout="this.style.background='rgba(255,255,255,0.25)'">
                    ✕
                </button>

                <!-- Avatar + name -->
                <div style="display: flex; align-items: center; gap: 12px; margin-top: 8px;">
                    <div style="
                        width: 48px; height: 48px; border-radius: 50%;
                        background: rgba(255,255,255,0.3);
                        border: 2px solid rgba(255,255,255,0.7);
                        display: flex; align-items: center; justify-content: center;
                        font-size: 18px; font-weight: 700; color: white;
                        flex-shrink: 0;
                    ">${initials}</div>
                    <div>
                        <p style="margin:0; font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.75); letter-spacing: 0.08em; text-transform: uppercase;">Account</p>
                        <p style="margin:0; font-size: 15px; font-weight: 700; color: white;">${displayName}</p>
                        <p style="margin:0; font-size: 12px; color: rgba(255,255,255,0.8); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px;">${displayEmail}</p>
                    </div>
                </div>
            </div>

            <!-- Nav items -->
            <nav style="flex: 1; padding: 12px 0; overflow-y: auto;">
                <a href="#home" id="sidebar-home-link" style="
                    display: flex; align-items: center; gap: 12px;
                    padding: 13px 20px; text-decoration: none; color: #374151;
                    font-size: 14px; font-weight: 600;
                    transition: background 0.15s;
                " onmouseover="this.style.background='#f0fdf4'"
                   onmouseout="this.style.background='transparent'">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#84cc16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                    Home
                </a>
                <a href="#borrowings" id="sidebar-borrows-link" style="
                    display: flex; align-items: center; gap: 12px;
                    padding: 13px 20px; text-decoration: none; color: #374151;
                    font-size: 14px; font-weight: 600;
                    transition: background 0.15s;
                " onmouseover="this.style.background='#f0fdf4'"
                   onmouseout="this.style.background='transparent'">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#84cc16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                    My Borrows
                </a>

                <!-- Divider -->
                <div style="margin: 8px 20px; border-top: 1px solid #e5e7eb;"></div>

                <!-- Logout -->
                <button id="sidebar-logout-btn" style="
                    display: flex; align-items: center; gap: 12px;
                    padding: 13px 20px; width: 100%; border: none; background: transparent;
                    color: #ef4444; font-size: 14px; font-weight: 600;
                    cursor: pointer; text-align: left;
                    transition: background 0.15s;
                " onmouseover="this.style.background='#fef2f2'"
                   onmouseout="this.style.background='transparent'">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Log Out
                </button>
            </nav>
        `;

        document.body.appendChild(sidebar);
    }

    const overlay = document.getElementById("sidebar-overlay");
    const sidebar = document.getElementById("app-sidebar");

    // Open / Close helpers 
    const openSidebar = () => {
        sidebar.style.transform = "translateX(0)";
        overlay.style.opacity = "1";
        overlay.style.pointerEvents = "auto";
        document.body.style.overflow = "hidden";
    };

    const closeSidebar = () => {
        sidebar.style.transform = "translateX(100%)";
        overlay.style.opacity = "0";
        overlay.style.pointerEvents = "none";
        document.body.style.overflow = "";
    };

    // Event listeners 
    hamburgerBtn.addEventListener("click", openSidebar);

    overlay.addEventListener("click", closeSidebar);

    document.getElementById("sidebar-close-btn").addEventListener("click", closeSidebar);

    // Close on any nav link click inside sidebar
    ["sidebar-home-link", "sidebar-profile-link", "sidebar-borrows-link"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("click", closeSidebar);
    });

    // Logout
    document.getElementById("sidebar-logout-btn").addEventListener("click", () => {
        closeSidebar();
        setTimeout(() => {
            Auth.logout();
            window.location.hash = "#login";
        }, 300); // wait for slide-out animation
    });

    // Close sidebar on route change
    window.addEventListener("hashchange", closeSidebar);
};

export default initMenuToggle;