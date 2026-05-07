import { 
    renderTrendingCarousel, 
    renderFantasyCarousel,
    renderFictionCarousel,
    renderHorrorCarousel,
    renderRomanceCarousel
} from "./renderers.js";
import Auth from "./auth.js";
import initAdminLogin from "../../admin/components/scripts/form/loginForm.js";
import initClientLogin from "../../client/components/scripts/form/loginForm.js";
import initClientRegister from "../../client/components/scripts/form/registerForm.js";
import initRegisterDetails from "../../client/components/scripts/form/registerDetailsForm.js";
import initSearchPage from "../../client/components/scripts/searchPage.js";
import initBorrowingsPage from "../../client/components/scripts/borrowingsPage.js";
import updateNavbarUI from "../ui/updateNav.js";
import initAdminPanel from "../../admin/components/scripts/adminPanel.js"; 
import { BASE } from "./basePath.js";

const routes = {
    "#home": {
        template: `${BASE}client/components/templates/homepage.html`,
        render: () => {
            renderTrendingCarousel();
            renderFantasyCarousel();
            renderFictionCarousel();
            renderHorrorCarousel();
            renderRomanceCarousel();
        }
    },
    "#login": {
        template: `${BASE}client/components/templates/login.html`,
        render: initClientLogin
    },
    "#register": {
        template: `${BASE}client/components/templates/register.html`,
        render: initClientRegister
    },
    "#new": {
        template: `${BASE}client/components/templates/register-details.html`,
        render: initRegisterDetails
    },
    "#search": {
        template: `${BASE}client/components/templates/search.html`,
        render: initSearchPage
    },
    "#borrowings": {
        template: `${BASE}client/components/templates/borrowings.html`,
        requiresAuth: true,
        role: "client",
        render: initBorrowingsPage
    },
    "#account/borrowings": {
        template: `${BASE}client/components/templates/borrowings.html`,
        requiresAuth: true,
        role: "client",
        render: initBorrowingsPage
    },
    "#secret": {
        template: `${BASE}admin/secret/admin-auth.html`,
        render: initAdminLogin
    },
    "#admin-panel": {
        template: `${BASE}admin/secret/admin-panel.html`,
        requiresAuth: true,
        role: "admin",
        render: initAdminPanel 
    },
    "404": {
        template: `${BASE}components/templates/page-not-found.html`
    }
};

window.addEventListener("app:books-changed", () => {
    if (window.location.hash === '#home') {
        routes['#home'].render();
    }
});

export const router = async () => {

    if (window.location.hash === "" || window.location.hash === "/") {
        window.location.hash = "#home";
        return;
    }

    const app = document.getElementById("app-container");
    const rawHash = window.location.hash || "#home";
    const hash = rawHash.startsWith("#search?") ? "#search" : rawHash;

    updateNavbarUI();

    const route = routes[hash] || routes["404"];

    // Auth guard 
    if (route.requiresAuth) {
        if (!Auth.isLoggedIn()) {
            window.location.hash = "#home";
            return;
        }
        if (route.role === "admin" && !Auth.isAdmin()) {
            window.location.hash = "#home";
            return;
        }
    }

    try {
        const response = await fetch(route.template);
        if (!response.ok) throw new Error(`Status: ${response.status}`);

        const html = await response.text();
        app.innerHTML = html;

        if (route.render) {
            route.render();
        }
    } catch (err) {
        console.error("Router error:", err);
        const errorRes = await fetch(routes["404"].template);
        app.innerHTML = await errorRes.text();
    }
};