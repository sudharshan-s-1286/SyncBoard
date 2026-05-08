package com.syncboard.repositories;

import com.syncboard.models.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByProjectId(String projectId);
    List<Task> findByAssigneeIdsContaining(String userId);
}
