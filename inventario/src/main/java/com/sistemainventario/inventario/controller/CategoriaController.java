package com.sistemainventario.inventario.controller;

import com.sistemainventario.inventario.model.Categoria;
import com.sistemainventario.inventario.service.CategoriaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Indica que esta clase maneja peticiones HTTP y devuelve JSON
@RequestMapping("/api/categorias") // La URL base: http://localhost:8080/api/categorias
@CrossOrigin(origins = "*") // IMPORTANTE: Permite que Angular (puerto 4200) consuma esta API
public class CategoriaController {

    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    // 1. Obtener todas las categorías
    // GET http://localhost:8080/api/categorias
    @GetMapping
    public List<Categoria> listarCategorias() {
        return categoriaService.listarCategorias();
    }

    // 2. Crear una nueva categoría
    // POST http://localhost:8080/api/categorias
    @PostMapping
    public Categoria guardarCategoria(@RequestBody Categoria categoria) {
        // @RequestBody convierte el JSON que envías en Postman a un objeto Java
        return categoriaService.guardarCategoria(categoria);
    }

    // 3. Eliminar una categoría
    // DELETE http://localhost:8080/api/categorias/1
    @DeleteMapping("/{id}")
    public void eliminarCategoria(@PathVariable Integer id) {
        categoriaService.eliminarCategoria(id);
    }
}
