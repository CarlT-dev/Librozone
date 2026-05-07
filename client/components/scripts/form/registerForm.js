const initClientRegister = () => {
    const form = document.getElementById("registerEmailForm");
    const emailInput = document.getElementById("studentRegisterEmail");
    const nextBtn = document.getElementById("nextNavigation");
    const emailError = document.getElementById("emailError");
    const progressBarContainer = document.getElementById("register-progress-bar-container");
    const progressBar = document.getElementById("register-progress-bar");

    const isValidEmail = (val) => /\S+@\S+\.\S+/.test(val);

    nextBtn.addEventListener("click", () => {
        const email = emailInput.value.trim();

        // Validate
        if (!isValidEmail(email)) {
            emailError.style.display = "block";
            emailInput.focus();
            return;
        }

        emailError.style.display = "none";
        nextBtn.disabled = true;
        nextBtn.textContent = "Loading...";

        // Store email for the next step
        sessionStorage.setItem("pendingRegisterEmail", email);

        // Show + animate progress bar
        progressBarContainer.style.display = "block";
        // Small delay to let display:block render before transitioning
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                progressBar.style.width = "100%";
            });
        });

        // Navigate after animation (700ms matches the CSS transition)
        setTimeout(() => {
            window.location.hash = "#new";
        }, 750);
    });

    // Allow enter key on email input to trigger Next
    emailInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            nextBtn.click();
        }
    });

    emailInput.addEventListener("input", () => {
        if (emailError.style.display === "block") {
            emailError.style.display = "none";
        }
    });
};

export default initClientRegister;