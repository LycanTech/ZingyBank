package com.zingybank.auth.service;

import com.zingybank.auth.dto.*;
import com.zingybank.auth.model.*;
import com.zingybank.auth.repository.RefreshTokenRepository;
import com.zingybank.auth.repository.UserRepository;
import com.zingybank.auth.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Value("${jwt.refresh-token-expiration:604800000}")
    private long refreshTokenExpiration;

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int LOCKOUT_MINUTES = 30;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phoneNumber(request.getPhoneNumber())
                .status(UserStatus.PENDING_VERIFICATION)
                .roles(Set.of(Role.CUSTOMER))
                .mfaEnabled(false)
                .failedLoginAttempts(0)
                .build();

        user = userRepository.save(user);
        log.info("User registered: {}", user.getEmail());

        return generateTokens(user);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (user.getLockoutUntil() != null && user.getLockoutUntil().isAfter(LocalDateTime.now())) {
            throw new IllegalStateException("Account is locked. Try again later.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            handleFailedLogin(user);
            throw new IllegalArgumentException("Invalid credentials");
        }

        if (user.getStatus() != UserStatus.ACTIVE && user.getStatus() != UserStatus.PENDING_VERIFICATION) {
            throw new IllegalStateException("Account is not active");
        }

        user.setFailedLoginAttempts(0);
        user.setLockoutUntil(null);
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        log.info("User logged in: {}", user.getEmail());
        return generateTokens(user);
    }

    @Transactional
    public void logout(String userId) {
        refreshTokenRepository.revokeAllByUserId(userId);
        log.info("User logged out: {}", userId);
    }

    private void handleFailedLogin(User user) {
        user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);
        if (user.getFailedLoginAttempts() >= MAX_FAILED_ATTEMPTS) {
            user.setLockoutUntil(LocalDateTime.now().plusMinutes(LOCKOUT_MINUTES));
            user.setStatus(UserStatus.LOCKED);
            log.warn("Account locked due to {} failed attempts: {}", MAX_FAILED_ATTEMPTS, user.getEmail());
        }
        userRepository.save(user);
    }

    private AuthResponse generateTokens(User user) {
        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRoles());

        RefreshToken refreshToken = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .user(user)
                .expiresAt(LocalDateTime.now().plusSeconds(refreshTokenExpiration / 1000))
                .revoked(false)
                .build();
        refreshTokenRepository.save(refreshToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .tokenType("Bearer")
                .expiresIn(900)
                .userId(user.getId())
                .roles(user.getRoles().stream().map(Enum::name).collect(java.util.stream.Collectors.toSet()))
                .build();
    }
}
