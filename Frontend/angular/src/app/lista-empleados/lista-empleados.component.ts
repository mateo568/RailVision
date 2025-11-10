import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicioUsuariosService } from '../../services/servicio-usuarios.service';
import { Usuario } from '../../models/Entity/usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-empleados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-empleados.component.html',
  styleUrls: ['./lista-empleados.component.css']
})
export class ListaEmpleadosComponent implements OnInit {
  usuarios: Usuario[] = [];

  constructor(
    private usuarioService: ServicioUsuariosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (res) => this.usuarios = res.usuarios,
      error: (err) => console.error('❌ Error al cargar usuarios:', err)
    });
  }

  eliminarUsuario(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este usuario?')) {
      this.usuarioService.deleteUsuario(id).subscribe({
        next: () => this.cargarUsuarios(),
        error: (err) => console.error('❌ Error al eliminar usuario:', err)
      });
    }
  }

  editarUsuario(id: number): void {
    this.router.navigate([`/menu/empleados/editar/${id}`]);
  }

  irPostEmpleado(): void {
    this.router.navigate(['/menu/empleados/post']);
  }
}
