package com.sistemainventario.inventario.controller;

import com.sistemainventario.inventario.model.Bodega;
import com.sistemainventario.inventario.service.BodegaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Indica que esta clase maneja peticiones HTTP y devuelve JSON
@RequestMapping("/api/bodegas") // La URL base: http://localhost:8080/api/bodegas
@CrossOrigin(origins = "*")
public class BodegaController {

    private final BodegaService bodegaService;

    public BodegaController(BodegaService bodegaService) {
        this.bodegaService = bodegaService;
    }

    @GetMapping
    public List<Bodega> listarBodegas() {
        return bodegaService.listarBodegas();
    }

    @PostMapping
    public Bodega guardarBodega(@RequestBody Bodega bodega){
        return bodegaService.guardarBodega(bodega);
    }

    @DeleteMapping
    public void eliminarBodega(@RequestBody Integer id){
        bodegaService.eliminarBodega(id);
    }
}
