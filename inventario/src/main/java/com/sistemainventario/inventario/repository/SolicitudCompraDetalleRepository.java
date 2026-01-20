package com.sistemainventario.inventario.repository;

import com.sistemainventario.inventario.model.SolicitudCompra;
import com.sistemainventario.inventario.model.SolicitudCompraDetalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolicitudCompraDetalleRepository extends JpaRepository<SolicitudCompraDetalle, Long> {

    List<SolicitudCompraDetalle> findBySolicitudCompra(SolicitudCompra solicitudCompra);
}