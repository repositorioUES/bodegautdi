package com.sistemainventario.inventario.model;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "usuario_permiso_bodega")
public class UsuarioPermisoBodega {
    @EmbeddedId // <-- Le dice a JPA que usamos un ID Compuesto "incrustado"
    private UsuarioPermisoBodegaId id;

    // --- Mapeo de las relaciones que forman el ID ---

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idUsuario") // <-- Mapea la parte 'idUsuario' del @EmbeddedId
    @JoinColumn(name = "idusuario")
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idBodega") // <-- Mapea la parte 'idBodega' del @EmbeddedId
    @JoinColumn(name = "idbodega")
    private Bodega bodega;
}
