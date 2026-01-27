package com.sistemainventario.inventario.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "usuario")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idusuario")
    private Integer idUsuario;

    @Column(name = "nombreusuario", nullable = false, unique = true, length = 100)
    private String nombreusuario;

    @Column(name = "passwordusuario", nullable = false, length = 255)
    @JsonIgnore
    private String passwordusuario;

    // --- Relación con Rol ---
    // Muchos Usuarios pueden tener un Rol
    @ManyToOne(fetch = FetchType.EAGER) // 'EAGER' carga el ROL siempre
    @JoinColumn(name = "idrol", nullable = false) // 'idRol' es la columna FK en la tabla USUARIO
    private Rol rol;

    public Integer getIdUsuario() {
        return this.idUsuario;
    }

    public String getNombreusuario() {
        return this.nombreusuario;
    }

    public String getPasswordusuario() {
        return this.passwordusuario;
    }

    public Rol getRol() {
        return this.rol;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public void setNombreusuario(String nombreusuario) {
        this.nombreusuario = nombreusuario;
    }

    public void setPasswordusuario(String passwordusuario) {
        this.passwordusuario = passwordusuario;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }


}
