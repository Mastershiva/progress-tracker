package com.progresstracker.controller;

import com.progresstracker.dto.ApiResponse;
import com.progresstracker.model.DailyLog;
import com.progresstracker.model.User;
import com.progresstracker.model.DailyActivity;
import com.progresstracker.service.DailyLogService;
import com.progresstracker.service.ActivityService;
import com.progresstracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * DailyLogController - Handles daily activity tracking
 * 
 * This is where users mark activities as complete/incomplete
 * 
 * Endpoints:
 * GET /api/daily-logs?date=2026-06-01 - Get today's tasks
 * POST /api/daily-logs - Create/update a daily log
 * PUT /api/daily-logs/{id}/complete - Mark activity as completed
 * PUT /api/daily-logs/{id}/incomplete - Mark activity as incomplete
 * GET /api/daily-logs/stats - Get statistics
 */
@RestController
@RequestMapping("/api/daily-logs")
@CrossOrigin(origins = "*")
public class DailyLogController {
    
    @Autowired
    private DailyLogService logService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private ActivityService activityService;
    
    /**
     * Get all tasks for a specific date
     * 
     * Usage: GET /api/daily-logs?date=2026-06-01
     * 
     * Returns all activities for that day with completion status
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<DailyLog>>> getDailyLogs(
            @RequestParam(required = false) LocalDate date,
            Authentication auth) {
        try {
            Optional<User> user = userService.getUserByUsername(auth.getName());
            
            if (user.isEmpty()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("User not found"));
            }
            
            // If no date provided, use today
            if (date == null) {
                date = LocalDate.now();
            }
            
            List<DailyLog> logs = logService.getDailyLogs(user.get(), date);
            return ResponseEntity.ok(new ApiResponse<>("Logs retrieved successfully", logs));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Error retrieving logs: " + e.getMessage()));
        }
    }
    
    /**
     * Create or update a daily log
     * 
     * Request body:
     * {
     *   "activityId": 1,
     *   "logDate": "2026-06-01",
     *   "completed": true,
     *   "notes": "Completed successfully"
     * }
     */
    @PostMapping
    public ResponseEntity<ApiResponse<DailyLog>> createLog(@RequestBody DailyLog log, Authentication auth) {
        try {
            Optional<User> user = userService.getUserByUsername(auth.getName());
            
            if (user.isEmpty()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("User not found"));
            }
            
            log.setUser(user.get());
            DailyLog savedLog = logService.saveLog(log);
            
            return ResponseEntity.ok(new ApiResponse<>("Log saved successfully", savedLog));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Error saving log: " + e.getMessage()));
        }
    }
    
    /**
     * Mark activity as completed for today
     * 
     * Usage: PUT /api/daily-logs/{activityId}/complete
     */
    @PutMapping("/{activityId}/complete")
    public ResponseEntity<ApiResponse<DailyLog>> markComplete(
            @PathVariable Long activityId,
            @RequestParam(required = false) LocalDate date,
            Authentication auth) {
        try {
            Optional<User> user = userService.getUserByUsername(auth.getName());
            Optional<DailyActivity> activity = activityService.getActivityById(activityId);
            
            if (user.isEmpty() || activity.isEmpty()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("User or activity not found"));
            }
            
            if (date == null) {
                date = LocalDate.now();
            }
            
            DailyLog log = logService.markAsComplete(user.get(), activity.get(), date);
            return ResponseEntity.ok(new ApiResponse<>("Activity marked as complete", log));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Error updating log: " + e.getMessage()));
        }
    }
    
    /**
     * Mark activity as incomplete for today
     */
    @PutMapping("/{activityId}/incomplete")
    public ResponseEntity<ApiResponse<DailyLog>> markIncomplete(
            @PathVariable Long activityId,
            @RequestParam(required = false) LocalDate date,
            Authentication auth) {
        try {
            Optional<User> user = userService.getUserByUsername(auth.getName());
            Optional<DailyActivity> activity = activityService.getActivityById(activityId);
            
            if (user.isEmpty() || activity.isEmpty()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("User or activity not found"));
            }
            
            if (date == null) {
                date = LocalDate.now();
            }
            
            DailyLog log = logService.markAsIncomplete(user.get(), activity.get(), date);
            return ResponseEntity.ok(new ApiResponse<>("Activity marked as incomplete", log));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Error updating log: " + e.getMessage()));
        }
    }
}
