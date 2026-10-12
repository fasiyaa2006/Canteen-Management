package com.canteen.service;

import com.canteen.dto.AuthResponse;
import com.canteen.dto.LoginRequest;
import com.canteen.dto.RegisterRequest;
import com.canteen.dto.UserSummaryDto;
import com.canteen.entity.Role;
import com.canteen.entity.User;
import com.canteen.exception.BadRequestException;
import com.canteen.exception.ResourceNotFoundException;
import com.canteen.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new BadRequestException("Email is already registered: " + request.getEmail());
        }

        Role role = request.getRole() != null ? request.getRole() : Role.STUDENT;

        User user = User.builder()
                .name(request.getName().trim())
                .email(request.getEmail().trim().toLowerCase())
                .password(request.getPassword()) // Direct password for local-first simplicity
                .phone(request.getPhone())
                .role(role)
                .build();

        User savedUser = userRepository.save(user);

        return AuthResponse.builder()
                .id(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .phone(savedUser.getPhone())
                .role(savedUser.getRole())
                .message("Registration successful")
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        return AuthResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .message("Login successful")
                .build();
    }

    public List<UserSummaryDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toUserSummaryDto)
                .collect(Collectors.toList());
    }

    public UserSummaryDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return toUserSummaryDto(user);
    }

    public UserSummaryDto toUserSummaryDto(User user) {
        return UserSummaryDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .build();
    }
}
