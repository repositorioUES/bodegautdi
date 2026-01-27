import { Routes } from '@angular/router';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { CategoriaComponent } from './components/categoria/categoria-list/categoria.component';
import { ProveedorListComponent } from './components/proveedor/proveedor-list/proveedor-list.component';
import { BodegaListComponent } from './components/bodega/bodega-list/bodega-list.component';
import { UnidadesMedidasListComponent } from './components/unidades-medidas/unidades-medidas-list/unidades-medidas-list.component';
import { ProductoListComponent } from './components/producto/producto-list/producto-list.component';
import { UsuarioListComponent } from './components/usuario/usuario-list/usuario-list.component';
import { SolicitudFormComponent } from './components/solicitud-compra/solicitud-form/solicitud-form.component';
import { SolicitudListComponent } from './components/solicitud-compra/solicitud-list/solicitud-list.component';

export const routes: Routes = [

    { 
        path: 'usuarios', 
        component: UsuarioListComponent,  
        data: { breadcrumb: 'Usuarios' }  
    },
    { 
        path: 'presupuesto', 
        data: { breadcrumb: 'Presupuesto' },
        children : [
            {
                path : '',
                component: SolicitudListComponent
            },
            {
                path : 'nuevo_presupuesto',
                component : SolicitudFormComponent,
                data: { breadcrumb: 'Nuevo Presupuesto' } 
            },
        ]  
    },
    { 
        path: 'catalogos', 
        data: { breadcrumb: 'Catálogos' },
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