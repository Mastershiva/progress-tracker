/**
 * ===== DASHBOARD.JS =====
 * Dashboard page functionality
 * 
 * Displays:
 * - Welcome message with user's name
 * - Active goals
 * - Today's progress
 */

document.addEventListener("DOMContentLoaded", () => {
    checkAuthentication();
    loadDashboardData();
});

/**
 * Load all dashboard data
 */
async function loadDashboardData() {
    try {
        const token = getToken();
        
        // Load active goals
        await loadActiveGoals(token);
        
        // Load today's progress
        await loadTodayProgress(token);
    } catch (error) {
        showError("Error loading dashboard: " + error.message);
    }
}

/**
 * Load and display active goals
 */
async function loadActiveGoals(token) {
    try {
        const response = await getGoals(token);
        
        if (response.success && response.data) {
            const goals = response.data.filter(g => g.status === 'ACTIVE');
            const container = document.getElementById("goalsContainer");
            
            if (goals.length === 0) {
                container.innerHTML = '<p class="no-data">No active goals yet. <a href="goal-setup.html">Create one now!</a></p>';
                return;
            }
            
            container.innerHTML = goals.map(goal => `
                <div class="goal-item">
                    <h4>${goal.title}</h4>
                    <p>${goal.description || 'No description'}</p>
                    <p><small>Duration: ${formatDate(goal.startDate)} to ${formatDate(goal.endDate)}</small></p>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error("Error loading goals:", error);
    }
}

/**
 * Load and display today's progress
 */
async function loadTodayProgress(token) {
    try {
        const today = new Date();
        const response = await getDailyLogs(today, token);
        
        if (response.success && response.data) {
            const logs = response.data;
            const completed = logs.filter(log => log.completed).length;
            const total = logs.length;
            const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
            
            document.getElementById("todayCompleted").textContent = completed;
            document.getElementById("todayTotal").textContent = total;
            document.getElementById("todayPercentage").textContent = percentage + "%";
        }
    } catch (error) {
        console.error("Error loading today's progress:", error);
    }
}
