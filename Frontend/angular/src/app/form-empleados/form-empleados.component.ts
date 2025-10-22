import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-empleados',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-empleados.component.html',
  styleUrl: './form-empleados.component.css'
})
export class FormEmpleadosComponent {
  
  router = inject(Router); 

  nuevoEmpleado = new FormGroup({
    nombre: new FormControl('',[Validators.required]),
    email: new FormControl('',[Validators.required]),
    telefono: new FormControl('',[Validators.required]),
    direccion: new FormControl('',[Validators.required]),
    departamento: new FormControl('',[]),
    hijos: new FormControl('',[]),
    obraSocial: new FormControl('',[Validators.required]),
    cbu: new FormControl('',[Validators.required, Validators.minLength(22), Validators.maxLength(22)]),
    cuil: new FormControl('',[Validators.required, Validators.minLength(11), Validators.maxLength(11)]),
  })
  
  submit(){
    alert("A")
  }

  irListaEmpleados(){
    this.router.navigate(["menu/empleados"]);
  }
}
