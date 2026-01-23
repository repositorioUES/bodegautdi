import { Component, OnInit,inject, signal, ViewChild, effect} from '@angular/core';
//import { RouterLink } from '@angular/router';
//import { CommonModule } from '@angular/common'; // Para *ngFor
import { CategoriaService } from '../../../services/categoria.service';
import { Categoria } from '../../../models/categoria';
import { CategoriaDialogComponent } from '../categoria-dialog/categoria-dialog.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

// --- Imports de Material ---
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; 

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
  selector: 'app-categoria',
  standalone: true,
  imports: [
    MatTableModule, 
    MatPaginatorModule, 
    MatButtonModule, 
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  providers: [{ provide: MatPaginatorIntl, useValue: getPaginatorIntl() }],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css',
})
export class CategoriaComponent implements OnInit{

  displayedColumns: string[] = ['id', 'nombre', 'acciones'];

  dataSource = new MatTableDataSource<Categoria>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  categorias = signal<Categoria[]>([]);

  //INYECCIONES
  private categoriaService = inject(CategoriaService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  constructor() {
    effect(() => {
      this.dataSource.data = this.categorias();
    
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  ngOnInit(): void {
    this.cargarCategorias();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  cargarCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (data) => {
        this.categorias.set(data);
        //console.log(data);
      },
      error: (e) => console.error(e)
    });
  }


  abrirFormulario() {
    const dialogRef = this.dialog.open(CategoriaDialogComponent, {
      width: '400px',
      disableClose: true // Evita que se cierre haciendo clic fuera
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Si hay resultado (el usuario dio Guardar), llamamos al servicio
        this.registrarCategoria(result);
      }
    });
  }

  registrarCategoria(datosFormulario: any) {
    // Armamos el objeto (el ID es autogenerado, no lo mandamos)
    const nuevaCategoria: Categoria = {
      nombrecategoria: datosFormulario.nombre // Asegúrate que coincida con tu DTO Java
    };

    //console.log('Enviando JSON:', nuevaCategoria);

    this.categoriaService.createCategoria(nuevaCategoria).subscribe({
      next: () => {
        // ¡Éxito! Recargamos la lista
        this.cargarCategorias();
        this.mostrarMensaje('¡Categoría creada con éxito!');
        // Aquí podrías poner un SweetAlert o SnackBar de éxito
      },
      error: (e) => {
        console.error('Error al guardar:', e);
        this.mostrarMensaje('Error al crear la categoría', true);
      }
    });

  }

  eliminar(id: number): void {
    // 1. Abrimos el dialog de confirmación
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px'
    });

    // 2. Esperamos la respuesta (true o false)
    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        // Si dijo que SÍ, llamamos al servicio
        this.categoriaService.deleteCategoria(id).subscribe({
          next: () => {
            this.cargarCategorias();
            this.mostrarMensaje('Categoría eliminada correctamente');
          },
          error: (e) => {
            console.error(e);
            this.mostrarMensaje('No se pudo eliminar la categoría', true);
          }
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
