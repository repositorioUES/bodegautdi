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

import { SolicitudCompraService } from '../../../services/solicitud-compra.service';
import { SolicitudCompra } from '../../../models/solicitud-compra';

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
        // Ordenamos para que la más reciente salga primero
        this.solicitudes.set(data.sort((a, b) => b.idSolicitudCompra! - a.idSolicitudCompra!));
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Métodos placeholder para las acciones futuras
  verDetalle(id: number) {
    console.log('Ver detalle de:', id);
    // Aquí abriremos un Dialog más adelante
  }

  aprobar(id: number) {
    console.log('Aprobar:', id);
  }
}