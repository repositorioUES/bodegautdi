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

import { UnidadMedidaService } from '../../../services/unidades-medida.service';
import { UnidadMedida } from '../../../models/unidades-medidas';
import { UnidadesMedidasDialogComponent } from '../unidades-medidas-dialog/unidades-medidas-dialog.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-unidades-medidas-list',
  imports: [
    CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule, 
    MatIconModule, MatCardModule, MatTooltipModule, MatDialogModule, MatSnackBarModule
  ],
  templateUrl: './unidades-medidas-list.component.html',
  styleUrl: './unidades-medidas-list.component.css',
})
export class UnidadesMedidasListComponent {

  displayedColumns: string[] = ['id', 'nombre', 'abreviatura', 'acciones']; 
  dataSource = new MatTableDataSource<UnidadMedida>([]);
  unidadMedida = signal<UnidadMedida[]>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //Inyecciones
  private unidadMedidaService = inject(UnidadMedidaService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);


  constructor(){
    effect(() => {
      this.dataSource.data = this.unidadMedida();
      if (this.paginator) this.dataSource.paginator = this.paginator;
    });
  }

  ngOnInit(): void {
    this.cargarUnidadesMedida();
  }

  cargarUnidadesMedida() {
    this.unidadMedidaService.getUnidadesMedida().subscribe({
      next: (data) => this.unidadMedida.set(data),
      error: (e) => console.error(e)
    });
  }

  abrirFormulario(){
    const dialogRef = this.dialog.open(UnidadesMedidasDialogComponent,{ width: '400px', disableClose: true });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.registrarUnidadMedida(result);
      }
    });
  }

  registrarUnidadMedida(datos:any){
    const nuevaUnidadMedida : UnidadMedida = {
      nombreunidadmedida: datos.nombre,
      abreviaturaunidadmedida: datos.abreviatura
    };

    console.log('Enviando:', nuevaUnidadMedida);

    this.unidadMedidaService.createUnidadMedida(nuevaUnidadMedida).subscribe({
      next: () => {
        this.cargarUnidadesMedida();
        this.mostrarMensaje('Unidad de Medida registrada exitosamente');
      },
      error: (e) => {
        console.error(e);
        this.mostrarMensaje('Error al guardar la Unidad de Medida', true)
      }
    });

  }

  eliminar(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { width: '350px' });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.unidadMedidaService.deleteUnidadMedida(id).subscribe({
          next: () => {
            this.cargarUnidadesMedida();
            this.mostrarMensaje('Unidad de Medida eliminada');
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
