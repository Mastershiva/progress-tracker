/**
 * ===== AUTH.JS =====
 * Authentication and authorization handling
 * 
 * Handles:
 * - Login/Signup form submission
 * - Token storage and retrieval
 * - User session management
 * - Logout
 * - Protected page access
 */

/**
 * Handle Login Form Submission
 */
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearMessages();
    
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    try {
        // Call backend login API
        const response = await login(username, password);
        
        if (response.success) {
            // Store token and user info in localStorage
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userId", response.data.userId);
            localStorage.setItem("username", response.data.username);
            
            showSuccess("Login successful! Redirecting...");
            
            // Redirect to dashboard after 1 second
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);
        }
    } catch (error) {
        showError("Login failed: " + error.message);
    }
});

/**
 * Handle Signup Form Submission
 */
document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearMessages();
    
    const user = {
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        fullName: document.getElementById("fullName").value,
        age: parseInt(document.getElementById("age").value) || null,
        gender: document.getElementById("gender").value || null
    };
    
    try {
        const response = await signup(user);
        
        if (response.success) {
            showSuccess("Signup successful! Redirecting to login...");
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);
        }
    } catch (error) {
        showError("Signup failed: " + error.message);
    }
});

/**
 * Logout Function
 * Clears all stored data and redirects to login page
 */
function logout() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "login.html";
}

/**
 * Check if user is logged in
 * @returns {boolean}
 */
function isLoggedIn() {
    return localStorage.getItem("token") !== null;
}

/**
 * Get stored JWT token
 * @returns {string} - JWT token
 */
function getToken() {
    return localStorage.getItem("token");
}

/**
 * Get stored username
 * @returns {string} - Username
 */
function getUsername() {
    return localStorage.getItem("username");
}

/**
 * Get stored user ID
 * @returns {number} - User ID
 */
function getUserId() {
    return localStorage.getItem("userId");
}

/**
 * Protect pages - redirect to login if not authenticated
 * Call this function at the top of protected pages
 */
function checkAuthentication() {
    if (!isLoggedIn()) {
        window.location.href = "login.html";
    } else {
        // Display username in navbar
        displayUsername();
    }
}

/**
 * Display username in navbar
 */
function displayUsername() {
    const username = getUsername();
    const usernameElements = document.querySelectorAll("#username");
    usernameElements.forEach(el => {
        el.textContent = username;
    });
}

/**
 * Setup logout button
 */
document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }
    
    // Check authentication on page load
    const currentPage = window.location.pathname;
    const publicPages = ['login.html', 'signup.html', 'index.html'];
    const isPublicPage = publicPages.some(page => currentPage.includes(page));
    
    if (!isPublicPage && !isLoggedIn()) {
        checkAuthentication();
    }
});

/**
 * Navigate to a page
 */
function goToPage(page) {
    window.location.href = page;
}
