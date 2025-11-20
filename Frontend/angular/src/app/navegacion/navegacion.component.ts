import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthRolesService } from '../../services/servicio-auth-roles.service';

@Component({
  selector: 'app-navegacion',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLinkActive],
  templateUrl: './navegacion.component.html',
  styleUrl: './navegacion.component.css'
})
export class NavegacionComponent {
  router = inject(Router);
  
  authRoles = inject(AuthRolesService);
  expand = true;

  Sidebar(){
    this.expand = !this.expand;
  }

  navegar(link: string){
    this.router.navigate([link])
  }

  logout() {
    this.authRoles.logout();
    this.router.navigate(['/login']);
  }
  
}
