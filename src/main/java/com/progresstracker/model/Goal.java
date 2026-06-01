package com.progresstracker.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Goal Entity - Represents a user's goal
 * 
 * Fields explanation:
 * - id: Unique goal identifier
 * - user: Reference to the User who set this goal
 * - title: Goal title (e.g., "100 Day No Sugar Challenge")
 * - description: Detailed goal description
 * - startDate: When the goal starts
 * - endDate: Target completion date
 * - status: ACTIVE, COMPLETED, or ABANDONED
 * - createdAt: When goal was created
 * - updatedAt: Last update time
 */
@Entity
@Table(name = "goals")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Goal {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private String title;
    
    private String description;
    
    @Column(nullable = false)
    private LocalDate startDate;
    
    @Column(nullable = false)
    private LocalDate endDate;
    
    @Enumerated(EnumType.STRING)
    private GoalStatus status = GoalStatus.ACTIVE;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    /**
     * Goal Status Enum - Represents the current state of a goal
     */
    public enum GoalStatus {
        ACTIVE("Active - Goal is in progress"),
        COMPLETED("Completed - Goal has been achieved"),
        ABANDONED("Abandoned - Goal was discontinued");
        
        private final String description;
        
        GoalStatus(String description) {
            this.description = description;
        }
        
        public String getDescription() {
            return description;
        }
    }
}
