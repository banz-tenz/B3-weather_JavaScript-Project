// Signup form handler

document.addEventListener('DOMContentLoaded', function() {
    const fullnameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('signup-password');
    const termsCheckbox = document.getElementById('terms');
    const signupButton = document.getElementById('signup-button');
    const signupForm = document.getElementById('signupForm');
    

    // Get or create error message container
    let errorContainer = document.getElementById('errorContainer');
    if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.id = 'errorContainer';
        errorContainer.style.padding = '12px 16px';
        errorContainer.style.marginBottom = '20px';
        errorContainer.style.borderRadius = '8px';
        errorContainer.style.fontSize = '14px';
        errorContainer.style.fontWeight = '500';
        errorContainer.style.display = 'none';
        signupForm.insertBefore(errorContainer, signupButton);
    }

    // Form submission
    signupButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Clear previous errors
        errorContainer.textContent = '';
        
        // Validate all inputs
        const fullnameValid = validateFullname();
        const emailValid = validateEmail();
        const passwordValid = validatePassword();

        if (!fullnameValid || !emailValid || !passwordValid) {
            return;
        }

        try {
            // Show loading state
            signupButton.disabled = true;
            signupButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';

            // Simulate API call
            setTimeout(() => {
                // Get form data
                const fullname = fullnameInput.value.trim();
                const email = emailInput.value.trim();
                const password = passwordInput.value.trim();

                // Save user data to localStorage
                localStorage.setItem('weatherAppUser', JSON.stringify({
                    fullname: fullname,
                    email: email,
                    signupTime: new Date().toISOString()
                }));

               

                // Show success message
                errorContainer.style.backgroundColor = '#c6f6d5';
                errorContainer.style.color = '#22543d';
                errorContainer.style.borderLeft = '4px solid #48bb78';
                errorContainer.textContent = '✓ Account created successfully! Redirecting...';
                errorContainer.style.display = 'block';
                signupButton.textContent = 'Success!';

                // Redirect to main app
                setTimeout(() => {
                    window.location.href = '../../index.html';
                }, 1500);
            }, 1500);

        } catch (error) {
            console.error('Signup error:', error);
            showError('Signup failed. Please try again.');
            signupButton.disabled = false;
            signupButton.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
        }
    });

    // Fullname validation
    function validateFullname() {
        const fullname = fullnameInput.value.trim();

        if (!fullname) {
            showError('Full name is required');
            return false;
        } else if (fullname.length < 2) {
            showError('Full name must be at least 2 characters');
            return false;
        } else if (!/^[a-zA-Z\s]+$/.test(fullname)) {
            showError('Full name can only contain letters and spaces');
            return false;
        }

        return true;
    }

    // Email validation
    function validateEmail() {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            showError('Email address is required');
            return false;
        } else if (!emailRegex.test(email)) {
            showError('Please enter a valid email address');
            return false;
        }

        return true;
    }

    // Password validation
    function validatePassword() {
        const password = passwordInput.value.trim();

        if (!password) {
            showError('Password is required');
            return false;
        } else if (password.length < 6) {
            showError('Password must be at least 6 characters');
            return false;
        } else if (!/(?=.*[a-z])/.test(password)) {
            showError('Password must contain at least one lowercase letter');
            return false;
        }

        return true;
    }

    // Terms validation
    function validateTerms() {
        if (!termsCheckbox.checked) {
            showError('You must agree to the Terms & Conditions');
            return false;
        }

        return true;
    }

    // Show error message
    function showError(message) {
        errorContainer.style.backgroundColor = '#fed7d7';
        errorContainer.style.color = '#742a2a';
        errorContainer.style.borderLeft = '4px solid #fc8181';
        errorContainer.textContent = '✗ ' + message;
        errorContainer.style.display = 'block';
    }

    // Real-time password strength indicator (optional enhancement)
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        let strength = 0;

        if (password.length >= 6) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z\d]/.test(password)) strength++;

        // Optional: Add visual feedback for password strength
        // You can add a strength meter here if desired
    });

    // Clear error when user starts typing
    [fullnameInput, emailInput, passwordInput, confirmPasswordInput].forEach(input => {
        input.addEventListener('focus', function() {
            errorContainer.style.display = 'none';
        });
    });
});
