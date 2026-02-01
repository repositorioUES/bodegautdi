package com.sistemainventario.inventario.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.sistemainventario.inventario.dto.DashboardDTO;
import com.sistemainventario.inventario.repository.BodegaRepository;
import com.sistemainventario.inventario.repository.SolicitudCompraRepository;

@Service
public class DashboardService {

    private final SolicitudCompraRepository solicitudCompraRepository;
    private final BodegaRepository bodegaRepository;

    public DashboardService(SolicitudCompraRepository solicitudCompraRepository, BodegaRepository bodegaRepository){
        this.solicitudCompraRepository = solicitudCompraRepository;
        this.bodegaRepository = bodegaRepository;
    }

    @Transactional(readOnly = true)
    public DashboardDTO getDatosDashboard(){
        DashboardDTO dashboardDTO = new DashboardDTO();

        dashboardDTO.setPendientes(solicitudCompraRepository.countByEstado("PENDIENTE"));
        dashboardDTO.setAprobadas(solicitudCompraRepository.countByEstado("APROBADA"));
        dashboardDTO.setRecepcionadas(solicitudCompraRepository.countByEstado("RECEPCIONADA"));
        dashboardDTO.setTotalBodegas(bodegaRepository.count());

        return dashboardDTO;
    }
    
}
