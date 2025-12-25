// Login form handler

document.addEventListener('DOMContentLoaded', function() {
    const nameInput = document.getElementById('name');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('login-button');
    const loginForm = document.querySelector('.login-form');

    // Get or create error message containers
    let errorContainer = document.getElementById('errorContainer');
    if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.id = 'errorContainer';
        errorContainer.style.color = 'red';
        errorContainer.style.marginBottom = '10px';
        loginForm.insertBefore(errorContainer, loginButton);
    }

    // Form submission
    loginButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Clear previous errors
        errorContainer.textContent = '';
        
        // Validate inputs
        const nameValid = validateName();
        const passwordValid = validatePassword();

        if (!nameValid || !passwordValid) {
            return;
        }

        try {
            // Show loading state
            loginButton.disabled = true;
            loginButton.textContent = 'Signing in...';

            // Simulate API call
            setTimeout(() => {
                // Get form data
                const name = nameInput.value.trim();
                const password = passwordInput.value.trim();

                // Save user data to localStorage
                localStorage.setItem('weatherAppUser', JSON.stringify({
                    name: name,
                    loginTime: new Date().toISOString()
                }));

                // Show success message
                loginButton.textContent = 'Success!';
                errorContainer.textContent = 'Login successful! Redirecting...';
                errorContainer.style.color = 'green';

                // Redirect to main app
                setTimeout(() => {
                    window.location.href = '../../index.html';
                }, 1000);
            }, 1500);

        } catch (error) {
            console.error('Login error:', error);
            errorContainer.textContent = 'Login failed. Please try again.';
            errorContainer.style.color = 'red';
            loginButton.disabled = false;
            loginButton.textContent = 'Login';
        }
    });

    // Name validation
    function validateName() {
        const name = nameInput.value.trim();

        if (!name) {
            errorContainer.textContent = 'Name is required';
            return false;
        } else if (name.length < 2) {
            errorContainer.textContent = 'Name must be at least 2 characters';
            return false;
        }

        return true;
    }

    // Password validation
    function validatePassword() {
        const password = passwordInput.value.trim();

        if (!password) {
            errorContainer.textContent = 'Password is required';
            return false;
        } else if (password.length < 6) {
            errorContainer.textContent = 'Password must be at least 6 characters';
            return false;
        }

        return true;
    }
});
