import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicioUsuariosService } from '../../services/servicio-usuarios.service';
import { Usuario } from '../../models/Entity/usuario';
import { Router } from '@angular/router';
import { AuthRolesService } from '../../services/servicio-auth-roles.service';
import { FormsModule } from '@angular/forms';   // 👈 NUEVO
declare var bootstrap: any;

@Component({
  selector: 'app-lista-empleados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-empleados.component.html',
  styleUrls: ['./lista-empleados.component.css']
})
export class ListaEmpleadosComponent implements OnInit, OnDestroy {
  usuarios: Usuario[] = [];
  usuariosFiltrados: any[] = [];

  filtroRol: string = '';
  private tooltips: any[] = [];

  constructor(
    private usuarioService: ServicioUsuariosService,
    private router: Router,
    public authRoles: AuthRolesService,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarToggles();
  }


  private cargarToggles() {
      const tooltipElements = this.el.nativeElement.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipElements.forEach((el: HTMLElement) => {
      const tooltip = new bootstrap.Tooltip(el);
      this.tooltips.push(tooltip);
    });
  }


  cargarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (res) => {
        console.log("📌 Usuarios recibidos del backend:", res.usuarios);

        this.usuarios = res.usuarios;

        if (this.filtroRol) {
          this.usuariosFiltrados = this.usuarios.filter(u => u.rol === this.filtroRol);
          console.log("📌 Aplicando filtro existente:", this.filtroRol);
        } else {
          this.usuariosFiltrados = [...this.usuarios];
          console.log("📌 Sin filtro, mostrando todos");
        }

        console.log("📌 Usuarios filtrados:", this.usuariosFiltrados);
      },
      error: (err) => console.error("❌ Error al cargar usuarios:", err)
    });
  }

  filtrarPorRol(rol: string): void {
    console.log("🔄 Filtro seleccionado:", rol);
    console.log("👀 Usuarios actuales:", this.usuarios);

    this.filtroRol = rol;

    if (rol) {
      this.usuariosFiltrados = this.usuarios.filter(u => u.rol === rol);
      console.log("✅ Usuarios después del filtro:", this.usuariosFiltrados);
    } else {
      this.usuariosFiltrados = [...this.usuarios];
      console.log("🔁 Sin filtro → restaurando lista completa");
    }
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



  ngOnDestroy(): void {
    const tooltipTriggerList = this.el.nativeElement.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach((tooltipTriggerEl: any) => {
      const t = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
      if (t) {
        t.dispose();
      }
    });
  }
}
