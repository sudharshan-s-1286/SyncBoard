package com.syncboard.controllers;

import com.syncboard.models.ActivityLog;
import com.syncboard.models.Task;
import com.syncboard.models.Comment;
import com.syncboard.models.Project;
import com.syncboard.models.Team;
import com.syncboard.repositories.TaskRepository;
import com.syncboard.repositories.ProjectRepository;
import com.syncboard.repositories.CommentRepository;
import com.syncboard.security.UserDetailsImpl;
import com.syncboard.services.TeamAccessService;
import com.syncboard.services.WebSocketService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TaskController {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final CommentRepository commentRepository;
    private final WebSocketService webSocketService;
    private final TeamAccessService teamAccessService;

    public TaskController(TaskRepository taskRepository, ProjectRepository projectRepository,
            CommentRepository commentRepository, WebSocketService webSocketService,
            TeamAccessService teamAccessService) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.commentRepository = commentRepository;
        this.webSocketService = webSocketService;
        this.teamAccessService = teamAccessService;
    }

    @GetMapping("/project/{projectId}")
    public List<Task> getProjectTasks(@PathVariable String projectId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Project project = projectRepository.findById(projectId).orElseThrow();
        Team team = teamAccessService.requireTeam(project.getTeamId());
        if (!teamAccessService.isMember(team, userDetails.getId())) {
            throw new IllegalArgumentException("Forbidden");
        }
        return taskRepository.findByProjectId(projectId);
    }

    @GetMapping("/assigned")
    public List<Task> getAssignedTasks(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return taskRepository.findByAssigneeIdsContaining(userDetails.getId());
    }


    @PostMapping
    public Task createTask(@RequestBody Task task, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Project project = projectRepository.findById(task.getProjectId()).orElseThrow();
        Team team = teamAccessService.requireTeam(project.getTeamId());
        if (!teamAccessService.isMember(team, userDetails.getId())) {
            throw new IllegalArgumentException("Forbidden");
        }
        Task savedTask = taskRepository.save(task);

        Project proj = project;
        if (proj != null) {
            ActivityLog log = new ActivityLog();
            log.setTeamId(proj.getTeamId());
            log.setProjectId(proj.getId());
            log.setTaskId(savedTask.getId());
            log.setUserId(userDetails.getId());
            log.setAction("Created task");
            log.setDetails(userDetails.getName() + " created task: " + task.getTitle());
            webSocketService.sendActivityToTeam(proj.getTeamId(), log);
        }
        return savedTask;
    }

    @PutMapping("/{id}/status")
    public Task updateTaskStatus(@PathVariable String id, @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Task task = taskRepository.findById(id).orElseThrow();
        String oldStatus = task.getStatus();
        String newStatus = payload.get("status");
        task.setStatus(newStatus);
        task.setUpdatedAt(LocalDateTime.now());
        Task savedTask = taskRepository.save(task);

        Project proj = projectRepository.findById(task.getProjectId()).orElse(null);
        if (proj != null) {
            ActivityLog log = new ActivityLog();
            log.setTeamId(proj.getTeamId());
            log.setProjectId(proj.getId());
            log.setTaskId(savedTask.getId());
            log.setUserId(userDetails.getId());
            log.setAction("Updated task status");
            log.setDetails(userDetails.getName() + " moved task '" + task.getTitle() + "' from " + oldStatus + " to "
                    + newStatus);
            webSocketService.sendActivityToTeam(proj.getTeamId(), log);
        }

        return savedTask;
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable String id, @RequestBody Task payload,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Task task = taskRepository.findById(id).orElseThrow();
        task.setTitle(payload.getTitle());
        task.setDescription(payload.getDescription());
        task.setAssigneeIds(payload.getAssigneeIds());
        task.setWatcherIds(payload.getWatcherIds());
        task.setPriority(payload.getPriority());
        task.setStatus(payload.getStatus());
        task.setDueDate(payload.getDueDate());
        task.setAttachments(payload.getAttachments());
        task.setUpdatedAt(LocalDateTime.now());
        
        Task saved = taskRepository.save(task);
        
        // Notify watchers if status changed (simplified for now)
        return saved;
    }

    @PostMapping("/{id}/watch")
    public Task toggleWatch(@PathVariable String id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Task task = taskRepository.findById(id).orElseThrow();
        if (task.getWatcherIds().contains(userDetails.getId())) {
            task.getWatcherIds().remove(userDetails.getId());
        } else {
            task.getWatcherIds().add(userDetails.getId());
        }
        return taskRepository.save(task);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable String id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        taskRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Task deleted"));
    }

    @PostMapping("/{id}/attachments")
    public Task addAttachment(@PathVariable String id, @RequestBody Map<String, String> payload) {
        Task task = taskRepository.findById(id).orElseThrow();
        String value = payload.get("attachment");
        if (value != null && !value.isBlank()) {
            task.getAttachments().add(value);
        }
        task.setUpdatedAt(LocalDateTime.now());
        return taskRepository.save(task);
    }

    @GetMapping("/{taskId}/comments")
    public List<Comment> getTaskComments(@PathVariable String taskId) {
        return commentRepository.findByTaskId(taskId);
    }

    @PostMapping("/{taskId}/comments")
    public Comment addComment(@PathVariable String taskId, @RequestBody Comment comment,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        comment.setTaskId(taskId);
        comment.setUserId(userDetails.getId());
        comment.setCreatedAt(LocalDateTime.now());
        Comment savedComment = commentRepository.save(comment);

        // Activity log for comment
        taskRepository.findById(taskId).ifPresent(task -> {
            projectRepository.findById(task.getProjectId()).ifPresent(proj -> {
                ActivityLog log = new ActivityLog();
                log.setTeamId(proj.getTeamId());
                log.setProjectId(proj.getId());
                log.setTaskId(task.getId());
                log.setUserId(userDetails.getId());
                log.setAction("Commented on task");
                log.setDetails(userDetails.getName() + " commented on '" + task.getTitle() + "': " + comment.getText());
                webSocketService.sendActivityToTeam(proj.getTeamId(), log);
            });
        });

        return savedComment;
    }
}
