package com.syncboard.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "tasks")
public class Task {
    @Id
    private String id;
    private String projectId;
    private String title;
    private String description;
    private List<String> assigneeIds = new ArrayList<>();
    private List<String> watcherIds = new ArrayList<>();
    private String status = "To Do"; // To Do, In Progress, Review, Done
    private String priority = "Medium"; // Low, Medium, High
    private List<String> attachments = new ArrayList<>();
    private LocalDateTime dueDate;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
