package com.syncboard.controllers;

import com.syncboard.models.ActivityLog;
import com.syncboard.repositories.ActivityLogRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activity")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ActivityController {
    private final ActivityLogRepository activityLogRepository;

    public ActivityController(ActivityLogRepository activityLogRepository) {
        this.activityLogRepository = activityLogRepository;
    }

    @GetMapping("/team/{teamId}")
    public List<ActivityLog> byTeam(@PathVariable String teamId) {
        return activityLogRepository.findByTeamIdOrderByTimestampDesc(teamId);
    }
}
