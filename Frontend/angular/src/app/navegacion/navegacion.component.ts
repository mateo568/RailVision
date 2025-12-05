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
  expand = false;
  animar = false;

  Sidebar(){
    this.animar = true;
    this.expand = !this.expand;
  }

  navegar(link: string){
    this.animar = false;
    this.router.navigate([link])
  }

  logout() {
    this.authRoles.logout();
    this.router.navigate(['/login']);
  }
  
}
