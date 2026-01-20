import { Routes } from '@angular/router';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { CategoriaComponent } from './components/categoria/categoria.component';

export const routes: Routes = [
    { path: '', redirectTo: 'catalogos', pathMatch: 'full' }, // Redirigir a catalogos por defecto
    
    { path: 'catalogos', component: CatalogoComponent }, // <--- Nueva ruta principal
    
    // Rutas individuales (para cuando hagan click en la card)
    { path: 'categorias', component: CategoriaComponent },
    // { path: 'productos', component: ProductoListComponent }, // Futuro
    // ...
];