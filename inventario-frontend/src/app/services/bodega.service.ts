import { Injectable,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bodega } from '../models/bodega';

@Injectable({
  providedIn: 'root',
})
export class BodegaService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/bodegas';

  getBodegas(): Observable<Bodega[]> {
    return this.http.get<Bodega[]>(this.apiUrl);
  }

  // Guardar (POST)
  createBodega(bodega: Bodega): Observable<Bodega> {
    return this.http.post<Bodega>(this.apiUrl, bodega);
  }

  // Eliminar (DELETE)
  deleteBodega(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
}
