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
import { MatSnackBar } from '@angular/material/snack-bar';

import { SolicitudCompra } from '../../../models/solicitud-compra';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { SolicitudDetalleDialogComponent } from '../solicitud-detalle-dialog/solicitud-detalle-dialog.component';
import { SolicitudCompraService } from '../../../services/solicitud-compra.service';
import { PdfService } from '../../../services/pdf.service';
import { PdfViewerDialogComponent } from '../../pdf-viewer-dialog/pdf-viewer-dialog.component';

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

  //agregar 'bodega' si se requiere que se muestre la bodega como una columna en la tabla 
  displayedColumns: string[] = ['id', 'fecha', 'nombre', 'solicitante', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<SolicitudCompra>([]);
  solicitudes = signal<SolicitudCompra[]>([]);
  idUsuarioActual = 1; 

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private solicitudService = inject(SolicitudCompraService);
  private pdfService = inject(PdfService);

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

  // --------------------------------------------------------
  // MODAL CON EL DETALLE DE LA SOLICITUD
  // --------------------------------------------------------
  verDetalle(solicitud: SolicitudCompra) {
    const dialogRef = this.dialog.open(SolicitudDetalleDialogComponent, {
      width: '800px',
      disableClose: false,
      data: { solicitud: solicitud }
    });

  // --------------------------------------------------------
  // MODAL PARA APROBAR O RECEPCIONAR
  // --------------------------------------------------------
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      if (result?.accion === 'aprobar') {
        this.aprobarSolicitud(result.id,false);
      } else if (result?.accion === 'recepcionar') {
        // Llamar a tu lógica de recepción
        this.recepcionarSolicitud(result.id, false);
        console.log('Recepcionar ID:', result.id);
      }
    });
  }

  // --------------------------------------------------------
  // MODAL DE SELECCION PARA APROBAR
  // --------------------------------------------------------

  aprobarSolicitud(id: number, confirmar: boolean = true){
    if(confirmar){
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        data: {
          titulo: 'Confirmar Aprobación',
          mensaje: '¿Estás seguro de que deseas aprobar esta solicitud? Pasará a estado APROBADA.',
          textoBoton: 'Aprobar',
          colorBoton: 'primary' // Azul/Verde en lugar de Rojo
        }
      });
      dialogRef.afterClosed().subscribe(res => {
        if(res) this.ejecutarAprobacion(id);
      });
    }else{
      this.ejecutarAprobacion(id);
    }
  }

  // --------------------------------------------------------
  // MODAL DE SELECCION PARA RECEPCIONAR
  // --------------------------------------------------------
  ejecutarAprobacion(id : number){
    this.solicitudService.aprobarSolicitud(id).subscribe({
      next: () => {
        this.mostrarMensaje('Solicitud Aprobada', false);
        this.cargarSolicitudes();
      },
      error: () => this.mostrarMensaje('Error al aprobar solicitud', true)
    });
  }

  // --------------------------------------------------------
  // FUNCION PARA RECEPCIONAR DE SOLICITUDES
  // --------------------------------------------------------
  recepcionarSolicitud(id: number, confirmar: boolean = true){
    if(confirmar){
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        data: {
          titulo: 'Confirmar Recepción',
          mensaje: 'Al recepcionar, se sumarán los productos al inventario de la bodega destino. ¿Continuar?',
          textoBoton: 'Recepcionar',
          colorBoton: 'primary'
        }
      });
      dialogRef.afterClosed().subscribe(res => {
        if(res) this.ejecutarRecepcion(id);
      });
    }else{
      this.ejecutarRecepcion(id);
    }
  }

  // --------------------------------------------------------
  // FUNCION PARA RECEPCIONAR DE SOLICITUDES
  // --------------------------------------------------------
  private ejecutarRecepcion(id : number){
    this.solicitudService.recepcionarSolicitud(id, this.idUsuarioActual).subscribe({
      next: () => {
        this.mostrarMensaje('Productos Recepcionados e Inventario Actualizado', false);
        this.cargarSolicitudes();
      },
      error : (e) => {
        console.log(e);
        this.mostrarMensaje('Error al recepcionar esta solicitud', true);
      }
    });
  }

  // --------------------------------------------------------
  // FUNCION PARA IMPRIMIR MENSAJES TIPO SNACKBAR
  // --------------------------------------------------------
  private mostrarMensaje(mensaje: string, esError: boolean) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: esError ? ['snack-error'] : ['snack-exito'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  // --------------------------------------------------------
  // FUNCION PARA VER LA SOLICITUD COMO NUEVA VENTANA
  // --------------------------------------------------------
  imprimirSolicitud(solicitud : SolicitudCompra){
    if(!solicitud.idSolicitudCompra) return;

    this.solicitudService.listarDetalles(solicitud.idSolicitudCompra).subscribe({
      next : (detalles) => {
        this.pdfService.generarPdfSolicitud(solicitud,detalles);
      },
      error : () => this.mostrarMensaje('Error al generar el PDF', true)
    });
  }

  // --------------------------------------------------------
  // FUNCION PARA VER LA SOLICITUD COMO MODAL
  // --------------------------------------------------------
  imprimirSolicitudModal(solicitud: SolicitudCompra) {
    if(!solicitud.idSolicitudCompra) return;

    this.solicitudService.listarDetalles(solicitud.idSolicitudCompra).subscribe({
      next: (detalles) => {

        const urlBlob = this.pdfService.generarPdfSolicitud(solicitud, detalles);

        this.dialog.open(PdfViewerDialogComponent, {
          width: '100%',
          height: '95%',
          maxWidth: '60vw',
          panelClass: 'full-screen-modal',
          data: { 
            url: urlBlob,
            titulo: `Vista Previa - Presupuesto #${solicitud.idSolicitudCompra}`
          }
        });
      },
      error: () => this.mostrarMensaje('Error al generar PDF', true)
    });
  }

}