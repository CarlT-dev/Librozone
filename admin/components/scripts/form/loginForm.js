import DB from "../../../../db.js";
import Auth from "../../../../components/scripts/auth.js";

const initAdminLogin = () => {

    const form = document.getElementById("adminLoginForm");
    const emailInput = document.getElementById("adminLoginEmail");
    const passwordInput = document.getElementById("adminLoginPassword");
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
    
      const email = emailInput.value;
      const password = passwordInput.value;
    
      Auth.login(email, password, "admin");

    });
};

export default initAdminLogin;
