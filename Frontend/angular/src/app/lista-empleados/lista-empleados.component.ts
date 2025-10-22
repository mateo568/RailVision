import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-empleados',
  standalone: true,
  imports: [],
  templateUrl: './lista-empleados.component.html',
  styleUrl: './lista-empleados.component.css'
})
export class ListaEmpleadosComponent {

  router = inject(Router);

  listaNombres: string[] = ["Bob Esponja","Cloud Strife","Michael de Santa","Master Chief","Peter Griffin","Nathan Drake"];

  irPostEmpleado(){
    this.router.navigate(["menu/empleados/post"]);
  }
}
