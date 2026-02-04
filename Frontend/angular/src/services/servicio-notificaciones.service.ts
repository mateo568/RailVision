import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificacionUsuario } from '../models/Entity/notificacion-usuario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioNotificacionesService {

  private URL_DATABASE_NOTIFICACIONES: string = "http://localhost:8083/railvision/notificaciones"

  constructor(private client: HttpClient) { }

  getNotificacionesNoLeidas(usuarioId: number): Observable<NotificacionUsuario[]>{
    return this.client.get<NotificacionUsuario[]>(`${this.URL_DATABASE_NOTIFICACIONES}/usuario/${usuarioId}`)
  }

  putNotificacionLeida(notificacionId: number) {
    return this.client.put(`${this.URL_DATABASE_NOTIFICACIONES}/usuario/${notificacionId}/leida`, null)
  }
}
