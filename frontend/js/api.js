/**
 * ===== API.JS =====
 * Centralized API communication module
 * All frontend-backend communication goes through here
 * 
 * This file contains all functions that call the backend APIs
 * Makes it easy to change the API base URL in one place
 */

// API Base URL - Change this if backend is on different server
const API_BASE_URL = "http://localhost:8080/api";

/**
 * Generic API call function
 * 
 * @param {string} endpoint - API endpoint (e.g., '/auth/login')
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {object} data - Data to send (for POST/PUT)
 * @param {string} token - JWT token for authentication
 * @returns {Promise} - Response from server
 */
async function apiCall(endpoint, method = "GET", data = null, token = null) {
    const headers = {
        "Content-Type": "application/json",
    };
    
    // Add token to header if user is logged in
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    
    const options = {
        method,
        headers
    };
    
    // Add request body for POST/PUT requests
    if (data) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        // If response is not OK, throw error
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP Error: ${response.status}`);
        }
        
        // Return response data
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

/**
 * ===== AUTHENTICATION APIs =====
 */

/**
 * User Login
 * @param {string} username
 * @param {string} password
 * @returns {Promise} - Contains token, userId, username
 */
async function login(username, password) {
    return apiCall("/auth/login", "POST", { username, password });
}

/**
 * User Signup
 * @param {object} user - { username, email, password, fullName, age, gender }
 * @returns {Promise}
 */
async function signup(user) {
    return apiCall("/auth/signup", "POST", user);
}

/**
 * ===== GOAL APIs =====
 */

/**
 * Create a new goal
 */
async function createGoal(goalData, token) {
    return apiCall("/goals", "POST", goalData, token);
}

/**
 * Get all goals for user
 */
async function getGoals(token) {
    return apiCall("/goals", "GET", null, token);
}

/**
 * Get specific goal
 */
async function getGoalById(goalId, token) {
    return apiCall(`/goals/${goalId}`, "GET", null, token);
}

/**
 * Update goal
 */
async function updateGoal(goalId, goalData, token) {
    return apiCall(`/goals/${goalId}`, "PUT", goalData, token);
}

/**
 * Mark goal as completed
 */
async function completeGoal(goalId, token) {
    return apiCall(`/goals/${goalId}/complete`, "PUT", null, token);
}

/**
 * Abandon a goal
 */
async function abandonGoal(goalId, token) {
    return apiCall(`/goals/${goalId}/abandon`, "PUT", null, token);
}

/**
 * ===== ACTIVITY APIs =====
 */

/**
 * Create a new activity for a goal
 */
async function createActivity(activityData, token) {
    return apiCall("/activities", "POST", activityData, token);
}

/**
 * Get all activities for a goal
 */
async function getActivitiesByGoal(goalId, token) {
    return apiCall(`/activities/goal/${goalId}`, "GET", null, token);
}

/**
 * Get specific activity
 */
async function getActivityById(activityId, token) {
    return apiCall(`/activities/${activityId}`, "GET", null, token);
}

/**
 * Update activity
 */
async function updateActivity(activityId, activityData, token) {
    return apiCall(`/activities/${activityId}`, "PUT", activityData, token);
}

/**
 * Delete activity
 */
async function deleteActivity(activityId, token) {
    return apiCall(`/activities/${activityId}`, "DELETE", null, token);
}

/**
 * ===== DAILY LOG APIs =====
 */

/**
 * Get logs for a specific date
 */
async function getDailyLogs(date, token) {
    const dateStr = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    return apiCall(`/daily-logs?date=${dateStr}`, "GET", null, token);
}

/**
 * Create/update a daily log
 */
async function submitDailyLog(logData, token) {
    return apiCall("/daily-logs", "POST", logData, token);
}

/**
 * Mark activity as completed
 */
async function markActivityComplete(activityId, date, token) {
    const dateStr = date.toISOString().split('T')[0];
    return apiCall(`/daily-logs/${activityId}/complete?date=${dateStr}`, "PUT", null, token);
}

/**
 * Mark activity as incomplete
 */
async function markActivityIncomplete(activityId, date, token) {
    const dateStr = date.toISOString().split('T')[0];
    return apiCall(`/daily-logs/${activityId}/incomplete?date=${dateStr}`, "PUT", null, token);
}

/**
 * ===== CHATBOT APIs =====
 */

/**
 * Send message to chatbot
 */
async function sendChatMessage(userMessage, token) {
    return apiCall("/chatbot/message", "POST", { userMessage }, token);
}

/**
 * Get chat history
 */
async function getChatHistory(token) {
    return apiCall("/chatbot/history", "GET", null, token);
}

/**
 * ===== UTILITY FUNCTIONS =====
 */

/**
 * Format date for display
 */
function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

/**
 * Format time for display
 */
function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Show error message
 */
function showError(message, elementId = 'errorMessage') {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    console.error(message);
}

/**
 * Show success message
 */
function showSuccess(message, elementId = 'successMessage') {
    const successElement = document.getElementById(elementId);
    if (successElement) {
        successElement.textContent = message;
        successElement.style.display = 'block';
        setTimeout(() => {
            successElement.style.display = 'none';
        }, 3000);
    }
}

/**
 * Hide error/success messages
 */
function clearMessages() {
    const errorElement = document.getElementById('errorMessage');
    const successElement = document.getElementById('successMessage');
    if (errorElement) errorElement.style.display = 'none';
    if (successElement) successElement.style.display = 'none';
}
