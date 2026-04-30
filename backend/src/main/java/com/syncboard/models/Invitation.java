package com.syncboard.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "invitations")
public class Invitation {
    @Id
    private String id;
    private String teamId;
    private String email;
    private String invitedByUserId;
    private String invitedUserId;
    private TeamRole role = TeamRole.MEMBER;
    private String status = "PENDING";
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime respondedAt;
}
