import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  private authService = inject(AuthService);

  nombreUsuario: string = '';
  avatarUrl: string = '';

  ngOnInit(): void {

    const usuarioData = this.authService.getUsuarioActual();
    
    this.nombreUsuario = this.formatearNombre(usuarioData);
    
    this.avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(this.nombreUsuario)}&background=random&color=fff`;
  }

  // FORMATEAR EL CODIGO
  private formatearNombre(nombre: string): string {
    if (!nombre) return 'Usuario';

    return nombre.split('.') 
      .map(parte => parte.charAt(0).toUpperCase() + parte.slice(1).toLowerCase())
      .join(' ');
  }

  cerrarSesion(event: Event) {
    event.preventDefault();
    this.authService.logout();
  }
}