package com.syncboard.controllers;

import com.syncboard.models.*;
import com.syncboard.repositories.*;
import com.syncboard.security.UserDetailsImpl;
import com.syncboard.services.TeamAccessService;
import com.syncboard.services.WebSocketService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/invitations")
@CrossOrigin(origins = "*", maxAge = 3600)
public class InvitationController {
    private final InvitationRepository invitationRepository;
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final TeamAccessService teamAccessService;
    private final WebSocketService webSocketService;

    public InvitationController(InvitationRepository invitationRepository, TeamRepository teamRepository, UserRepository userRepository, NotificationRepository notificationRepository, TeamAccessService teamAccessService, WebSocketService webSocketService) {
        this.invitationRepository = invitationRepository;
        this.teamRepository = teamRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
        this.teamAccessService = teamAccessService;
        this.webSocketService = webSocketService;
    }

    @GetMapping("/my")
    public List<Invitation> getMyInvites(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return invitationRepository.findByEmailAndStatusOrderByCreatedAtDesc(userDetails.getEmail(), "PENDING");
    }

    @PostMapping
    public ResponseEntity<?> createInvite(@RequestBody Map<String, String> payload, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        String teamId = payload.get("teamId");
        Team team = teamAccessService.requireTeam(teamId);
        if (!teamAccessService.isLeader(team, userDetails.getId())) {
            return ResponseEntity.status(403).body("Only team leader can invite members");
        }
        Invitation invitation = new Invitation();
        invitation.setTeamId(teamId);
        invitation.setEmail(payload.get("email"));
        invitation.setInvitedByUserId(userDetails.getId());
        String requestedRole = payload.getOrDefault("role", "MEMBER").toUpperCase().replace(" ", "_");
        TeamRole teamRole = TeamRole.MEMBER;
        if ("VIEWER".equals(requestedRole)) {
            teamRole = TeamRole.VIEWER;
        } else if ("TEAM_LEADER".equals(requestedRole)) {
            teamRole = TeamRole.TEAM_LEADER;
        }
        invitation.setRole(teamRole);
        Optional<User> invited = userRepository.findByEmail(payload.get("email"));
        invited.ifPresent(user -> invitation.setInvitedUserId(user.getId()));
        Invitation saved = invitationRepository.save(invitation);

        invited.ifPresent(user -> {
            Notification n = new Notification();
            n.setUserId(user.getId());
            n.setTitle("Team invitation");
            n.setMessage("You were invited to join " + team.getName());
            n.setLink("/invitations");
            notificationRepository.save(n);
        });

        return ResponseEntity.ok(saved);
    }

    @PostMapping("/{invitationId}/accept")
    public ResponseEntity<?> accept(@PathVariable String invitationId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Invitation invitation = invitationRepository.findById(invitationId).orElseThrow();
        if (!"PENDING".equals(invitation.getStatus()) || !userDetails.getEmail().equalsIgnoreCase(invitation.getEmail())) {
            return ResponseEntity.badRequest().body("Invalid invitation");
        }
        Team team = teamRepository.findById(invitation.getTeamId()).orElseThrow();
        team.addMember(userDetails.getId(), invitation.getRole());
        teamRepository.save(team);

        invitation.setStatus("ACCEPTED");
        invitation.setInvitedUserId(userDetails.getId());
        invitation.setRespondedAt(LocalDateTime.now());
        invitationRepository.save(invitation);

        ActivityLog log = new ActivityLog();
        log.setTeamId(team.getId());
        log.setUserId(userDetails.getId());
        log.setAction("Accepted invitation");
        log.setDetails(userDetails.getName() + " joined the team.");
        webSocketService.sendActivityToTeam(team.getId(), log);

        return ResponseEntity.ok(Map.of("message", "Invitation accepted"));
    }

    @PostMapping("/{invitationId}/reject")
    public ResponseEntity<?> reject(@PathVariable String invitationId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Invitation invitation = invitationRepository.findById(invitationId).orElseThrow();
        if (!"PENDING".equals(invitation.getStatus()) || !userDetails.getEmail().equalsIgnoreCase(invitation.getEmail())) {
            return ResponseEntity.badRequest().body("Invalid invitation");
        }
        invitation.setStatus("REJECTED");
        invitation.setRespondedAt(LocalDateTime.now());
        invitationRepository.save(invitation);
        return ResponseEntity.ok(Map.of("message", "Invitation rejected"));
    }
}
