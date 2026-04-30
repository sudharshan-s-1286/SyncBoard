package com.syncboard.repositories;

import com.syncboard.models.Invitation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface InvitationRepository extends MongoRepository<Invitation, String> {
    List<Invitation> findByEmailAndStatusOrderByCreatedAtDesc(String email, String status);
    List<Invitation> findByInvitedUserIdAndStatusOrderByCreatedAtDesc(String userId, String status);
    List<Invitation> findByTeamIdOrderByCreatedAtDesc(String teamId);
}
