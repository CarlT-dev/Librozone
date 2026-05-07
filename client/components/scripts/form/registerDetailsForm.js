import DB from "../../../../db.js";
import Auth from "../../../../components/scripts/auth.js";

const initRegisterDetails = () => {
    const form = document.getElementById("registerDetailsForm");
    const emailInput = document.getElementById("detailEmail");
    const firstNameInput = document.getElementById("detailFirstName");
    const lastNameInput = document.getElementById("detailLastName");
    const mobileInput = document.getElementById("detailMobile");
    const passwordInput = document.getElementById("detailPassword");
    const confirmPasswordInput = document.getElementById("detailConfirmPassword");
    const passwordMatchError = document.getElementById("passwordMatchError");

    // Autofill email from step 1
    const pendingEmail = sessionStorage.getItem("pendingRegisterEmail");
    if (pendingEmail) {
        emailInput.value = pendingEmail;
    }

    // Live confirm password check
    confirmPasswordInput.addEventListener("input", () => {
        if (confirmPasswordInput.value && passwordInput.value !== confirmPasswordInput.value) {
            passwordMatchError.style.display = "block";
        } else {
            passwordMatchError.style.display = "none";
        }
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const mobile = mobileInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Check passwords match
        if (password !== confirmPassword) {
            passwordMatchError.style.display = "block";
            confirmPasswordInput.focus();
            return;
        }

        passwordMatchError.style.display = "none";

        // Check if email already exists
        const existingUsers = DB.getUsers();
        const emailTaken = existingUsers.some(u => u.email === email);
        if (emailTaken) {
            alert("An account with this email already exists.");
            emailInput.focus();
            return;
        }

        // Build new user object — role is always 'client'
        const newUser = {
            firstName,
            lastName,
            email,
            password,
            mobile_number: mobile,
            role: "client"
        };

        console.log("New User: ", newUser)
        DB.addUser(newUser);

        // Clear the pending email from session
        sessionStorage.removeItem("pendingRegisterEmail");

        // Auto-login the new user and redirect
        Auth.login(email, password);
    });
};

export default initRegisterDetails;