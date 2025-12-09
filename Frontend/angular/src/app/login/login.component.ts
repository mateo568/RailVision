import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ServicioAuthService } from '../../services/servicio-auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private authService: ServicioAuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    this.authService.login(email, password).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('rol', res.rol); //Se guarda el rol de usuario
        Swal.fire('Bienvenido', 'Inicio de sesión exitoso', 'success');
        this.router.navigate(['/menu/viajes']);
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', err.error.detail || 'Credenciales inválidas', 'error');
      }
    });
  }
}