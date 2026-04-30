package com.syncboard.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private String bio;
    private String username;
    private Role role = Role.ROLE_USER;
    private boolean emailNotifications = true;
    private boolean pushNotifications = true;
    private boolean profilePublic = true;
    private LocalDateTime createdAt = LocalDateTime.now();
}
