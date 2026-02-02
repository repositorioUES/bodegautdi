package com.sistemainventario.inventario.controller;

import com.sistemainventario.inventario.model.Usuario;
import com.sistemainventario.inventario.security.JwtService;
import com.sistemainventario.inventario.service.UsuarioService;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final UsuarioService usuarioService;

    public AuthController(AuthenticationManager authenticationManager, UserDetailsService userDetailsService, JwtService jwtService, UsuarioService usuarioService) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
        this.usuarioService = usuarioService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getNombreusuario(), request.getPasswordusuario())
            );

            UserDetails user = userDetailsService.loadUserByUsername(request.getNombreusuario());

            Usuario usuarioCompleto = usuarioService.buscarPorNombreDeUsuario(request.getNombreusuario())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            Map<String, Object> extraClaims = new HashMap<>();
            extraClaims.put("idUsuario", usuarioCompleto.getIdUsuario());

            if (usuarioCompleto.getRol() != null) {
                extraClaims.put("rol", usuarioCompleto.getRol().getNombrerol()); 
            }

            String token = jwtService.generateToken(extraClaims, user);

            return ResponseEntity.ok(new AuthResponse(token));

        } catch (BadCredentialsException e) {
            // Capturamos el error de credenciales
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("mensaje", "Usuario o contraseña incorrectos");
            errorResponse.put("error", "Bad Credentials");
            
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
        } catch (Exception e) {
            // Capturamos cualquier otro error inesperado
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("mensaje", "Error interno del servidor");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

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