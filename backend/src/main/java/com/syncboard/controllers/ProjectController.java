package com.syncboard.controllers;

import com.syncboard.models.ActivityLog;
import com.syncboard.models.Project;
import com.syncboard.models.Team;
import com.syncboard.repositories.ProjectRepository;
import com.syncboard.security.UserDetailsImpl;
import com.syncboard.services.TeamAccessService;
import com.syncboard.services.WebSocketService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProjectController {

    private final ProjectRepository projectRepository;
    private final WebSocketService webSocketService;
    private final TeamAccessService teamAccessService;

    public ProjectController(ProjectRepository projectRepository, WebSocketService webSocketService, TeamAccessService teamAccessService) {
        this.projectRepository = projectRepository;
        this.webSocketService = webSocketService;
        this.teamAccessService = teamAccessService;
    }

    @GetMapping("/team/{teamId}")
    public List<Project> getTeamProjects(@PathVariable String teamId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Team team = teamAccessService.requireTeam(teamId);
        if (!teamAccessService.isMember(team, userDetails.getId())) {
            throw new IllegalArgumentException("Forbidden");
        }
        return projectRepository.findByTeamId(teamId);
    }

    @GetMapping("/{id}")
    public Project getProject(@PathVariable String id) {
        return projectRepository.findById(id).orElseThrow();
    }

    @PostMapping
    public Project createProject(@RequestBody Project project, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Team team = teamAccessService.requireTeam(project.getTeamId());
        if (!teamAccessService.isMember(team, userDetails.getId())) {
            throw new IllegalArgumentException("Forbidden");
        }
        Project savedProject = projectRepository.save(project);
        
        ActivityLog log = new ActivityLog();
        log.setTeamId(savedProject.getTeamId());
        log.setProjectId(savedProject.getId());
        log.setUserId(userDetails.getId());
        log.setAction("Created project");
        log.setDetails(userDetails.getName() + " created project: " + project.getName());
        webSocketService.sendActivityToTeam(savedProject.getTeamId(), log);
        
        return savedProject;
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProject(@PathVariable String id, @RequestBody Project payload, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Project project = projectRepository.findById(id).orElseThrow();
        Team team = teamAccessService.requireTeam(project.getTeamId());
        if (!teamAccessService.isLeader(team, userDetails.getId())) {
            return ResponseEntity.status(403).body("Only team leader can update project");
        }
        project.setName(payload.getName());
        project.setDescription(payload.getDescription());
        project.setStatus(payload.getStatus());
        project.setDeadline(payload.getDeadline());
        project.setAssignedMemberIds(payload.getAssignedMemberIds());
        return ResponseEntity.ok(projectRepository.save(project));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable String id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Project project = projectRepository.findById(id).orElseThrow();
        Team team = teamAccessService.requireTeam(project.getTeamId());
        if (!teamAccessService.isLeader(team, userDetails.getId())) {
            return ResponseEntity.status(403).body("Only team leader can delete project");
        }
        projectRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Project deleted"));
    }
}
