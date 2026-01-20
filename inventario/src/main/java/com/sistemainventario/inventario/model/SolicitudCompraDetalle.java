package com.sistemainventario.inventario.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "solicitud_compra_detalle")
public class SolicitudCompraDetalle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idsolicituddetalle")
    private Long idSolicitudDetalle; // Usamos Long para BIGINT

    @Column(name = "cantidad_solicitada", nullable = false)
    private Integer cantidad_solicitada;

    // --- Relaciones ---

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idsolicitudcompra", nullable = false)
    private SolicitudCompra solicitudCompra; // El "padre" o "cabecera"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idproducto", nullable = false)
    private Producto producto; // El producto que se pide
}
