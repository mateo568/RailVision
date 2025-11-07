import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Viaje } from '../models/Entity/viaje';
import { DtoPostViaje } from '../models/Dto/dto-viaje';

@Injectable({
  providedIn: 'root'
})
export class ServicioViajesService {

  private URL_DATABASE_VIAJES: string = "http://localhost:8083/railvision/viajes"

  constructor(private client: HttpClient) { }

  getViajes(): Observable<Viaje[]> {
    return this.client.get<Viaje[]>(`${this.URL_DATABASE_VIAJES}`)
  }

  postViaje(nuevoViaje: DtoPostViaje): Observable<Viaje> {
    return this.client.post<Viaje>(`${this.URL_DATABASE_VIAJES}`, nuevoViaje)
  }

  deleteViaje(viajeId: number) {
    return this.client.delete(`${this.URL_DATABASE_VIAJES}/${viajeId}`)
  }
}
