package com.syncboard.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "activity_logs")
public class ActivityLog {
    @Id
    private String id;
    private String teamId;
    private String projectId;
    private String taskId;
    private String userId;
    private String action; // e.g., "Created task", "Moved to Done"
    private String details;
    private LocalDateTime timestamp = LocalDateTime.now();
}
