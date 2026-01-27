package com.sistemainventario.inventario.service;

import com.sistemainventario.inventario.model.*;
import com.sistemainventario.inventario.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;
// import java.util.List;

@Service
public class InventarioService {

    private final InventarioRepository inventarioRepository;
    private final MovimientoStockRepository movimientoStockRepository;
    private final ProductoRepository productoRepository;
    private final BodegaRepository bodegaRepository;
    private final UsuarioRepository usuarioRepository;

    public InventarioService(InventarioRepository inventarioRepository,
                             MovimientoStockRepository movimientoStockRepository,
                             ProductoRepository productoRepository,
                             BodegaRepository bodegaRepository,
                             UsuarioRepository usuarioRepository) {
        this.inventarioRepository = inventarioRepository;
        this.movimientoStockRepository = movimientoStockRepository;
        this.productoRepository = productoRepository;
        this.bodegaRepository = bodegaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    //METODO PARA REGUISTRAR CAMBIOS EN EL STOCK
    @Transactional
    public void registrarMovimiento(Integer idProducto, Integer idBodega, String tipo, Integer cantidad, Integer idUsuario, String motivo){

        Producto producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        Bodega bodega = bodegaRepository.findById(idBodega)
                .orElseThrow(() -> new RuntimeException("Bodega no encontrado"));
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        //REGISTRAR EL MOVIMIENTO EN EL KARDEX
        MovimientoStock movimiento = new MovimientoStock();
        movimiento.setProducto(producto);
        movimiento.setBodega(bodega);
        movimiento.setUsuario(usuario);
        movimiento.setTipo(tipo);
        movimiento.setCantidad(cantidad);
        movimiento.setMotivo(motivo);
        movimientoStockRepository.save(movimiento);

        //ACTUALIZAR EL INVENTARIO
        InventarioId inventarioId = new InventarioId();
        inventarioId.setIdProducto(idProducto);
        inventarioId.setIdBodega(idBodega);

        //SE BUSCA SI YA EXISTE EL REGISTRO DE ESE PRODUCTO EN LA BODEGA
        Optional<Inventario> inventarioOpt = inventarioRepository.findById(inventarioId);
        Inventario inventario;

        if(inventarioOpt.isPresent()){
            inventario = inventarioOpt.get();
        }else{
            inventario = new Inventario();
            inventario.setId(inventarioId);
            inventario.setProducto(producto);
            inventario.setBodega(bodega);
            inventario.setCantidad_actual(0);
        }

        //CALCULAR LA NUEVA CANTIDAD SEGUN EL TIPO DE MOVIMIENTO
        int nuevaCantidad = inventario.getCantidad_actual();
        if("ENTRADA".equals(tipo)){
            nuevaCantidad += cantidad;
        }else if("SALIDA".equals(tipo)){
            if(nuevaCantidad < cantidad){
                throw new RuntimeException("No hay suficiente STOCK para realizar la salida");
            }
            nuevaCantidad -= cantidad;
        }else if("AJUSTE".equals(tipo)){
            nuevaCantidad += cantidad;
        }

        inventario.setCantidad_actual(nuevaCantidad);
        inventarioRepository.save(inventario);
    }
}
