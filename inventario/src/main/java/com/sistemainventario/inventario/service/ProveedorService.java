package com.sistemainventario.inventario.service;

import com.sistemainventario.inventario.model.Proveedor;
import com.sistemainventario.inventario.repository.ProveedorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProveedorService {

    private final ProveedorRepository proveedorRepository;

    public ProveedorService(ProveedorRepository proveedorRepository) {
        this.proveedorRepository = proveedorRepository;
    }

    public List<Proveedor> listarProveedores(){
        return proveedorRepository.findAll();
    }

    public Optional<Proveedor> obtenerProveedorPorId(Integer id) {
        return proveedorRepository.findById(id);
    }

    @Transactional
    public Proveedor guardarProveedor(Proveedor proveedor){
        return proveedorRepository.save(proveedor);
    }

    @Transactional
    public void eliminarProveedor(Integer idProveedor){
        proveedorRepository.deleteById(idProveedor);
    }

}
