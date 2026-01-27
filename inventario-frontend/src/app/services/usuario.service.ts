import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario, UsuarioRegistroDTO } from '../models/usuario';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/usuarios`;

  listarUsuarios() : Observable<Usuario[]>{
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  registrarUsuario(dto: UsuarioRegistroDTO): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, dto);
  }

  
}
