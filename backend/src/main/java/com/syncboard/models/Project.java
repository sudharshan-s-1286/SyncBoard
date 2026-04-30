package com.syncboard.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "projects")
public class Project {
    @Id
    private String id;
    private String teamId;
    private String name;
    private String description;
    private String status = "Active"; // Active, Completed
    private String deadline;
    private List<String> assignedMemberIds = new ArrayList<>();
    private LocalDateTime createdAt = LocalDateTime.now();
}
