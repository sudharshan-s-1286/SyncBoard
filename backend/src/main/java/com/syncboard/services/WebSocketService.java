package com.syncboard.services;

import com.syncboard.models.ActivityLog;
import com.syncboard.repositories.ActivityLogRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketService {
    private final SimpMessagingTemplate messagingTemplate;
    private final ActivityLogRepository activityLogRepository;

    public WebSocketService(SimpMessagingTemplate messagingTemplate, ActivityLogRepository activityLogRepository) {
        this.messagingTemplate = messagingTemplate;
        this.activityLogRepository = activityLogRepository;
    }

    public void sendActivityToTeam(String teamId, ActivityLog log) {
        activityLogRepository.save(log);
        messagingTemplate.convertAndSend("/topic/team/" + teamId, log);
    }

    public void sendNotificationToUser(String userId, com.syncboard.models.Notification notification) {
        messagingTemplate.convertAndSendToUser(userId, "/queue/notifications", notification);
    }
}
