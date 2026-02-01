package com.sistemainventario.inventario.controller;

import com.sistemainventario.inventario.model.Usuario;
import com.sistemainventario.inventario.service.UsuarioService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios") 
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

    @PostMapping
    public Usuario guardar(@RequestBody UsuarioRegistroDTO registroDTO) {

        Usuario usuario = new Usuario();
        usuario.setNombreusuario(registroDTO.nombreusuario);
        usuario.setPasswordusuario(registroDTO.passwordusuario); 

        return usuarioService.registrarUsuario(usuario, registroDTO.idrol);
    }

    public static class UsuarioRegistroDTO {
        public String nombreusuario;
        public String passwordusuario;
        public Integer idrol;
    }
}
