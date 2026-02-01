import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { InventarioService } from '../../services/inventario.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit{

  private inventarioService = inject(InventarioService);

  datos = signal({
    pendientes : 0,
    aprobadas : 0,
    recepcionadas : 0,
    totalBodegas : 0
  });

  ngOnInit() : void {
    this.cargarDashboard();
  }

  cargarDashboard() {
    this.inventarioService.getDashboard().subscribe({
      next : (data) => {
        this.datos.set(data);
      },
      error : (err) => {
        console.log('Error al cargar data', err);
      }
    });
  }
}
