package com.farmercustomer.userservice.controller;

import com.farmercustomer.userservice.config.JwtUtil;
import com.farmercustomer.userservice.dto.AuthRequest;
import com.farmercustomer.userservice.dto.AuthResponse;
import com.farmercustomer.userservice.entity.User;
import com.farmercustomer.userservice.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private UserController userController;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setPassword("password");
        user.setEmail("test@example.com");
        user.setRole("FARMER");
        user.setFullName("Test User");
    }

    @Test
    void register_Success() {
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.empty());
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("hashed_password");
        when(userRepository.save(any(User.class))).thenReturn(user);

        ResponseEntity<?> response = userController.register(user);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(user, response.getBody());
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void register_UsernameExists() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        ResponseEntity<?> response = userController.register(user);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Username already exists", response.getBody());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void register_EmailExists() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        ResponseEntity<?> response = userController.register(user);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Email already exists", response.getBody());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_Success() {
        AuthRequest req = new AuthRequest();
        req.setUsername("testuser");
        req.setPassword("password");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password", "password")).thenReturn(true);
        when(jwtUtil.generateToken("testuser", "FARMER", 1L)).thenReturn("mock_token");

        ResponseEntity<?> response = userController.login(req);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        AuthResponse authRes = (AuthResponse) response.getBody();
        assertNotNull(authRes);
        assertEquals("mock_token", authRes.getToken());
        assertEquals("testuser", authRes.getUsername());
    }

    @Test
    void login_Failure_UserNotFound() {
        AuthRequest req = new AuthRequest();
        req.setUsername("wronguser");
        req.setPassword("password");

        when(userRepository.findByUsername("wronguser")).thenReturn(Optional.empty());

        ResponseEntity<?> response = userController.login(req);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Invalid credentials", response.getBody());
    }

    @Test
    void login_Failure_PasswordMismatch() {
        AuthRequest req = new AuthRequest();
        req.setUsername("testuser");
        req.setPassword("wrongpassword");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongpassword", "password")).thenReturn(false);

        ResponseEntity<?> response = userController.login(req);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Invalid credentials", response.getBody());
    }

    @Test
    void validateToken_Success() {
        when(jwtUtil.validateToken("valid_token")).thenReturn(true);
        when(jwtUtil.extractUsername("valid_token")).thenReturn("testuser");
        when(jwtUtil.extractRole("valid_token")).thenReturn("FARMER");
        when(jwtUtil.extractUserId("valid_token")).thenReturn(1L);

        ResponseEntity<?> response = userController.validateToken("valid_token");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<String, Object> claims = (Map<String, Object>) response.getBody();
        assertNotNull(claims);
        assertEquals(true, claims.get("valid"));
        assertEquals("testuser", claims.get("username"));
    }

    @Test
    void validateToken_Failure() {
        when(jwtUtil.validateToken("invalid_token")).thenReturn(false);

        ResponseEntity<?> response = userController.validateToken("invalid_token");

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Invalid or expired token", response.getBody());
    }

    @Test
    void getAllUsers_Success() {
        when(userRepository.findAll()).thenReturn(List.of(user));

        ResponseEntity<List<User>> response = userController.getAllUsers();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
    }
}
