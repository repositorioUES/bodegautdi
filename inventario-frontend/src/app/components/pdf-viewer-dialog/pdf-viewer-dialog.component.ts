import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-viewer-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="d-flex justify-content-between align-items-center p-3 border-bottom bg-light">
      <h2 class="m-0 fw-bold text-dark">{{ data.titulo }}</h2>
      <button mat-icon-button (click)="cerrar()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
    
    <div class="pdf-container">
      <iframe [src]="urlSegura" width="100%" height="100%" frameborder="0"></iframe>
    </div>
  `,
  styles: [`
    .pdf-container {
      height: 80vh;
      width: 100%;
      background-color: #525659;
    }
  `]
})
export class PdfViewerDialogComponent implements OnInit {

  urlSegura: SafeResourceUrl | null = null;

  constructor(
    public dialogRef: MatDialogRef<PdfViewerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { url: string, titulo: string },
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.urlSegura = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.url);
  }

  cerrar() {
    this.dialogRef.close();
  }
}
