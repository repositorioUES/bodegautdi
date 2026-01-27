import { Component, OnInit, inject, ViewChild, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips'; // Para los badges
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';

import { SolicitudCompraService } from '../../../services/solicitud-compra.service';
import { SolicitudCompra } from '../../../models/solicitud-compra';
import { SolicitudDetalleDialogComponent } from '../solicitud-detalle-dialog/solicitud-detalle-dialog.component';

@Component({
  selector: 'app-solicitud-list',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule, 
    MatIconModule, MatCardModule, MatTooltipModule, MatChipsModule, 
    RouterLink, MatFormFieldModule, MatInputModule
  ],
  templateUrl: './solicitud-list.component.html',
  styleUrl: './solicitud-list.component.css'
})
export class SolicitudListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'fecha', 'nombre', 'solicitante', 'bodega', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<SolicitudCompra>([]);
  solicitudes = signal<SolicitudCompra[]>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  private solicitudService = inject(SolicitudCompraService);
  private dialog = inject(MatDialog);

  constructor() {
    effect(() => {
      this.dataSource.data = this.solicitudes();
      if (this.paginator) this.dataSource.paginator = this.paginator;
    });

    // Filtro personalizado: Busca por ID, Nombre de Solicitud o Estado
    this.dataSource.filterPredicate = (data: SolicitudCompra, filter: string) => {
      const searchStr = (data.idSolicitudCompra + data.nombresolicitud + data.estado).toLowerCase();
      return searchStr.includes(filter);
    };
  }

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  cargarSolicitudes() {
    this.solicitudService.listar().subscribe(data => {
        // ORDENAMIENTO SEGUN EL ID ASC O DESC
        this.solicitudes.set(data.sort((a, b) => a.idSolicitudCompra! - b.idSolicitudCompra!));
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  aprobar(id: number) {
    console.log('Aprobar:', id);
  }


  obtenerIniciales(nombre: string | undefined): string {
    if (!nombre) return '';
    
    const partes = nombre.split('.');
    
    if (partes.length > 1) {
      const inicialNombre = partes[0].charAt(0);
      const inicialApellido = partes[1].charAt(0);
      return (inicialNombre + inicialApellido).toUpperCase();
    }
    
    return nombre.substring(0, 2).toUpperCase();
  }

  // Método verDetalle COMPLETO
  verDetalle(solicitud: SolicitudCompra) {
    const dialogRef = this.dialog.open(SolicitudDetalleDialogComponent, {
      width: '800px', // Ancho adecuado
      disableClose: false,
      data: { solicitud: solicitud } // Pasamos todo el objeto
    });

    // Opcional: Si implementaste Aprobar/Recepcionar dentro del modal
    dialogRef.afterClosed().subscribe(result => {
      if (result?.accion === 'aprobar') {
        this.aprobar(result.id);
      } else if (result?.accion === 'recepcionar') {
        // Llamar a tu lógica de recepción
        console.log('Recepcionar ID:', result.id);
      }
    });
  }

}