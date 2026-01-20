package com.sistemainventario.inventario.controller;

import com.sistemainventario.inventario.model.UnidadMedida;
import com.sistemainventario.inventario.service.UnidadMedidaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Indica que esta clase maneja peticiones HTTP y devuelve JSON
@RequestMapping("/api/unidades") // La URL base: http://localhost:8080/api/unidades
@CrossOrigin(origins = "*")
public class UnidadMedidaController {

    private final UnidadMedidaService unidadMedidaService;

    public UnidadMedidaController(UnidadMedidaService unidadMedidaService) {
        this.unidadMedidaService = unidadMedidaService;
    }

    @GetMapping
    public List<UnidadMedida> listarUnidadesMedidas() {
        return unidadMedidaService.listarUnidadesMedidas();
    }

    @PostMapping
    public UnidadMedida guardarUnidadMedida(@RequestBody UnidadMedida unidadMedida) {
        return unidadMedidaService.guardarUnidadMedida(unidadMedida);
    }
}
