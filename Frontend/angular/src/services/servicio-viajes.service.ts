import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Viaje } from '../models/Entity/viaje';
import { DtoPostViaje, DtoPutViaje } from '../models/Dto/dto-viaje';

@Injectable({
  providedIn: 'root'
})
export class ServicioViajesService {

  private URL_DATABASE_VIAJES: string = "http://localhost:8083/railvision/viajes"

  constructor(private client: HttpClient) { }

  getViajes(): Observable<Viaje[]> {
    return this.client.get<Viaje[]>(`${this.URL_DATABASE_VIAJES}`)
  }

  getViajesExistentes(rutasId: number[]): Observable<Boolean> {
    return this.client.get<Boolean>(`${this.URL_DATABASE_VIAJES}/viajesExistentes`,  { params: {rutasId: rutasId.join(',')} })
  }

  postViaje(nuevoViaje: DtoPostViaje): Observable<Viaje> {
    return this.client.post<Viaje>(`${this.URL_DATABASE_VIAJES}`, nuevoViaje)
  }

  putViaje(viajeModificado: DtoPutViaje): Observable<Viaje> {
    return this.client.put<Viaje>(`${this.URL_DATABASE_VIAJES}`, viajeModificado)
  }

  deleteViaje(viajeId: number) {
    return this.client.delete(`${this.URL_DATABASE_VIAJES}/${viajeId}`)
  }
}
