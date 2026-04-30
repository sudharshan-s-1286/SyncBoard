package com.syncboard.dto;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class DashboardStats {
    private long totalTeams;
    private long totalProjects;
    private long activeTasks;
    private long completedTasks;
}
