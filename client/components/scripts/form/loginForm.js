import DB from "../../../../db.js";
import Auth from "../../../../components/scripts/auth.js";

const initClientLogin = () => {
    const form = document.getElementById("studentLoginForm");
    const emailInput = document.getElementById("studentLoginEmail");
    const passwordInput = document.getElementById("studentLoginPassword");
    const submitBtn = document.getElementById("studentLoginBtn");
    const visibilityBtn = document.getElementById("togglePassword");

    visibilityBtn.addEventListener("click", () => {

        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        if (type === "text"){
            visibilityBtn.innerHTML = "hide";
            
        } else {
            visibilityBtn.innerHTML = "show";
        }
    })

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        Auth.login(email, password, "client");
    })
}

export default initClientLogin;