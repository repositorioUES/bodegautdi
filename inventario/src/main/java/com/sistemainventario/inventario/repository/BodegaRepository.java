package com.sistemainventario.inventario.repository;

import com.sistemainventario.inventario.model.Bodega;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BodegaRepository extends JpaRepository<Bodega, Integer>{

}
