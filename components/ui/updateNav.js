import Auth from "../scripts/auth.js";
import initCartDropdown from "../../client/components/ui/cartDropdown.js";
import initMenuToggle from "./menuToggle.js";

let cartInitialized = false;

const updateNavbarUI = () => {
    const authBtn    = document.getElementById("authBtn");
    const search     = document.getElementById("search");
    const accountNav = document.getElementById("account-nav");

    const hash = window.location.hash;

    if (hash === "#admin-panel" || hash === "#secret") {
        if (authBtn)    authBtn.style.display    = "none";
        if (accountNav) accountNav.style.display = "none";
        if (search)     search.style.display     = "none";
        cartInitialized = false; // reset so it re-inits if user comes back
        return;
    }

    if (hash === "#login" || hash === "#register" || hash === "#new") {
        if (authBtn) authBtn.style.display = "flex";
        if (accountNav) accountNav.style.display = "none";
        if (search)     search.style.display     = "none";
        cartInitialized = false; // reset so it re-inits if user comes back
        return;
    }

    if (Auth.isLoggedIn()) {
        if (authBtn)    authBtn.style.display    = "none";
        if (accountNav) accountNav.style.display = "flex";
        if (search)     search.style.display     = "flex";

        initMenuToggle();

        // Init cart dropdown once per session (DOM elements are persistent in header)
        if (!cartInitialized) {
            initCartDropdown();
            cartInitialized = true;
        }
    } else {
        if (authBtn)    authBtn.style.display    = "flex";
        if (accountNav) accountNav.style.display = "none";
        if (search)     search.style.display     = "flex";
        cartInitialized = false;
    }
};

export default updateNavbarUI;