package com.sistemainventario.inventario.controller;

import com.sistemainventario.inventario.model.Usuario;
import com.sistemainventario.inventario.service.UsuarioService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Indica que esta clase maneja peticiones HTTP y devuelve JSON
@RequestMapping("/api/usuarios") // La URL base: http://localhost:8080/api/usuarios
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public List<Usuario> listarUsuarios() {
        return usuarioService.listarUsuarios();
    }

    /**
     * Endpoint para registrar usuario.
     * Recibe un objeto simple (DTO) con el ID del rol, no el objeto Rol completo.
     */
    @PostMapping
    public Usuario guardar(@RequestBody UsuarioRegistroDTO registroDTO) {
        // Creamos la entidad Usuario básica
        Usuario usuario = new Usuario();
        usuario.setNombreusuario(registroDTO.nombreusuario);
        usuario.setPasswordusuario(registroDTO.passwordusuario); // Recuerda: Aquí iría la encriptación

        // Llamamos al servicio pasando el ID del rol para que él haga la búsqueda y asignación
        return usuarioService.registrarUsuario(usuario, registroDTO.idrol);
    }

    // --- DTO: Clase auxiliar para recibir los datos del JSON limpiamente ---
    // (Solo existe para facilitar la comunicación Controller <-> Postman)
    public static class UsuarioRegistroDTO {
        public String nombreusuario;
        public String passwordusuario;
        public Integer idrol;
    }
}
