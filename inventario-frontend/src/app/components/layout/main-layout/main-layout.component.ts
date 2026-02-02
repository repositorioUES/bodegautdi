import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { BreadcrumbComponent } from '../../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, BreadcrumbComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css' // Si tenías estilos específicos muévelos aquí
})
export class MainLayoutComponent {}