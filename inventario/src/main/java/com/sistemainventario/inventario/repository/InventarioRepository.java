package com.sistemainventario.inventario.repository;

import com.sistemainventario.inventario.model.Inventario;
import com.sistemainventario.inventario.model.InventarioId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InventarioRepository extends JpaRepository<Inventario,InventarioId>{

    List<Inventario> findByIdIdBodega(Integer idBodega);

    List<Inventario> findByIdIdProducto(Integer idProducto);
}
