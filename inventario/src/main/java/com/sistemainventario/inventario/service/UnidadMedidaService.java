package com.sistemainventario.inventario.service;

import com.sistemainventario.inventario.model.UnidadMedida;
import com.sistemainventario.inventario.repository.UnidadMedidaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class UnidadMedidaService {

    private final UnidadMedidaRepository unidadMedidaRepository;

    public UnidadMedidaService(UnidadMedidaRepository unidadMedidaRepository) {
        this.unidadMedidaRepository = unidadMedidaRepository;
    }

    public List<UnidadMedida> listarUnidadesMedidas() {
        return unidadMedidaRepository.findAll();
    }

    public Optional<UnidadMedida> obtenerUnidadMedidaPorId(Integer id) {
        return unidadMedidaRepository.findById(id);
    }

    @Transactional
    public UnidadMedida guardarUnidadMedida(UnidadMedida unidad) {
        return unidadMedidaRepository.save(unidad);
    }

    @Transactional
    public void eliminarUnidadMedida(Integer id) {
        unidadMedidaRepository.deleteById(id);
    }
}
