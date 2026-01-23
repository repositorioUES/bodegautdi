import { Routes } from '@angular/router';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { CategoriaComponent } from './components/categoria/categoria-list/categoria.component';
import { ProveedorListComponent } from './components/proveedor/proveedor-list/proveedor-list.component';
import { BodegaListComponent } from './components/bodega/bodega-list/bodega-list.component';
import { UnidadesMedidasListComponent } from './components/unidades-medidas/unidades-medidas-list/unidades-medidas-list.component';
import { ProductoListComponent } from './components/producto/producto-list/producto-list.component';

export const routes: Routes = [
    //{ path: '', redirectTo: 'catalogos', pathMatch: 'full' },
    
    { 
        path: 'catalogos', 
        data: { breadcrumb: 'Catálogos' }, // <--- EL PADRE MANTIENE LA ETIQUETA
        children: [
            {
                path: '', 
                component: CatalogoComponent 
            },
            {
                path: 'categorias', 
                component: CategoriaComponent, 
                data: { breadcrumb: 'Categorías' } 
            },
            {
                path: 'proveedores', 
                component: ProveedorListComponent, 
                data: { breadcrumb: 'Proveedores' } 
            },
            {
                path: 'bodegas', 
                component: BodegaListComponent, 
                data: { breadcrumb: 'Bodegas' } 
            },
            {
                path: 'unidades', 
                component: UnidadesMedidasListComponent, 
                data: { breadcrumb: 'Unidades de Medida' } 
            },
            {
                path: 'productos', 
                component: ProductoListComponent, 
                data: { breadcrumb: 'Productos' } 
            },
            // ... otros hijos ...
        ]
    },
];