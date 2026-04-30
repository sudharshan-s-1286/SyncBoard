package com.syncboard.controllers;

import com.syncboard.models.User;
import com.syncboard.repositories.UserRepository;
import com.syncboard.security.UserDetailsImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/me")
    public User getCurrentUser(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        user.setPassword(null);
        return user;
    }

    @PutMapping("/me")
    public User updateProfile(@AuthenticationPrincipal UserDetailsImpl userDetails, @RequestBody Map<String, String> payload) {
        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        user.setName(payload.getOrDefault("name", user.getName()));
        user.setBio(payload.getOrDefault("bio", user.getBio()));
        user.setUsername(payload.getOrDefault("username", user.getUsername()));
        User saved = userRepository.save(user);
        saved.setPassword(null);
        return saved;
    }

    @PutMapping("/me/password")
    public ResponseEntity<?> changePassword(@AuthenticationPrincipal UserDetailsImpl userDetails, @RequestBody Map<String, String> payload) {
        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        String currentPassword = payload.get("currentPassword");
        String newPassword = payload.get("newPassword");
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.badRequest().body("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Password updated"));
    }

    @PutMapping("/me/preferences")
    public User updatePreferences(@AuthenticationPrincipal UserDetailsImpl userDetails, @RequestBody Map<String, Object> payload) {
        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        if (payload.containsKey("emailNotifications")) {
            user.setEmailNotifications(Boolean.TRUE.equals(payload.get("emailNotifications")));
        }
        if (payload.containsKey("pushNotifications")) {
            user.setPushNotifications(Boolean.TRUE.equals(payload.get("pushNotifications")));
        }
        if (payload.containsKey("profilePublic")) {
            user.setProfilePublic(Boolean.TRUE.equals(payload.get("profilePublic")));
        }
        User saved = userRepository.save(user);
        saved.setPassword(null);
        return saved;
    }
}
