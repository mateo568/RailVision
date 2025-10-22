import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  router = inject(Router);
  
    nuevoLogin = new FormGroup({
      usuario: new FormControl('',[Validators.required]),
      contra: new FormControl('',[Validators.required]),
    })

  login(){
    if (this.nuevoLogin.valid){
      this.router.navigate(["menu"]);
    }
  }
}
