import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RolService } from '../../../services/rol.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-usuario-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, 
    MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatIconModule
  ],
  templateUrl: './usuario-dialog.component.html',
  styles: [`mat-form-field { width: 100%; margin-bottom: 10px; }`]
  //styleUrl: './usuario-dialog.component.css',
})
export class UsuarioDialogComponent implements OnInit{

  private fb = inject(FormBuilder);
  private rolService = inject(RolService);
  private dialogRef = inject(MatDialogRef<UsuarioDialogComponent>);

  listaRoles: any[] = [];

  form: FormGroup = this.fb.group({
    nombreusuario: ['', [Validators.required, Validators.minLength(4)]],
    passwordusuario: ['', [Validators.required, Validators.minLength(6)]],
    idrol: [null, Validators.required]
  });

  ngOnInit(): void {
    this.rolService.getRoles().subscribe(data => this.listaRoles = data);
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
