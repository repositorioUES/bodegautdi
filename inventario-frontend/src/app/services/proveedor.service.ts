import { Injectable,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proveedor } from '../models/proveedor';

@Injectable({
  providedIn: 'root',
})
export class ProveedorService {
  
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/proveedores'; // Ajusta tu puerto si es necesario

  getProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.apiUrl);
  }

  // Guardar (POST)
  createProveedor(proveedor: Proveedor): Observable<Proveedor> {
    return this.http.post<Proveedor>(this.apiUrl, proveedor);
  }

  // Eliminar (DELETE)
  deleteProveedor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // (Opcional) Actualizar si lo tuvieras implementado
  // updateProveedor...
}