package com.sistemainventario.inventario.service;

import com.sistemainventario.inventario.model.*;
import com.sistemainventario.inventario.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class SolicitudCompraService {

    private final SolicitudCompraRepository solicitudCompraRepository;
    private final SolicitudCompraDetalleRepository solicitudCompraDetalleRepository;
    private final InventarioService inventarioService;
    private final UsuarioRepository usuarioRepository;
    private final BodegaRepository bodegaRepository;
    private final ProductoRepository productoRepository;

    public SolicitudCompraService(SolicitudCompraRepository solicitudCompraRepository,
                                  SolicitudCompraDetalleRepository solicitudCompraDetalleRepository,
                                  InventarioService inventarioService,
                                  UsuarioRepository usuarioRepository,
                                  BodegaRepository bodegaRepository,
                                  ProductoRepository productoRepository){
        this.solicitudCompraRepository = solicitudCompraRepository;
        this.solicitudCompraDetalleRepository = solicitudCompraDetalleRepository;
        this.inventarioService = inventarioService;
        this.usuarioRepository = usuarioRepository;
        this.bodegaRepository = bodegaRepository;
        this.productoRepository = productoRepository;
    }

    //CREANDO LA SOLICITUD DE COMPRA
    @Transactional
    public SolicitudCompra crearSolicitudCompra(Integer idUsuarioSolicitante, Integer idBodegaDestino ){
        Usuario usuario = usuarioRepository.findById(idUsuarioSolicitante)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Bodega bodega = bodegaRepository.findById(idBodegaDestino)
                .orElseThrow(() -> new RuntimeException("Bodega no encontrada"));

        SolicitudCompra solicitudCompra = new SolicitudCompra();
        solicitudCompra.setIdusuariosolicitante(usuario);
        solicitudCompra.setIdbodegadestino(bodega);

        return solicitudCompraRepository.save(solicitudCompra);
    }

    //AGREGAR PRODUCTOS A LA SOLICITUD
    @Transactional
    public void agregarProductosASolicitudCompra(Long idSolicitudCompra, Integer idProducto, Integer cantidad) {
        SolicitudCompra solicitudCompra = solicitudCompraRepository.findById(idSolicitudCompra)
                .orElseThrow(() -> new RuntimeException("Solicitud compra no encontrada"));

        if(!"PENDIENTE".equals(solicitudCompra.getEstado())){
            throw new RuntimeException("No se pueden agregar  productos a esta solicitud");
        }

        Producto producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        SolicitudCompraDetalle solicitudCompraDetalle = new SolicitudCompraDetalle();
        solicitudCompraDetalle.setSolicitudCompra( solicitudCompra);
        solicitudCompraDetalle.setProducto(producto);
        solicitudCompraDetalle.setCantidad_solicitada(cantidad);

        solicitudCompraDetalleRepository.save(solicitudCompraDetalle);
    }

    //APROBACION DE UNA SOLICITUD DE COMPRA
    @Transactional
    public void aprobarSolicitudCompra(Long idSolicitudCompra){
        SolicitudCompra solicitudCompra = solicitudCompraRepository.findById(idSolicitudCompra)
                .orElseThrow(() -> new RuntimeException("Solicitud compra no encontrada"));
        solicitudCompra.setEstado("APROBADA");
        solicitudCompraRepository.save(solicitudCompra);
    }

    //RECEPCION DE LA SOLICITUD DE COMPRA ACA PASA A ESTADO RECEPCIONADA Y SE ACTUALIZA EL STOCK
    @Transactional
    public void recepcionarSolicitudCompra(Long idSolicitudCompra, Integer idUsuarioComprador){
        SolicitudCompra solicitudCompra = solicitudCompraRepository.findById(idSolicitudCompra)
                .orElseThrow(() -> new RuntimeException("Solicitud compra no encontrada"));

        if("RECEPCIONADA".equals(solicitudCompra.getEstado())){
            throw new RuntimeException("Solicitud ya fue comprada");
        }

        //BUSCO EL DETALLE DE LA SOLICITUD DE COMPRA
        List<SolicitudCompraDetalle> solicitudCompraDetalles = solicitudCompraDetalleRepository.findBySolicitudCompra(solicitudCompra);

        //RECORREMOS SOBRE CADA PRODCUCTO EN LA SOLICITUD PARA AGREGARLO AL INVENTARIO
        for(SolicitudCompraDetalle solicitudCompraDetalle : solicitudCompraDetalles){
            inventarioService.registrarMovimiento(
                    solicitudCompraDetalle.getProducto().getIdProducto(),
                    solicitudCompra.getIdbodegadestino().getIdBodega(),
                    "ENTRADA",
                    solicitudCompraDetalle.getCantidad_solicitada(),
                    idUsuarioComprador,
                    "Recepcion de Solicitu de Compra #" + solicitudCompra.getIdSolicitudCompra()
            );
        }

        solicitudCompra.setEstado("RECEPCIONADA");
        solicitudCompraRepository.save(solicitudCompra);

    }

}
