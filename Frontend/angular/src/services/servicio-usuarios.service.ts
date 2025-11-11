import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/Entity/usuario';

@Injectable({
  providedIn: 'root'
})
export class ServicioUsuariosService {
  private apiUrl = 'http://localhost:8000/usuarios'; // Ajusta el puerto si cambia tu backend

  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios
  getUsuarios(): Observable<{ usuarios: Usuario[] }> {
    return this.http.get<{ usuarios: Usuario[] }>(`${this.apiUrl}/`);
  }

  // Crear usuario nuevo
  addUsuario(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, usuario);
  }

  // Actualizar usuario existente
  updateUsuario(usuario_id: number, usuario: Usuario): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${usuario_id}`, usuario);
  }

  // Eliminar usuario
  deleteUsuario(usuario_id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${usuario_id}`);
  }
}