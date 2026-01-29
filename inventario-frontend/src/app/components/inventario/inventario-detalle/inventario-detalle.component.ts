import { Component, OnInit, inject, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

import { InventarioService } from '../../../services/inventario.service';

@Component({
  selector: 'app-inventario-detalle',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, 
    MatInputModule, MatFormFieldModule, MatIconModule, MatButtonModule, 
    MatCardModule, MatTooltipModule, RouterLink
  ],
  templateUrl: './inventario-detalle.component.html',
  styleUrl: './inventario-detalle.component.css',
})
export class InventarioDetalleComponent implements OnInit {

  private inventarioService = inject(InventarioService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  //displayedColumns: string[] = ['sku', 'producto', 'categoria', 'cantidad', 'costo', 'total'];
  displayedColumns: string[] = ['sku', 'producto', 'categoria', 'cantidad'];
  dataSource = new MatTableDataSource<any>([]);

  nombreBodega: string = '';
  idBodega: number = 0;
  totalValorizado: number = 0; // Suma total del dinero en inventario
  cargando: boolean = true;

  ngOnInit(): void {
    
    // 1. CONFIGURACIÓN DEL FILTRO PERSONALIZADO
    // Le enseñamos a la tabla a buscar dentro del objeto 'producto'
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const datosAString = (
        data.producto.skuproducto + 
        data.producto.nombreproducto + 
        (data.producto.categoria?.nombrecategoria || '')
      ).toLowerCase(); // Convertimos todo a minúsculas para comparar
      
      return datosAString.includes(filter);
    };

    // 2. Obtener ID y cargar
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.idBodega = +id;
        this.cargarProductos(this.idBodega);
      }
    });
  }

  cargarProductos(id: number) {
    this.cargando = true;
    this.inventarioService.listarInventarioPorBodega(id).subscribe({
      next: (data) => {
        this.dataSource.data = data;
        
        // 3. CAPTURAR EL NOMBRE DE LA BODEGA
        // Si hay productos, tomamos el nombre de la bodega del primer ítem
        if (data.length > 0) {
            this.nombreBodega = data[0].bodega.nombrebodega;
        }

        this.totalValorizado = data.reduce((acc, item) => 
          acc + (item.cantidad_actual * item.producto.preciocostoproducto), 0);
        
        this.cargando = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

