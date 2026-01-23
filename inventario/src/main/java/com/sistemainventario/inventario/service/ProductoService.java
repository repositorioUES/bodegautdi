package com.sistemainventario.inventario.service;

import com.sistemainventario.inventario.model.Producto;
import com.sistemainventario.inventario.repository.ProductoRepository;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    //INICIALIZACION DE LLAMADA A REPOSITORIO
    private final ProductoRepository productoRepository;

    //CONSTRUCTOR
    public ProductoService(ProductoRepository productoRepository){
        this.productoRepository = productoRepository;
    }

    public List<Producto> listarProductos(){
        return productoRepository.findAll(Sort.by(Sort.Direction.ASC, "categoria.idCategoria"));
    }

    public Optional<Producto> buscarProductoPorId(Integer id){
        return productoRepository.findById(id);
    }

    public List<Producto> buscarPorNombre(String nombre) {
        return productoRepository.findByNombreproductoContainingIgnoreCase(nombre);
    }

    @Transactional
    public Producto guardarProducto(Producto producto){
        if(producto.getIdProducto()==null){
            Optional<Producto> existente = productoRepository.findByskuproducto(producto.getSkuproducto());
            if(existente.isPresent()){
                throw new RuntimeException("Producto ya existente");
            }
        }
        return productoRepository.save(producto);
    }

    @Transactional
    public void eliminarProducto(Integer id){
        productoRepository.deleteById(id);
    }

}
