import { Component, OnInit,inject, signal} from '@angular/core';
//import { RouterLink } from '@angular/router';
//import { CommonModule } from '@angular/common'; // Para *ngFor
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../models/categoria';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css',
})
export class CategoriaComponent implements OnInit{

  //categorias: Categoria[] = [];
  categorias = signal<Categoria[]>([]);

  //constructor(private categoriaService: CategoriaService) {}

  private categoriaService = inject(CategoriaService);

  ngOnInit(): void {
    this.cargarCategorias();
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

  eliminar(id: number): void {
    if(confirm('¿Estás seguro de eliminar esta categoría?')) {
        this.categoriaService.deleteCategoria(id).subscribe(() => {
            this.cargarCategorias(); // Recargar la lista
        });
    }
  }

}
