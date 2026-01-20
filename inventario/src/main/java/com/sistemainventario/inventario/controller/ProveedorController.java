package com.sistemainventario.inventario.controller;

import com.sistemainventario.inventario.model.Proveedor;
import com.sistemainventario.inventario.service.ProveedorService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Indica que esta clase maneja peticiones HTTP y devuelve JSON
@RequestMapping("/api/proveedores") // La URL base: http://localhost:8080/api/proveedores
@CrossOrigin(origins = "*")
public class ProveedorController {

    private final ProveedorService proveedorService;

    public ProveedorController(ProveedorService proveedorService) {
        this.proveedorService = proveedorService;
    }

    @GetMapping
    public List<Proveedor> listarProveedores() {
        return proveedorService.listarProveedores();
    }

    @PostMapping
    public Proveedor guardarProveedor(@RequestBody Proveedor proveedor) {
        return  proveedorService.guardarProveedor(proveedor);
    }

    @DeleteMapping("/{id}")
    public void eliminarProveedor(@PathVariable Integer id) {
        proveedorService.eliminarProveedor(id);
    }

}
