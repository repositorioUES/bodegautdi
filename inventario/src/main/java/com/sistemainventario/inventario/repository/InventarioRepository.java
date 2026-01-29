package com.sistemainventario.inventario.repository;

import com.sistemainventario.inventario.model.Inventario;
import com.sistemainventario.inventario.model.InventarioId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InventarioRepository extends JpaRepository<Inventario,InventarioId>{

    @Query("SELECT i FROM Inventario i " +
           "JOIN FETCH i.producto p " +
           "LEFT JOIN FETCH p.categoria " + 
           "WHERE i.bodega.idBodega = :idBodega")
    List<Inventario> findByBodega_IdBodega(Integer idBodega);
    
    List<Inventario> findByIdIdBodega(Integer idBodega);

    List<Inventario> findByIdIdProducto(Integer idProducto);
}
