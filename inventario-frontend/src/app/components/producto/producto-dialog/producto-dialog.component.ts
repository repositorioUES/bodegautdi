import { Component, OnInit, inject,ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

// Servicios de catálogos
import { CategoriaService } from '../../../services/categoria.service';
import { ProveedorService } from '../../../services/proveedor.service';
import { UnidadMedidaService } from '../../../services/unidades-medida.service';

@Component({
  selector: 'app-producto-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, 
    MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule
  ],
  templateUrl: './producto-dialog.component.html',
  //styleUrl: './producto-dialog.component.css',
})
export class ProductoDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ProductoDialogComponent>);
  private cdr = inject(ChangeDetectorRef);

  // Servicios inyectados
  private catService = inject(CategoriaService);
  private provService = inject(ProveedorService);
  private unitService = inject(UnidadMedidaService);

  // Listas para los selects
  listaCategorias: any[] = [];
  listaProveedores: any[] = [];
  listaUnidades: any[] = [];

  form: FormGroup = this.fb.group({
    nombreproducto: ['', [Validators.required]],
    skuproducto: ['', [Validators.required]],
    descripcionproducto: [''],
    preciocostoproducto: [0, [Validators.required, Validators.min(0)]],
    precioventaproducto: [0, [Validators.required, Validators.min(0)]],
    idCategoria: [null, Validators.required],
    idProveedor: [null, Validators.required],
    idUnidadMedida: [null, Validators.required]
  });

  ngOnInit(): void {
    // Carga paralela de catálogos
    this.catService.getCategorias().subscribe(data => {
      this.listaCategorias = data;
      this.cdr.detectChanges();
    });

    this.provService.getProveedores().subscribe(data => {
      this.listaProveedores = data;
      this.cdr.detectChanges(); 
    });

    this.unitService.getUnidadesMedida().subscribe(data => {
      this.listaUnidades = data;
      this.cdr.detectChanges();
    });
  }

  guardar() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  cancelar() { 
    this.dialogRef.close(); 
  }
}