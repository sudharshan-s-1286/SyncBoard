package com.syncboard.controllers;

import com.syncboard.models.ActivityLog;
import com.syncboard.models.Team;
import com.syncboard.models.TeamRole;
import com.syncboard.repositories.TeamRepository;
import com.syncboard.security.UserDetailsImpl;
import com.syncboard.services.TeamAccessService;
import com.syncboard.services.WebSocketService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teams")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TeamController {

    private final TeamRepository teamRepository;
    private final WebSocketService webSocketService;
    private final TeamAccessService teamAccessService;

    public TeamController(TeamRepository teamRepository, WebSocketService webSocketService, TeamAccessService teamAccessService) {
        this.teamRepository = teamRepository;
        this.webSocketService = webSocketService;
        this.teamAccessService = teamAccessService;
    }

    @GetMapping
    public List<Team> getUserTeams(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return teamRepository.findByMemberIdsContaining(userDetails.getId());
    }

    @PostMapping
    public Team createTeam(@RequestBody Team team, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        team.setLeaderId(userDetails.getId());
        team.addMember(userDetails.getId(), TeamRole.TEAM_LEADER);
        Team savedTeam = teamRepository.save(team);
        
        ActivityLog log = new ActivityLog();
        log.setTeamId(savedTeam.getId());
        log.setUserId(userDetails.getId());
        log.setAction("Created team");
        log.setDetails(userDetails.getName() + " created team: " + team.getName());
        webSocketService.sendActivityToTeam(savedTeam.getId(), log);
        
        return savedTeam;
    }

    @PutMapping("/{teamId}")
    public ResponseEntity<?> updateTeam(@PathVariable String teamId, @RequestBody Team payload, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Team team = teamAccessService.requireTeam(teamId);
        if (!teamAccessService.isLeader(team, userDetails.getId())) {
            return ResponseEntity.status(403).body("Only leader can update team");
        }
        team.setName(payload.getName());
        team.setDescription(payload.getDescription());
        Team saved = teamRepository.save(team);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{teamId}")
    public ResponseEntity<?> deleteTeam(@PathVariable String teamId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Team team = teamAccessService.requireTeam(teamId);
        if (!teamAccessService.isLeader(team, userDetails.getId())) {
            return ResponseEntity.status(403).body("Only leader can delete team");
        }
        teamRepository.deleteById(teamId);
        return ResponseEntity.ok(Map.of("message", "Team deleted"));
    }
    
    @PostMapping("/{teamId}/members")
    public ResponseEntity<?> addMember(@PathVariable String teamId, @RequestBody Map<String, String> payload, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        String memberId = payload.get("userId");
        Team team = teamAccessService.requireTeam(teamId);
        if(!teamAccessService.isLeader(team, userDetails.getId())) {
             return ResponseEntity.status(403).body("Only leader can add members");
        }
        TeamRole role = "VIEWER".equalsIgnoreCase(payload.get("role")) ? TeamRole.VIEWER : TeamRole.MEMBER;
        team.addMember(memberId, role);
        teamRepository.save(team);
        
        ActivityLog log = new ActivityLog();
        log.setTeamId(team.getId());
        log.setUserId(userDetails.getId());
        log.setAction("Added member");
        log.setDetails(userDetails.getName() + " added a new member.");
        webSocketService.sendActivityToTeam(team.getId(), log);
        
        return ResponseEntity.ok(team);
    }

    @PutMapping("/{teamId}/members/{memberId}/role")
    public ResponseEntity<?> updateMemberRole(
            @PathVariable String teamId,
            @PathVariable String memberId,
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Team team = teamAccessService.requireTeam(teamId);
        if(!teamAccessService.isLeader(team, userDetails.getId())) {
            return ResponseEntity.status(403).body("Only leader can update roles");
        }
        TeamRole role = TeamRole.valueOf(payload.getOrDefault("role", "MEMBER").toUpperCase());
        team.addMember(memberId, role);
        teamRepository.save(team);
        return ResponseEntity.ok(team);
    }
}
