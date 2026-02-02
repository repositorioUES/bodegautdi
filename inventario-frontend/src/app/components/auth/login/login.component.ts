import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  loginForm = this.fb.group({
    nombreusuario: ['', [Validators.required]],
    passwordusuario: ['', [Validators.required]]
  });

  hidePassword = true;
  isLoading = false;
  
  onSubmit() {
    if (this.loginForm.valid) {
      
      // 1. Limpiamos basura anterior
      localStorage.removeItem('token'); 
      
      // 2. Bloqueamos el botón
      this.isLoading = true; 
      
      const { nombreusuario, passwordusuario } = this.loginForm.value;

      this.authService.login(nombreusuario!, passwordusuario!).subscribe({
        next: () => {
          // Si es exitoso, el servicio redirige.
          // No es necesario poner isLoading = false aquí porque la página cambia.
        },
        error: (err) => {
          // SI OCURRE UN ERROR (403, 401, 500, etc.)
          console.error('Error en login:', err);

          // Usamos setTimeout para salir del ciclo de detección de cambios actual
          // y evitar el error NG0100, asegurando que el botón se desbloquee.
          setTimeout(() => {
             
             // 3. ¡AQUÍ ESTÁ LA CLAVE! Desbloqueamos el botón
             this.isLoading = false; 

             let mensaje = 'Error de conexión con el servidor';
             if (err.status === 403 || err.status === 401) {
                mensaje = 'Credenciales Incorrectas';
             }
             
             this.snackBar.open(mensaje, 'Cerrar', { 
               duration: 3000,
               panelClass: ['error-snackbar'] // Opcional si tienes estilos
             });

          }, 100); // Un pequeño retardo de 100ms asegura que la UI se refresque
        }
      });
    } else {
        this.loginForm.markAllAsTouched();
    }
  }
}