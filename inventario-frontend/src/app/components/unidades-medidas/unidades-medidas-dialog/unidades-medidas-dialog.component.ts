import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-unidades-medidas-dialog',
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, 
    MatButtonModule, MatFormFieldModule, MatInputModule
  ],
  templateUrl: './unidades-medidas-dialog.component.html',
  styles: [`mat-form-field { width: 100%; margin-bottom: 10px; }`]
})
export class UnidadesMedidasDialogComponent {

  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UnidadesMedidasDialogComponent>);

  form : FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    abreviatura: ['', [Validators.required]]
  });

  guardar(){
    if(this.form.valid){
      this.dialogRef.close(this.form.value);
    }
  }

  cancelar(){
    this.dialogRef.close();
  }
}
