import { Component, OnInit, inject, signal, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

import { UsuarioService } from '../../../services/usuario.service';
import { Usuario, UsuarioRegistroDTO } from '../../../models/usuario';
import { UsuarioDialogComponent } from '../usuario-dialog/usuario-dialog.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-usuario-list',
  imports: [
    CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule, 
    MatIconModule, MatDialogModule, MatSnackBarModule, MatCardModule,MatTooltipModule, RouterLink
  ],
  templateUrl: './usuario-list.component.html',
  styleUrl: './usuario-list.component.css',
})
export class UsuarioListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'nombre', 'rol', 'acciones'];
  dataSource = new MatTableDataSource<Usuario>([]);
  usuarios = signal<Usuario[]>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private usuarioService = inject(UsuarioService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  constructor() {
    effect(() => {
      this.dataSource.data = this.usuarios();
      if (this.paginator) this.dataSource.paginator = this.paginator;
    });
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.listarUsuarios().subscribe({
      next: (data) => this.usuarios.set(data),
      error: () => this.mostrarMensaje('Error al cargar usuarios', true)
    });
  }

  abrirFormulario() {
    const dialogRef = this.dialog.open(UsuarioDialogComponent, { width: '400px' });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.registrarUsuario(result);
    });
  }

  registrarUsuario(datos: any) {
    const dto: UsuarioRegistroDTO = {
        nombreusuario: datos.nombreusuario,
        passwordusuario: datos.passwordusuario,
        idrol: datos.idrol
    };

    this.usuarioService.registrarUsuario(dto).subscribe({
        next: () => {
          this.mostrarMensaje('Usuario creado con éxito');
          this.cargarUsuarios();
        },
        error: (e) => {
            console.error(e);
            this.mostrarMensaje('Error al crear usuario', true);
        }
    });
  }

  obtenerClaseRol(rol: string): string {
    switch (rol) {
      case 'ADMIN':
        return 'role-admin'; // Clase CSS personalizada (Rojo suave)
      case 'INVENTARIO':
        return 'role-inventario'; // Clase CSS personalizada (Cyan suave)
      case 'BODEGA':
        return 'role-bodega'; // Clase CSS personalizada (Naranja suave)
      default:
        return 'role-default'; // Gris
    }
  }


  private mostrarMensaje(mensaje: string, esError: boolean = false) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000, // Dura 3 segundos
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: esError ? ['snack-error'] : ['snack-exito'] // Clases CSS que creamos
    });
  }
}
