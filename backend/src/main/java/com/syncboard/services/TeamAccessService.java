package com.syncboard.services;

import com.syncboard.models.Team;
import com.syncboard.models.TeamRole;
import com.syncboard.repositories.TeamRepository;
import org.springframework.stereotype.Service;

@Service
public class TeamAccessService {
    private final TeamRepository teamRepository;

    public TeamAccessService(TeamRepository teamRepository) {
        this.teamRepository = teamRepository;
    }

    public Team requireTeam(String teamId) {
        return teamRepository.findById(teamId).orElseThrow(() -> new IllegalArgumentException("Team not found"));
    }

    public boolean isMember(Team team, String userId) {
        return team.getMemberIds().contains(userId);
    }

    public boolean isLeader(Team team, String userId) {
        if (team.getLeaderId() != null && team.getLeaderId().equals(userId)) {
            return true;
        }
        return team.getMember(userId).map(member -> member.getRole() == TeamRole.TEAM_LEADER).orElse(false);
    }
}
