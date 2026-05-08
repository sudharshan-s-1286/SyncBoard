package com.syncboard.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import java.util.List;
import java.util.Map;
import com.syncboard.models.ActivityLog;

@Data
@AllArgsConstructor
public class TeamDashboardStats {
    private long totalMembers;
    private long activeProjects;
    private double taskCompletionRate;
    private Map<String, Long> tasksByStatus;
    private List<ActivityLog> recentActivity;
}
