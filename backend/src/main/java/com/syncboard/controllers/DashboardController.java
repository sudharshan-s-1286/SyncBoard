package com.syncboard.controllers;

import com.syncboard.dto.DashboardStats;
import com.syncboard.repositories.ProjectRepository;
import com.syncboard.repositories.TeamRepository;
import com.syncboard.repositories.TaskRepository;
import com.syncboard.security.UserDetailsImpl;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DashboardController {

    private final TeamRepository teamRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    public DashboardController(
            TeamRepository teamRepository, 
            ProjectRepository projectRepository, 
            TaskRepository taskRepository) {
        this.teamRepository = teamRepository;
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
    }

    @GetMapping("/stats")
    public DashboardStats getStats(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        String userId = userDetails.getId();
        var teams = teamRepository.findByMemberIdsContaining(userId);
        long teamsCount = teams.size();
        long projectsCount = teams.stream().mapToLong(t -> projectRepository.findByTeamId(t.getId()).size()).sum();
        long activeTasks = taskRepository.findByAssignedToId(userId).stream()
                .filter(t -> !"Done".equals(t.getStatus()))
                .count();
        long completedTasks = taskRepository.findByAssignedToId(userId).stream()
                .filter(t -> "Done".equals(t.getStatus()))
                .count();

        return new DashboardStats(teamsCount, projectsCount, activeTasks, completedTasks);
    }
}
