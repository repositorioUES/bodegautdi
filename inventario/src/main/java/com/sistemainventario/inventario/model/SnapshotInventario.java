package com.sistemainventario.inventario.model;
import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

@Data
@Entity
@Table(name = "snapshot_inventario")
public class SnapshotInventario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idsnapshot")
    private Long idSnapshot; // BIGINT

    @Column(name = "fechasnapshot", nullable = false)
    private Instant fechasnapshot;

    @Column(name = "cantidadactual", nullable = false)
    private Integer cantidadactual;

    // --- Relaciones (FKs) ---
    // Nota: El 'ON DELETE SET NULL' de la BD se maneja a nivel de base de datos,
    // pero JPA sabrá que estas columnas pueden ser nulas.

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idproducto") // nullable = true (por defecto)
    private Producto producto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idbodega") // nullable = true (por defecto)
    private Bodega bodega;

    // Setea la fecha automáticamente al crear
    @PrePersist
    protected void onCreate() {
        if (this.fechasnapshot == null) {
            this.fechasnapshot = Instant.now();
        }
    }
}
