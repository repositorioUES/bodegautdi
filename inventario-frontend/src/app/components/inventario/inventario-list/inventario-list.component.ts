import { Component, OnInit, inject, signal,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterModule } from '@angular/router';

import { InventarioService } from '../../../services/inventario.service';
import { Bodega } from '../../../models/bodega';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-inventario-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, RouterModule, RouterLink, MatDivider],
  templateUrl: './inventario-list.component.html',
  styleUrl: './inventario-list.component.css',
})
export class InventarioListComponent implements OnInit {


  private inventarioService = inject(InventarioService);
  private cdr = inject(ChangeDetectorRef);

  bodegas = signal<Bodega[]>([]);

  ngOnInit(): void {
    this.cargarInventario();
  }


  cargarInventario() {
    this.inventarioService.listarBodegas().subscribe({
      next: (data) => {
        this.bodegas.set(data);
      //console.log(this.bodegas);
      this.cdr.detectChanges();

      },
      error: (err) => console.error('Error al cargar bodegas', err)
    });
  }
}
