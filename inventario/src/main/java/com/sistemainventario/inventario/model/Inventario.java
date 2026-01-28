package com.sistemainventario.inventario.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "inventario")
public class Inventario {
    @EmbeddedId // <-- Usamos el ID Compuesto
    private InventarioId id;

    @Column(name = "cantidad_actual", nullable = false)
    private Integer cantidad_actual;

    // --- Mapeo de las relaciones que forman el ID ---

    @ManyToOne(fetch = FetchType.EAGER)
    @MapsId("idProducto") // <-- Mapea la parte 'idProducto' del @EmbeddedId
    @JoinColumn(name = "idproducto")
    private Producto producto;

    @ManyToOne(fetch = FetchType.EAGER)
    @MapsId("idBodega") // <-- Mapea la parte 'idBodega' del @EmbeddedId
    @JoinColumn(name = "idbodega")
    private Bodega bodega;
}
