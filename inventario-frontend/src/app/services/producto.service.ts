import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto, ProductoRegistroDTO } from '../models/producto';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/productos';

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  buscarPorNombre(nombre: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/buscar?nombre=${nombre}`);
  }

  // Enviamos el DTO al @PostMapping del Controller
  createProducto(dto: ProductoRegistroDTO): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, dto);
  }

  deleteProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
}
