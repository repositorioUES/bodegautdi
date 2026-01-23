package com.sistemainventario.inventario.controller;

import com.sistemainventario.inventario.model.*;
import com.sistemainventario.inventario.service.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.math.BigDecimal;
import java.util.Optional;

@RestController // Indica que esta clase maneja peticiones HTTP y devuelve JSON
@RequestMapping("/api/productos") // La URL base: http://localhost:8080/api/usuarios
@CrossOrigin(origins = "*")
public class ProductoController {

    private final ProductoService productoService;
    private final CategoriaService categoriaService;
    private final ProveedorService proveedorService;
    private final UnidadMedidaService unidadMedidaService;

    public ProductoController(ProductoService productoService,
                              CategoriaService categoriaService,
                              ProveedorService proveedorService,
                              UnidadMedidaService unidadMedidaService) {
        this.productoService = productoService;
        this.categoriaService = categoriaService;
        this.proveedorService = proveedorService;
        this.unidadMedidaService = unidadMedidaService;
    }

    @GetMapping
    public List<Producto>listarProductos(){
        return productoService.listarProductos();
    }

    @GetMapping("/{id}")
    public Optional<Producto> buscarProductoPorId(@PathVariable Integer id){
        return productoService.buscarProductoPorId(id);
    }

    @GetMapping("/buscar")
    public List<Producto> buscarProductos(@RequestParam String nombre) {
        return productoService.buscarPorNombre(nombre);
    }

    @PostMapping
    public Producto guardarProducto(@RequestBody ProductoRegistroDTO productoDTO){

        Categoria categoria = categoriaService.obtenerCategoriaPorId(productoDTO.idCategoria)
                .orElseThrow(() -> new RuntimeException("Categoria no encontrada"));

        Proveedor proveedor = proveedorService.obtenerProveedorPorId(productoDTO.idProveedor)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));

        UnidadMedida unidadMedida = unidadMedidaService.obtenerUnidadMedidaPorId(productoDTO.idUnidadMedida)
                .orElseThrow(() -> new RuntimeException("Unidad medida no encontrada"));

        //SE CREA EL OBJETO PRODUCTO
        Producto producto = new Producto();
        producto.setIdProducto(productoDTO.idProducto);
        producto.setNombreproducto(productoDTO.nombreproducto);
        producto.setSkuproducto(productoDTO.skuproducto);
        producto.setDescripcionproducto(productoDTO.descripcionproducto);
        producto.setPreciocostoproducto(productoDTO.preciocostoproducto);
        producto.setPrecioventaproducto(productoDTO.precioventaproducto);

        producto.setCategoria(categoria);
        producto.setProveedor(proveedor);
        producto.setUnidadMedida(unidadMedida);

        return productoService.guardarProducto(producto);
    }

    @DeleteMapping("/{id}")
    public void eliminarProducto(@PathVariable Integer id){
        productoService.eliminarProducto(id);
    }

    public static class ProductoRegistroDTO {
        public Integer idProducto; // Opcional, para editar
        public String nombreproducto;
        public String skuproducto;
        public String descripcionproducto;
        public BigDecimal preciocostoproducto;
        public BigDecimal precioventaproducto;
        public Integer idCategoria; // Solo recibimos el ID
        public Integer idProveedor; // Solo recibimos el ID
        public Integer idUnidadMedida; // Solo recibimos el ID
    }
}
