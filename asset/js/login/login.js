// login.js

document.addEventListener("DOMContentLoaded", () => {
    const nameInput = document.getElementById("name");
    const passwordInput = document.getElementById("password");
    const loginButton = document.querySelector(".login-button");

    // Helper: show error style
    function setError(input, message) {
        input.style.borderColor = "#ef4444"; // red
        input.title = message;
    }

    // Helper: clear error style
    function clearError(input) {
        input.style.borderColor = "";
        input.title = "";
    }

    // Focus styles
    [nameInput, passwordInput].forEach(input => {
        input.addEventListener("focus", () => {
            clearError(input);
            input.style.boxShadow = "0 0 0 2px rgba(59,130,246,0.2)";
        });

        input.addEventListener("blur", () => {
            input.style.boxShadow = "none";
        });
    });

    // Login button click
    loginButton.addEventListener("click", (e) => {
        e.preventDefault();

        const name = nameInput.value.trim();
        const password = passwordInput.value.trim();

        let hasError = false;

        if (name === "") {
            setError(nameInput, "Name is required");
            hasError = true;
        }

        if (password === "") {
            setError(passwordInput, "Password is required");
            hasError = true;
        }

        if (hasError) return;

        // Button loading effect
        loginButton.disabled = true;
        const originalText = loginButton.textContent;
        loginButton.textContent = "Logging in...";

        // Fake login (simulate API call)
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 800);
    });
});
