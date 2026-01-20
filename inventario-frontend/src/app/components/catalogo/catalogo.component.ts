import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css',
})
export class CatalogoComponent {

    // Definimos la lista de catálogos aquí
    catalogos = [
      { titulo: 'Categorías', icono: 'bi-tags', ruta: '/categorias', color: 'dark', desc: 'Gestionar tipos de productos' },
      { titulo: 'Productos', icono: 'bi-box', ruta: '/productos', color: 'dark', desc: 'Inventario General' },
      { titulo: 'Proveedores', icono: 'bi-truck', ruta: '/proveedores', color: 'dark', desc: 'Lista de Proveedores' },
      { titulo: 'Unidades de Medida', icono: 'bi-rulers', ruta: '/unidades', color: 'dark', desc: 'Metros, Unidades, Cajas' },
      { titulo: 'Bodegas', icono: 'bi-building', ruta: '/bodegas', color: 'dark', desc: 'Ubicaciones físicas' }
    ];

}
