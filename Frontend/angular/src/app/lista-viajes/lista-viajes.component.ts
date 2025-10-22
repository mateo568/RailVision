import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-viajes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-viajes.component.html',
  styleUrl: './lista-viajes.component.css'
})
export class ListaViajesComponent {
  router = inject(Router);

  irMenuViajes(){
    this.router.navigate(["menu/viajes"]);
  }
}
