import { Component, OnInit, inject,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table'; // Importante
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';

// Servicios y Modelos
import { ProductoService } from '../../../services/producto.service';
import { BodegaService } from '../../../services/bodega.service'; // Asumo que existe
import { SolicitudCompraService } from '../../../services/solicitud-compra.service';
import { UsuarioService } from '../../../services/usuario.service'; // Para obtener el usuario actual
import { Producto } from '../../../models/producto';
import { Bodega } from '../../../models/bodega';

@Component({
  selector: 'app-solicitud-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, MatButtonModule, MatFormFieldModule, 
    MatInputModule, MatSelectModule, MatIconModule, MatCardModule, MatTableModule, RouterLink
  ],
  templateUrl: './solicitud-form.component.html',
  styleUrl: './solicitud-form.component.css'
})
export class SolicitudFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private productoService = inject(ProductoService);
  private bodegaService = inject(BodegaService);
  private solicitudService = inject(SolicitudCompraService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  // Datos para Selects
  listaProductos: Producto[] = [];
  listaBodegas: Bodega[] = [];
  idUsuarioActual = 1; 

  // Formulario Cabecera
  form: FormGroup = this.fb.group({
    nombresolicitud: ['', Validators.required],
    idBodega: [null, Validators.required]
  });

  // Inputs temporales
  productoSeleccionado: Producto | null = null;
  cantidadSeleccionada: number = 1;

  // --- CAMBIO CLAVE: Usamos MatTableDataSource para el detalle ---
  detalles: any[] = []; 
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['producto', 'cantidad', 'precio', 'subtotal', 'acciones'];

  ngOnInit(): void {
    this.productoService.getProductos().subscribe(data => {
      this.listaProductos = data;
      this.cdr.detectChanges();
    });

    this.bodegaService.getBodegas().subscribe(data => {
      this.listaBodegas = data;
      this.cdr.detectChanges();
    });
  }

  agregarProducto() {
    if (!this.productoSeleccionado || this.cantidadSeleccionada <= 0) return;

    const existente = this.detalles.find(d => d.producto.idProducto === this.productoSeleccionado?.idProducto);
    
    if (existente) {
      existente.cantidad += this.cantidadSeleccionada;
    } else {
      this.detalles.push({
        producto: this.productoSeleccionado,
        cantidad: this.cantidadSeleccionada,
        subtotal: this.productoSeleccionado.preciocostoproducto * this.cantidadSeleccionada
      });
    }

    // Refrescamos la tabla Material
    this.actualizarTabla();

    // Reset inputs
    this.productoSeleccionado = null;
    this.cantidadSeleccionada = 1;
  }

  eliminarDetalle(index: number) {
    this.detalles.splice(index, 1);
    this.actualizarTabla();
  }

  // Método auxiliar para que la tabla detecte cambios
  actualizarTabla() {
    this.dataSource.data = [...this.detalles];
  }

  get totalEstimado(): number {
    return this.detalles.reduce((acc, curr) => acc + (curr.producto.preciocostoproducto * curr.cantidad), 0);
  }

  guardarSolicitud() {
    if (this.form.invalid || this.detalles.length === 0) return;

    const datosForm = this.form.value;

    this.solicitudService.crearSolicitud({
        nombresolicitud: datosForm.nombresolicitud,
        idBodegaDestino: datosForm.idBodega,
        idUsuarioSolicitante: this.idUsuarioActual
    }).subscribe({
        next: (solicitud) => {
            this.guardarDetalles(solicitud.idSolicitudCompra!);
        },
        error: () => this.snackBar.open('Error al crear cabecera', 'Cerrar', { panelClass: ['snack-error'] })
    });
  }


/*   guardarDetalles(idSolicitud: number) {
    // ... (Logica de guardado iterativo igual que antes) ...
    // Para abreviar, al terminar:
    this.snackBar.open('Solicitud Creada', 'Cerrar', { 
      duration: 3000, 
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: ['snack-exito'] 
    });
    this.router.navigate(['/presupuesto']); // RUTA DE RETORNO
  } */

  guardarDetalles(idSolicitud: number) {
    
    const peticiones: Observable<void>[] = this.detalles.map(detalle => {
      return this.solicitudService.agregarProducto(idSolicitud, {
        idProducto: detalle.producto.idProducto,
        cantidad: detalle.cantidad
      });
    });

    forkJoin(peticiones).subscribe({
      next: () => {
        this.snackBar.open('Solicitud guardada correctamente', 'Cerrar', { 
            duration: 5000, 
            panelClass: ['snack-exito'],
            verticalPosition: 'top',
            horizontalPosition: 'right'
        });
        this.router.navigate(['/presupuesto']);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Se guardó la solicitud pero fallaron algunos productos', 'Cerrar', { panelClass: ['snack-error'] });
      }
    });
  }

}