import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirm-dialog',
  standalone:true,
  imports: [
    MatDialogModule, 
    MatButtonModule, 
    MatIconModule
  ],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css',
})
export class ConfirmDialogComponent {

  private dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

  cerrar(confirmado:boolean){
    this.dialogRef.close(confirmado);
  }

}
