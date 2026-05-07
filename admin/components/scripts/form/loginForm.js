import DB from "../../../../db.js";
import adminSchema from "./loginSchema.js";
import Auth from "../../../../components/scripts/auth.js";

const initAdminLogin = () => {

    const form = document.getElementById("adminLoginForm");
    const emailInput = document.getElementById("adminLoginEmail");
    const passwordInput = document.getElementById("adminLoginPassword");
    // const submitBtn = document.getElementById("adminLoginBtn");
    
    function validateForm() {
      const isEmailValid = adminSchema.email(emailInput.value);
      const isPasswordValid = adminSchema.password(passwordInput.value);
      // submitBtn.disabled = !(isEmailValid && isPasswordValid);
    }
    
    emailInput.addEventListener("input", validateForm);
    passwordInput.addEventListener("input", validateForm);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
    
      const email = emailInput.value;
      const password = passwordInput.value;
    
      Auth.login(email, password, "admin");

    });
};

export default initAdminLogin;
