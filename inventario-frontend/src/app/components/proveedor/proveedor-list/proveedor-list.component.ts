import { Component, OnInit, inject, signal, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ProveedorService } from '../../../services/proveedor.service';
import { Proveedor } from '../../../models/proveedor';
import { ProveedorDialogComponent } from '../proveedor-dialog/proveedor-dialog.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

export function getPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();
  paginatorIntl.itemsPerPageLabel = 'Artículos por página:';
  paginatorIntl.nextPageLabel = 'Siguiente';
  paginatorIntl.previousPageLabel = 'Anterior';
  paginatorIntl.firstPageLabel = 'Primera página';
  paginatorIntl.lastPageLabel = 'Última página';
  paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 de ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} de ${length}`;
  };
  return paginatorIntl;
}

@Component({
  selector: 'app-proveedor-list',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule, 
    MatIconModule, MatCardModule, MatTooltipModule, MatDialogModule, MatSnackBarModule
  ],
  providers: [{ provide: MatPaginatorIntl, useValue: getPaginatorIntl() }],
  templateUrl: './proveedor-list.component.html',
  styleUrl: './proveedor-list.component.css',
})

export class ProveedorListComponent {

  //Columnas a mostrar en la tabla
  displayedColumns : string[] = ['id', 'nombre', 'telefono', 'acciones'];

  dataSource = new MatTableDataSource<Proveedor>([]);
  proveedores = signal<Proveedor[]>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //Inyecciones
  private proveedorService = inject(ProveedorService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  constructor(){
    effect(() => {
      this.dataSource.data = this.proveedores();
      if (this.paginator) this.dataSource.paginator = this.paginator;
    });
  }

  ngOnInit(): void {
    this.cargarProveedores();
  }

  cargarProveedores() {
    this.proveedorService.getProveedores().subscribe({
      next: (data) => this.proveedores.set(data),
      error: (e) => console.error(e)
    });
  }

  abrirFormulario(){
    const dialogRef = this.dialog.open(ProveedorDialogComponent,{ width: '400px', disableClose: true });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.registrarProveedor(result);
      }
    });
  }

  registrarProveedor(datos:any){
    const nuevo : Proveedor = {
      nombreproveedor: datos.nombre,
      telefonoproveedor: datos.telefono
    };

    console.log('Enviando:', nuevo);

    this.proveedorService.createProveedor(nuevo).subscribe({
      next: () => {
        this.cargarProveedores();
        this.mostrarMensaje('Proveedor registrado exitosamente');
      },
      error: (e) => {
        console.error(e);
        this.mostrarMensaje('Error al guardar el proveedor', true)
      }
    });

  }

  eliminar(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { width: '350px' });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.proveedorService.deleteProveedor(id).subscribe({
          next: () => {
            this.cargarProveedores();
            this.mostrarMensaje('Proveedor eliminado');
          },
          error: () => this.mostrarMensaje('No se pudo eliminar', true)
        });
      }
    });
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
