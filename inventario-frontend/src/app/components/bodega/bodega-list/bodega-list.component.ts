import { Component, OnInit, inject, signal, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { BodegaService } from '../../../services/bodega.service';
import { Bodega } from '../../../models/bodega';
import { BodegaDialogComponent } from '../bodega-dialog/bodega-dialog.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-bodega-list',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule, 
    MatIconModule, MatCardModule, MatTooltipModule, MatDialogModule, MatSnackBarModule
  ],
  templateUrl: './bodega-list.component.html',
  styleUrl: './bodega-list.component.css',
})
export class BodegaListComponent {

  displayedColumns: string[] = ['id', 'nombre', 'direccion', 'telefono', 'acciones']; 
  dataSource = new MatTableDataSource<Bodega>([]);
  bodegas = signal<Bodega[]>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //Inyecciones
  private bodegaService = inject(BodegaService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  constructor(){
    effect(() => {
      this.dataSource.data = this.bodegas();
      if (this.paginator) this.dataSource.paginator = this.paginator;
    });
  }

  ngOnInit(): void {
    this.cargarBodegas();
  }

  cargarBodegas() {
    this.bodegaService.getBodegas().subscribe({
      next: (data) => this.bodegas.set(data),
      error: (e) => console.error(e)
    });
  }

  abrirFormulario(){
    const dialogRef = this.dialog.open(BodegaDialogComponent,{ width: '400px', disableClose: true });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.registrarBodega(result);
      }
    });
  }

  registrarBodega(datos:any){
    const nuevaBodega : Bodega = {
      nombrebodega: datos.nombre,
      direccionbodega: datos.direccion,
      telefonobodega : datos.telefono
    };

    console.log('Enviando:', nuevaBodega);

    this.bodegaService.createBodega(nuevaBodega).subscribe({
      next: () => {
        this.cargarBodegas();
        this.mostrarMensaje('Bodega registrada exitosamente');
      },
      error: (e) => {
        console.error(e);
        this.mostrarMensaje('Error al guardar la bodega', true)
      }
    });

  }

  eliminar(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { width: '350px' });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.bodegaService.deleteBodega(id).subscribe({
          next: () => {
            this.cargarBodegas();
            this.mostrarMensaje('Bodega eliminada');
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
