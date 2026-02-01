package com.sistemainventario.inventario.dto;

import lombok.Data;

@Data
public class DashboardDTO {
    private long pendientes;
    private long aprobadas;
    private long recepcionadas;
    private long totalBodegas;
    
}
