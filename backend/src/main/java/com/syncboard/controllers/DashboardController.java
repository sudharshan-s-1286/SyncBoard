package com.syncboard.controllers;

import com.syncboard.dto.DashboardStats;
import com.syncboard.repositories.ProjectRepository;
import com.syncboard.repositories.TeamRepository;
import com.syncboard.repositories.TaskRepository;
import com.syncboard.security.UserDetailsImpl;
import com.syncboard.models.ActivityLog;
import com.syncboard.models.Task;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DashboardController {

    private final TeamRepository teamRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final com.syncboard.repositories.ActivityLogRepository activityLogRepository;

    public DashboardController(
            TeamRepository teamRepository, 
            ProjectRepository projectRepository, 
            TaskRepository taskRepository,
            com.syncboard.repositories.ActivityLogRepository activityLogRepository) {
        this.teamRepository = teamRepository;
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.activityLogRepository = activityLogRepository;
    }

    @GetMapping("/stats")
    public DashboardStats getStats(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        String userId = userDetails.getId();
        var teams = teamRepository.findByMemberIdsContaining(userId);
        long teamsCount = teams.size();
        long projectsCount = teams.stream().mapToLong(t -> projectRepository.findByTeamId(t.getId()).size()).sum();
        long activeTasks = taskRepository.findByAssigneeIdsContaining(userId).stream()
                .filter(t -> !"Done".equals(t.getStatus()))
                .count();
        long completedTasks = taskRepository.findByAssigneeIdsContaining(userId).stream()
                .filter(t -> "Done".equals(t.getStatus()))
                .count();

        return new DashboardStats(teamsCount, projectsCount, activeTasks, completedTasks);
    }

    @GetMapping("/teams/{teamId}")
    public com.syncboard.dto.TeamDashboardStats getTeamStats(@PathVariable String teamId) {
        var team = teamRepository.findById(teamId).orElseThrow();
        var projects = projectRepository.findByTeamId(teamId);
        
        long totalMembers = team.getMemberIds().size();
        long activeProjects = projects.size();
        
        var tasks = projects.stream()
                .flatMap(p -> taskRepository.findByProjectId(p.getId()).stream())
                .toList();
        
        long totalTasks = tasks.size();
        long doneTasks = tasks.stream().filter(t -> "Done".equalsIgnoreCase(t.getStatus())).count();
        double completionRate = totalTasks == 0 ? 0 : (double) doneTasks / totalTasks * 100;
        
        java.util.Map<String, Long> statusMap = tasks.stream()
                .collect(java.util.stream.Collectors.groupingBy(com.syncboard.models.Task::getStatus, java.util.stream.Collectors.counting()));

        var recentLogs = activityLogRepository.findByTeamIdOrderByTimestampDesc(teamId).stream().limit(5).toList();

        return new com.syncboard.dto.TeamDashboardStats(totalMembers, activeProjects, completionRate, statusMap, recentLogs);
    }
}

