package com.sistemainventario.inventario.service;

import com.sistemainventario.inventario.model.Categoria;
import com.sistemainventario.inventario.repository.CategoriaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public  CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    public List<Categoria> listarCategorias() {
        return categoriaRepository.findAll();
    }

    public Optional<Categoria> obtenerCategoriaPorId(Integer id) {
        return categoriaRepository.findById(id);
    }

    @Transactional
    public Categoria guardarCategoria(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    @Transactional
    public void eliminarCategoria(Integer idCategoria) {
        categoriaRepository.deleteById(idCategoria);
    }

}
