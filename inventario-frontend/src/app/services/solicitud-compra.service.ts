import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SolicitudCompra, SolicitudDTO, DetalleSolicitudDTO, SolicitudCompraDetalle } from '../models/solicitud-compra';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SolicitudCompraService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/solicitudes-compra`;

  // Obtener todas
  listar(): Observable<SolicitudCompra[]> {
    return this.http.get<SolicitudCompra[]>(this.apiUrl);
  }

  // Obtener detalles de una solicitud
  listarDetalles(id: number): Observable<SolicitudCompraDetalle[]> {
    return this.http.get<SolicitudCompraDetalle[]>(`${this.apiUrl}/${id}/detalles`);
  }

  // 1. Crear Cabecera
  crearSolicitud(dto: SolicitudDTO): Observable<SolicitudCompra> {
    return this.http.post<SolicitudCompra>(this.apiUrl, dto);
  }

  // 2. Agregar Producto (Se llama por cada fila del detalle)
  agregarProducto(idSolicitud: number, detalle: DetalleSolicitudDTO): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${idSolicitud}/productos`, detalle);
  }
  
  // Aprobar
  aprobar(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/aprobar`, {});
  }
  
}
