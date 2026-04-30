package com.syncboard.models;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TeamMember {
    private String userId;
    private TeamRole role = TeamRole.MEMBER;
    private LocalDateTime joinedAt = LocalDateTime.now();
}
