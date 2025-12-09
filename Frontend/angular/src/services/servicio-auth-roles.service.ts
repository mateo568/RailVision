import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthRolesService {

  getRol(): string | null {
    return localStorage.getItem('rol');
  }

  esAdmin(): boolean {
    return this.getRol() === 'admin';
  }

  esOperador(): boolean {
    return this.getRol() === 'operador';
  }

  esCliente(): boolean {
    return this.getRol() === 'cliente';
  }

  estaLogueado(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
  }
}
