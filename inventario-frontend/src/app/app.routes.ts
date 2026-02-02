import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/auth/login/login.component';

import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { CategoriaComponent } from './components/categoria/categoria-list/categoria.component';
import { ProveedorListComponent } from './components/proveedor/proveedor-list/proveedor-list.component';
import { BodegaListComponent } from './components/bodega/bodega-list/bodega-list.component';
import { UnidadesMedidasListComponent } from './components/unidades-medidas/unidades-medidas-list/unidades-medidas-list.component';
import { ProductoListComponent } from './components/producto/producto-list/producto-list.component';
import { UsuarioListComponent } from './components/usuario/usuario-list/usuario-list.component';
import { SolicitudFormComponent } from './components/solicitud-compra/solicitud-form/solicitud-form.component';
import { SolicitudListComponent } from './components/solicitud-compra/solicitud-list/solicitud-list.component';
import { InventarioListComponent } from './components/inventario/inventario-list/inventario-list.component';
import { InventarioDetalleComponent } from './components/inventario/inventario-detalle/inventario-detalle.component';
import { authGuard } from './guards/auth-guard';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';

export const routes: Routes = [

    // RUTA PÚBLICA (Login)
    // Está fuera del guardián para que cualquiera pueda entrar
    { 
        path: 'login', 
        component: LoginComponent
    },

    // RUTAS PROTEGIDAS (Sistema Principal)
    // Todo lo que esté dentro de 'children' requiere estar logueado
    { 
        path: '', 
        component: MainLayoutComponent,
        canActivate: [authGuard], // SEGURIDAD A TODO EL BLOQUE
        children: [
            
            // Dashboard
            { 
                path: 'dashboard', 
                component: DashboardComponent,
                data: { breadcrumb: 'Dashboard' }
            },

            // Usuarios
            { 
                path: 'usuarios', 
                component: UsuarioListComponent,
                data: { breadcrumb: 'Usuarios' }
            },

            // Presupuesto / Solicitudes
            { 
                path: 'presupuesto', 
                data: { breadcrumb: 'Presupuesto' },
                children: [
                    {
                        path: '',
                        component: SolicitudListComponent
                    },
                    {
                        path: 'nuevo_presupuesto',
                        component: SolicitudFormComponent,
                        data: { breadcrumb: 'Nuevo Presupuesto' } 
                    },
                ]  
            },

            // Inventario (Vista de Cards y Detalles)
            { 
                path: 'inventario', 
                data: { breadcrumb: 'Inventario' },
                children: [
                    {
                        path: '', 
                        component: InventarioListComponent, // Las Cards de Bodegas
                    },
                    { 
                        path: 'bodega/:id', 
                        component: InventarioDetalleComponent, // La Tabla de productos
                        data: { breadcrumb: 'Existencias' }  
                    },
                ]
            },

            // Catálogos (CRUD)
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
                    }
                ]
            },

            // Redirección por defecto si entran a la raíz ('') logueados
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },

    // RUTA DEFAULT PARA RUTAS QUE NO EXISTEN
    { path: '**', redirectTo: 'login' }
];