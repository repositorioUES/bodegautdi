import { Injectable,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UnidadMedida } from '../models/unidades-medidas';

@Injectable({
  providedIn: 'root',
})
export class UnidadMedidaService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/unidades';

  getUnidadesMedida(): Observable<UnidadMedida[]> {
    return this.http.get<UnidadMedida[]>(this.apiUrl);
  }

  // Guardar (POST)
  createUnidadMedida(unidadmedida: UnidadMedida): Observable<UnidadMedida> {
    return this.http.post<UnidadMedida>(this.apiUrl, unidadmedida);
  }

  // Eliminar (DELETE)
  deleteUnidadMedida(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
}
