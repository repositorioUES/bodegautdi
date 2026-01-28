import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bodega } from '../models/bodega';

@Injectable({
  providedIn: 'root',
})
export class InventarioService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/inventario`;

  constructor() {}

  listarBodegas() : Observable<Bodega[]>{
    return this.http.get<Bodega[]>(`${this.apiUrl}/bodegas`);
  }

  listarInventarioPorBodega(idBodega: number) : Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}/bodega/${idBodega}`);
  }

}
