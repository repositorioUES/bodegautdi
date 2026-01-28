package com.sistemainventario.inventario.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sistemainventario.inventario.model.Bodega;
import com.sistemainventario.inventario.model.Inventario;
import com.sistemainventario.inventario.service.InventarioService;

@RestController
@RequestMapping("/api/inventario")
@CrossOrigin(origins = "*")
public class InventarioController {
    private final InventarioService inventarioService;

    public InventarioController(InventarioService inventarioService) {
        this.inventarioService = inventarioService;
    }

    @GetMapping("/bodegas")
    public ResponseEntity<List<Bodega>> listarBodegas() {
        return ResponseEntity.ok(inventarioService.listarTodasLasBodegas());
    }

    @GetMapping("/bodega/{idBodega}")
    public ResponseEntity<List<Inventario>> listarProductosPorBodega(@PathVariable Integer idBodega) {
        List<Inventario> stock = inventarioService.listarInventarioPorBodega(idBodega);
        return ResponseEntity.ok(stock);
    }
}
