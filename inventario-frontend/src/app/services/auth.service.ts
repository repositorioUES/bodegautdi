import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/auth`;

  isAuthenticated = signal<boolean>(!!this.getToken());

  login(nombreusuario: string, passwordusuario: string) {
    // Enviamos las credenciales tal como las espera AuthController Java
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { 
      nombreusuario, 
      passwordusuario 
    }).pipe(
      tap(response => {
        // 1. Guardamos el token en el navegador
        localStorage.setItem('token', response.token);
        
        // 2. Actualizamos el estado de la app
        this.isAuthenticated.set(true);
        
        // 3. Redirigimos al inventario o dashboard
        this.router.navigate(['/dashboard']); 
      })
    );
  }

  // Método para obtener el nombre de usuario desde el Token JWT
  getUsuarioActual(): string {
    const token = this.getToken();
    if (!token) return 'Usuario'; // Valor por defecto

    try {
      // El token tiene 3 partes separadas por puntos. La segunda es el Payload.
      const payload = token.split('.')[1];
      // Decodificamos Base64 a texto y luego a JSON
      const decoded = JSON.parse(atob(payload));
      
      // En Spring Security, el usuario suele venir en el campo 'sub' (Subject)
      return decoded.sub || 'Usuario';
    } catch (e) {
      console.error('Error decodificando token', e);
      return 'Usuario';
    }
  }

  // Método para obtener el ID de usuario desde el Token JWT
  getIdUsuarioActual() : number {
    const token = this.getToken();
    if (!token) return 0;

    try{
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));

      return decoded.idUsuario || 0;
    }catch(e){
      console.error('Error decodificando token', e);
      return 0;
    }


  }
  

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Método simple para verificar si hay sesión
  isLoggedIn(): boolean {
    return !!this.getToken(); 
  }

}
