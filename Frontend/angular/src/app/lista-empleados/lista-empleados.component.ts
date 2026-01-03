import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
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
export class ListaEmpleadosComponent implements OnInit, AfterViewInit, OnDestroy {
  usuarios: Usuario[] = [];
  usuariosFiltrados: any[] = [];

  filtroNombre: string = '';
  filtroEmail: string = '';
  filtroRol: string = '';
  filtroEstado: string = '';

  private tooltips: any[] = [];

  constructor(
    private usuarioService: ServicioUsuariosService,
    private router: Router,
    public authRoles: AuthRolesService,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();

    setTimeout(() => {
      localStorage.setItem('nombrePantalla', 'Empleados')
      window.dispatchEvent(new Event('storage'));
    });
  }
  
  ngAfterViewInit(): void {
    this.cargarToggles();
  }


  private cargarToggles() {
      const tooltipElements = this.el.nativeElement.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipElements.forEach((el: HTMLElement) => {
      const tooltip = new bootstrap.Tooltip(el, { container: 'body', trigger: 'hover' });
      this.tooltips.push(tooltip);
    });
  }


  cargarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (res) => {
        console.log("Usuarios recibidos del backend:", res.usuarios);

        this.filtroNombre = "";
        this.filtroEmail = "";
        this.filtroRol = '';
        this.filtroEstado = '';
        this.usuarios = res.usuarios;
        this.usuariosFiltrados = [...this.usuarios];
      },
      error: (err) => console.error("Error al cargar usuarios:", err)
    });
  }

  filtrar(): void {
    this.usuariosFiltrados = this.usuarios;

    if (this.filtroRol) {
      this.usuariosFiltrados = this.usuariosFiltrados.filter(u => u.rol === this.filtroRol);
      console.log("Usuarios después del filtro:", this.usuariosFiltrados);
    } 

    if (this.filtroNombre && this.filtroNombre.length >= 3) {
      this.usuariosFiltrados = this.usuariosFiltrados.filter( usuario => {
        var nombreCompleto = `${usuario.nombre} ${usuario.apellido}` 
        return nombreCompleto.toUpperCase().includes(this.filtroNombre.toUpperCase())
      })
    }

    if (this.filtroEmail && this.filtroEmail.length >= 3) {
      this.usuariosFiltrados = this.usuariosFiltrados.filter( usuario => {
        return usuario.email.toUpperCase().includes(this.filtroEmail.toUpperCase())
      })
    }

    if (this.filtroEstado) {
      const valor = this.filtroEstado === "true";
      this.usuariosFiltrados = this.usuariosFiltrados.filter( usuario => {
        return usuario.estado == valor; 
      });
    }
  }

  limpiarFiltros() {
    this.filtroNombre = "";
    this.filtroEmail = "";
    this.filtroRol = '';
    this.filtroEstado = '';
    this.filtrar();
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
