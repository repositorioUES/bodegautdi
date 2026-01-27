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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

// Modelos y Servicios
import { ProductoService } from '../../../services/producto.service';
import { Producto, ProductoRegistroDTO } from '../../../models/producto';
import { ProductoDialogComponent } from '../producto-dialog/producto-dialog.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule, 
    MatIconModule, MatCardModule, MatTooltipModule, MatDialogModule, 
    MatSnackBarModule, MatFormFieldModule, MatInputModule,RouterLink
  ],
  templateUrl: './producto-list.component.html',
  styleUrl: './producto-list.component.css',
})
export class ProductoListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'sku', 'nombre', 'precios', 'proveedor', 'acciones'];
  dataSource = new MatTableDataSource<Producto>([]);
  productos = signal<Producto[]>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private productoService = inject(ProductoService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  constructor() {
    // Sincronización reactiva: cada vez que el signal 'productos' cambie, actualizamos la tabla
    effect(() => {
      this.dataSource.data = this.productos();
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    });

    // CONFIGURACIÓN DE BÚSQUEDA LOCAL: Solo por nombreproducto
    this.dataSource.filterPredicate = (data: Producto, filter: string) => {
      const nombre = data.nombreproducto ? data.nombreproducto.toLowerCase() : '';
      const term = filter.trim().toLowerCase();
      return nombre.includes(term); // Retorna true si el nombre contiene el texto buscado
    };
  }

  ngOnInit(): void {
    this.cargarProductos();
  }

  // Se activa al escribir en la barra de búsqueda
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); // Reinicia a la página 1 al filtrar
    }
  }

  cargarProductos() {
    this.productoService.getProductos().subscribe({
      next: (data) => this.productos.set(data),
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.mostrarMensaje('No se pudo conectar con el servidor', true);
      }
    });
  }

  abrirFormulario() {
    const dialogRef = this.dialog.open(ProductoDialogComponent, {
      width: '700px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.registrarProducto(result);
    });
  }

  registrarProducto(datosForm: any) {
    const productoDTO: ProductoRegistroDTO = {
      nombreproducto: datosForm.nombreproducto,
      skuproducto: datosForm.skuproducto,
      descripcionproducto: datosForm.descripcionproducto,
      preciocostoproducto: datosForm.preciocostoproducto,
      precioventaproducto: datosForm.precioventaproducto,
      idCategoria: datosForm.idCategoria,
      idProveedor: datosForm.idProveedor,
      idUnidadMedida: datosForm.idUnidadMedida
    };

    this.productoService.createProducto(productoDTO).subscribe({
      next: () => {
        this.mostrarMensaje('Producto registrado exitosamente');
        this.cargarProductos(); 
      },
      error: (err) => {
        const msj = err.error?.message || 'Error al registrar el producto';
        this.mostrarMensaje(msj, true);
      }
    });
  }

  eliminar(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { width: '350px'});
    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.productoService.deleteProducto(id).subscribe({
          next: () => {
            this.cargarProductos();
            this.mostrarMensaje('Producto eliminado');
          },
          error: () => this.mostrarMensaje('No se pudo eliminar', true)
        });
      }
    });
  }

  private mostrarMensaje(mensaje: string, esError: boolean = false) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: esError ? ['snack-error'] : ['snack-exito']
    });
  }
}