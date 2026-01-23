import { Component,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

// Material Imports
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-categoria-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './categoria-dialog.component.html',
  styles: [`
    mat-form-field { width: 100%; }
  `]
})
export class CategoriaDialogComponent {

  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CategoriaDialogComponent>);

  form: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]]
  });

  guardar() {
    if (this.form.valid) {
      // Cerramos el diálogo y enviamos el valor del formulario a la lista
      this.dialogRef.close(this.form.value);
    }
  }

  cancelar() {
    this.dialogRef.close();
  }

}
