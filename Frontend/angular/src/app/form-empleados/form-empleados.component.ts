import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ServicioUsuariosService } from '../../services/servicio-usuarios.service';
import { Usuario } from '../../models/Entity/usuario';
import Swal from 'sweetalert2'; // 👈 para los mensajes visuales

@Component({
  selector: 'app-form-empleados',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-empleados.component.html',
  styleUrls: ['./form-empleados.component.css']
})
export class FormEmpleadosComponent implements OnInit {
  usuarioForm!: FormGroup;
  editMode = false;
  usuarioId!: number;
  rolesDisponibles: string[] = ['admin', 'operador', 'cliente'];
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: ServicioUsuariosService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // 🔹 Inicializar formulario con validaciones
    this.usuarioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password_hash: ['', [Validators.required, Validators.minLength(4)]],
      rol: ['', [Validators.required]],
      estado: [true]
    });

    // 🔹 Detectar si es edición (viene un ID en la URL)
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.editMode = true;
      this.usuarioId = Number(idParam);
      this.cargarUsuario(this.usuarioId);
    }
  }

  // 🔹 Cargar usuario para edición
  cargarUsuario(id: number): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (usuario) => {
        this.usuarioForm.patchValue(usuario);
      },
      error: (err) => {
        console.error('❌ Error al cargar usuario:', err);
        Swal.fire('Error', 'No se pudo cargar el usuario', 'error');
      }
    });
  }

  // 🔹 Acceso rápido a los controles del form
  get f() {
    return this.usuarioForm.controls;
  }

  // 🔹 Comprobar si un campo es inválido
  isInvalid(campo: string): boolean {
    const control = this.f[campo];
    return control.invalid && (control.dirty || control.touched || this.submitted);
  }

  // 🔹 Enviar formulario (crear o editar)
  onSubmit(): void {
    this.submitted = true;
    if (this.usuarioForm.invalid) return;

    const usuario: Usuario = this.usuarioForm.value;

    if (this.editMode) {
      // ✏️ Modo edición
      this.usuarioService.updateUsuario(this.usuarioId, usuario).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Usuario actualizado',
            text: 'Los cambios se guardaron correctamente.',
            timer: 1500,
            showConfirmButton: false
          });
          this.router.navigate(['/menu/empleados']);
        },
        error: (err) => {
          console.error('❌ Error al actualizar usuario:', err);
          Swal.fire('Error', 'No se pudo actualizar el usuario', 'error');
        }
      });
    } else {
      // 🟢 Modo creación
      this.usuarioService.addUsuario(usuario).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Usuario creado',
            text: 'El usuario se creó correctamente.',
            timer: 1500,
            showConfirmButton: false
          });
          this.router.navigate(['/menu/empleados']);
        },
        error: (err) => {
          console.error('❌ Error al crear usuario:', err);
          Swal.fire('Error', 'No se pudo crear el usuario', 'error');
        }
      });
    }
  }

  volver(): void {
    this.router.navigate(['/menu/empleados']);
  }
}
