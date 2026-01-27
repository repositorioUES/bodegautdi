import { Component, Inject, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SolicitudCompraService } from '../../../services/solicitud-compra.service';
import { SolicitudCompra, SolicitudCompraDetalle } from '../../../models/solicitud-compra';

@Component({
  selector: 'app-solicitud-detalle-dialog',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, MatButtonModule, MatIconModule, 
    MatTableModule, MatDividerModule, MatTooltipModule
  ],
  templateUrl: './solicitud-detalle-dialog.component.html',
  styleUrl: './solicitud-detalle-dialog.component.css',
})

export class SolicitudDetalleDialogComponent implements OnInit{

  private solicitudService = inject(SolicitudCompraService);
  private cdr = inject(ChangeDetectorRef)

  //AGREGAMOS LOS DATOS 
  dataSource = new MatTableDataSource<SolicitudCompraDetalle>([]);
  displayedColumns: string[] = ['producto', 'cantidad', 'precio', 'subtotal'];

  // Variables de estado
  total: number = 0;
  cargando: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<SolicitudDetalleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { solicitud: SolicitudCompra }
  ) {}

  ngOnInit(): void {
    this.cargarDetalles();
  }

  cargarDetalles() {
    this.cargando = true;
    const id = this.data.solicitud.idSolicitudCompra;

    if(id) {
      this.solicitudService.listarDetalles(id).subscribe({
        next: (detalles) => {
          this.dataSource.data = detalles;
          this.calcularTotal(detalles);
          this.cargando = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.cargando = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  calcularTotal(detalles: SolicitudCompraDetalle[]) {
    this.total = detalles.reduce((acc, curr) => {
      return acc + (curr.cantidad_solicitada * curr.producto.preciocostoproducto);
    }, 0);
  }

  cerrar() {
    this.dialogRef.close();
  }

  // Acciones rápidas desde el detalle (Opcional)
  aprobar() {
    this.dialogRef.close({ accion: 'aprobar', id: this.data.solicitud.idSolicitudCompra });
  }

  recepcionar() {
    this.dialogRef.close({ accion: 'recepcionar', id: this.data.solicitud.idSolicitudCompra });
  }

}
