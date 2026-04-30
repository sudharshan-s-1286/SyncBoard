package com.syncboard.repositories;

import com.syncboard.models.ActivityLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ActivityLogRepository extends MongoRepository<ActivityLog, String> {
    List<ActivityLog> findByTeamIdOrderByTimestampDesc(String teamId);
    List<ActivityLog> findByProjectIdOrderByTimestampDesc(String projectId);
}
