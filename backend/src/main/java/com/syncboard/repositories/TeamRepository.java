package com.syncboard.repositories;

import com.syncboard.models.Team;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TeamRepository extends MongoRepository<Team, String> {
    List<Team> findByMemberIdsContaining(String userId);
}
