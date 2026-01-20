package com.sistemainventario.inventario.service;

import com.sistemainventario.inventario.model.Bodega;
import com.sistemainventario.inventario.repository.BodegaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class BodegaService {

    private final BodegaRepository bodegaRepository;

    public BodegaService(BodegaRepository bodegaRepository) {
        this.bodegaRepository = bodegaRepository;
    }

    public List<Bodega> listarBodegas(){
        return bodegaRepository.findAll();
    }

    public Optional<Bodega> buscarBodegaPorId(Integer id){
        return bodegaRepository.findById(id);
    }

    @Transactional
    public Bodega guardarBodega(Bodega bodega){
        return bodegaRepository.save(bodega);
    }

    @Transactional
    public void eliminarBodega(Integer id){
        bodegaRepository.deleteById(id);
    }

}
