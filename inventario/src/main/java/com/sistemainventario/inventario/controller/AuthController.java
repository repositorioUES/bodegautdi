package com.sistemainventario.inventario.controller;

import com.sistemainventario.inventario.security.JwtService;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;

    public AuthController(AuthenticationManager authenticationManager, UserDetailsService userDetailsService, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        // Esto autentica contra la base de datos automáticamente
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getNombreusuario(), request.getPasswordusuario())
        );

        // Si llega aquí, las credenciales son correctas
        UserDetails user = userDetailsService.loadUserByUsername(request.getNombreusuario());
        String token = jwtService.generateToken(user);

        return ResponseEntity.ok(new AuthResponse(token));
    }

        // DTOs internos
        @Data
        public static class LoginRequest {
            private String nombreusuario;
            private String passwordusuario;
        }
    
        @Data
        public static class AuthResponse {
            private String token;
            public AuthResponse(String token) { this.token = token; }
        }

}
