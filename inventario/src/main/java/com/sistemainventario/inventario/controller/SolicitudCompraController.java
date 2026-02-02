package com.sistemainventario.inventario.controller;

import com.sistemainventario.inventario.model.SolicitudCompra;
import com.sistemainventario.inventario.model.SolicitudCompraDetalle;
import com.sistemainventario.inventario.service.SolicitudCompraService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitudes-compra")
@CrossOrigin(origins = "*")
public class SolicitudCompraController {

    private final SolicitudCompraService solicitudCompraService;

    public SolicitudCompraController(SolicitudCompraService solicitudCompraService) {
        this.solicitudCompraService = solicitudCompraService;
    }

    // 1. CREAR UNA NUEVA SOLICITUD (CABECERA)
    @PostMapping
    public ResponseEntity<SolicitudCompra> crearSolicitud(@RequestBody SolicitudDTO dto) {
        SolicitudCompra nuevaSolicitud = solicitudCompraService.crearSolicitudCompra(
                dto.nombresolicitud,
                dto.idUsuarioSolicitante,
                dto.idBodegaDestino
        );
        return ResponseEntity.ok(nuevaSolicitud);
    }

    // 2. AGREGAR UN PRODUCTO A LA SOLICITUD (DETALLE)
    @PostMapping("/{idSolicitud}/productos")
    public ResponseEntity<Void> agregarProducto(@PathVariable Long idSolicitud,@RequestBody DetalleSolicitudDTO detalleDTO) {
        
        solicitudCompraService.agregarProductosASolicitudCompra(
                idSolicitud,
                detalleDTO.idProducto,
                detalleDTO.cantidad
        );
        return ResponseEntity.ok().build();
    }

    // 3. APROBAR LA SOLICITUD
    @PutMapping("/{idSolicitud}/aprobar")
    public ResponseEntity<Void> aprobarSolicitud(@PathVariable Long idSolicitud) {
        solicitudCompraService.aprobarSolicitudCompra(idSolicitud);
        return ResponseEntity.ok().build();
    }

    // 4. RECEPCIONAR LA SOLICITUD (ENTRADA DE STOCK)
    @PutMapping("/{idSolicitud}/recepcionar")
    public ResponseEntity<Void> recepcionarSolicitud(@PathVariable Long idSolicitud,@RequestBody RecepcionDTO recepcionDTO) {
        
        solicitudCompraService.recepcionarSolicitudCompra(
                idSolicitud,
                recepcionDTO.idUsuarioComprador
        );
        return ResponseEntity.ok().build();
    }

    // LISTADO DE SOLICITUDES POR SU ESTADO
    @GetMapping
    public ResponseEntity<List<SolicitudCompra>> listarPorEstado(@RequestParam(required = false) String estado) {
        if (estado != null) {
            return ResponseEntity.ok(solicitudCompraService.listarPorEstado(estado)); 
        }
        return ResponseEntity.ok(solicitudCompraService.listarTodas()); 
    }

    // DETALLES DE LA SOLICITUD
    @GetMapping("/{id}/detalles")
    public ResponseEntity<List<SolicitudCompraDetalle>> obtenerDetalles(@PathVariable Long id) {
        return ResponseEntity.ok(solicitudCompraService.listarDetallesDeSolicitud(id));
    }


    // DTOs
    
    // Para crear la cabecera
    public static class SolicitudDTO {
        public String nombresolicitud;
        public Integer idUsuarioSolicitante;
        public Integer idBodegaDestino;
    }

    // Para agregar productos
    public static class DetalleSolicitudDTO {
        public Integer idProducto;
        public Integer cantidad;
    }

    // Para recepcionar (necesitamos saber quién recibe)
    public static class RecepcionDTO {
        public Integer idUsuarioComprador;
    }
    
}
