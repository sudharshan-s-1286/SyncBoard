package com.syncboard.controllers;

import com.syncboard.models.Notification;
import com.syncboard.repositories.NotificationRepository;
import com.syncboard.security.UserDetailsImpl;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*", maxAge = 3600)
public class NotificationController {
    private final NotificationRepository notificationRepository;

    public NotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @GetMapping
    public List<Notification> getMy(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userDetails.getId());
    }

    @GetMapping("/unread-count")
    public Map<String, Long> unreadCount(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return Map.of("count", notificationRepository.countByUserIdAndIsReadFalse(userDetails.getId()));
    }

    @PutMapping("/{id}/read")
    public Notification markRead(@PathVariable String id) {
        Notification n = notificationRepository.findById(id).orElseThrow();
        n.setRead(true);
        return notificationRepository.save(n);
    }

    @PutMapping("/read-all")
    public Map<String, String> markAllRead(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<Notification> all = notificationRepository.findByUserIdOrderByCreatedAtDesc(userDetails.getId());
        all.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(all);
        return Map.of("message", "All notifications marked as read");
    }
}
