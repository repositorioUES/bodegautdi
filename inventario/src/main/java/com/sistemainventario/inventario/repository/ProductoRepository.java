package com.sistemainventario.inventario.repository;

import com.sistemainventario.inventario.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer>{

    Optional<Producto> findByskuproducto(String skuproducto);

    Iterable<Producto> findByCategoria_IdCategoria(Integer idCategoria);
}
