// main.js

document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("login");
    const logoutBtn = document.getElementById("logout");
    const userNameSpan = document.getElementById("userName");

    // Check if user is logged in
    function checkLoginStatus() {
        const user = localStorage.getItem("currentUser");
        if (user) {
            const userData = JSON.parse(user);
            loginBtn.style.display = "none";
            logoutBtn.style.display = "block";
            userNameSpan.style.display = "inline";
            userNameSpan.textContent = `Welcome, ${userData.name}!`;
        } else {
            loginBtn.style.display = "block";
            logoutBtn.style.display = "none";
            userNameSpan.style.display = "none";
        }
    }

    // Initialize login status on page load
    checkLoginStatus();

    // Login button click - redirect to login page
    loginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = 'components/login.html';
    });

    // Logout button click
    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("currentUser");
        checkLoginStatus();
        alert("You have been logged out successfully!");
    });
});
