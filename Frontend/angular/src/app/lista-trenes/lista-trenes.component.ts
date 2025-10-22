import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-lista-trenes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-trenes.component.html',
  styleUrl: './lista-trenes.component.css'
})
export class ListaTrenesComponent {

  nuevoTren = new FormGroup({
      tipo: new FormControl('',[Validators.required]),
      capacidad: new FormControl(0,[Validators.required]),
      //cantVagones: new FormControl('',[Validators.required]),
  })

}
