package com.sistemainventario.inventario.service;

import com.sistemainventario.inventario.model.Usuario;
import com.sistemainventario.inventario.model.Rol;
import com.sistemainventario.inventario.repository.UsuarioRepository;
import com.sistemainventario.inventario.repository.RolRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    //INICIALIZACION DE VARIABLES
    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;

    //CONSTRUCTOR
    public UsuarioService(UsuarioRepository usuarioRepository,
                          RolRepository rolRepository,
                          PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
    }

    //METODO PARA LISTAR TODOS LOS USUARIOS
    public List<Usuario> listarUsuarios(){
        return usuarioRepository.findAll();
    }

    //METODO PARA BUSCAR UN USUARIO POR SU NOMBRE
    public Optional<Usuario> buscarPorNombreDeUsuario(String nombreusuario){
        return usuarioRepository.findBynombreusuario(nombreusuario);
    }

    //METODO PARA GUARDAR UN USUARIO
    @Transactional
    public Usuario registrarUsuario(Usuario usuario, Integer idRol){
        Rol rol = rolRepository.findById(idRol)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

        usuario.setRol(rol);

        String passwordEncriptada = passwordEncoder.encode(usuario.getPasswordusuario());
        usuario.setPasswordusuario(passwordEncriptada);

        return usuarioRepository.save(usuario);
    }

}
