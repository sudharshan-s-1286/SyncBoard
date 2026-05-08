package com.syncboard.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.ArrayList;
import java.util.Optional;
import java.util.List;
import java.util.Set;

@Data
@Document(collection = "teams")
public class Team {
    @Id
    private String id;
    private String name;
    private String description;
    private String avatarUrl;
    private String leaderId; 
    private Set<String> memberIds = new HashSet<>();
    private List<TeamMember> members = new ArrayList<>();
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    public void addMember(String userId) {
        memberIds.add(userId);
        boolean exists = members.stream().anyMatch(m -> userId.equals(m.getUserId()));
        if (!exists) {
            TeamMember member = new TeamMember();
            member.setUserId(userId);
            member.setRole(TeamRole.MEMBER);
            members.add(member);
        }
    }

    public void addMember(String userId, TeamRole role) {
        memberIds.add(userId);
        members.removeIf(m -> userId.equals(m.getUserId()));
        TeamMember member = new TeamMember();
        member.setUserId(userId);
        member.setRole(role);
        members.add(member);
    }

    public Optional<TeamMember> getMember(String userId) {
        return members.stream().filter(m -> userId.equals(m.getUserId())).findFirst();
    }

    public void removeMember(String userId) {
        memberIds.remove(userId);
        members.removeIf(m -> userId.equals(m.getUserId()));
    }
}
