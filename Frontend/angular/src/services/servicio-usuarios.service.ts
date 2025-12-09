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

  getUsuarioById(id: number): Observable<Usuario> {
  return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
}

  addUsuario(usuario: any): Observable<any> {
    const formData = new FormData();
    formData.append('nombre', usuario.nombre);
    formData.append('apellido', usuario.apellido);
    formData.append('email', usuario.email);
    formData.append('password', usuario.password);
    formData.append('rol', usuario.rol);
    formData.append('estado', usuario.estado ? 'true' : 'false');

    return this.http.post(`${this.apiUrl}/add`, formData);
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