package com.sistemainventario.inventario.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

@Data
@Entity
@Table(name = "movimiento_stock")
public class MovimientoStock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idmovimientostock")
    private Long idMovimientoStock; // BIGINT

    @Column(name = "fecha", nullable = false)
    private Instant fecha;

    @Column(name = "tipo", nullable = false, length = 10)
    private String tipo; // "ENTRADA", "SALIDA", "AJUSTE"

    @Column(name = "cantidad", nullable = false)
    private Integer cantidad;

    @Column(name = "motivo", length = 255)
    private String motivo;

    // --- Relaciones (FKs) ---

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idproducto", nullable = false)
    private Producto producto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idbodega", nullable = false)
    private Bodega bodega;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idusuario", nullable = false)
    private Usuario usuario; // El usuario que realizó el movimiento

    // Setea la fecha automáticamente al crear
    @PrePersist
    protected void onCreate() {
        if (this.fecha == null) {
            this.fecha = Instant.now();
        }
    }
}
