import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthRolesService } from '../../services/servicio-auth-roles.service';

@Component({
  selector: 'app-navegacion',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLinkActive],
  templateUrl: './navegacion.component.html',
  styleUrl: './navegacion.component.css'
})
export class NavegacionComponent implements OnInit {
  router = inject(Router);
  nombrePantalla = localStorage.getItem('nombrePantalla');
  
  authRoles = inject(AuthRolesService);
  expand = false;
  animar = false;


  ngOnInit(): void {
    window.addEventListener('storage', () => {
      this.nombrePantalla = localStorage.getItem('nombrePantalla') ?? '';
    });

    this.nombrePantalla = localStorage.getItem('nombrePantalla') ?? '';
  }

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
