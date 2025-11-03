import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Viaje } from '../models/Entity/viaje';

@Injectable({
  providedIn: 'root'
})
export class ServicioViajesService {

  private URL_DATABASE_VIAJES: string = "http://localhost:8083/railvision/viajes"

  constructor(private client: HttpClient) { }

  getViajes(): Observable<Viaje[]> {
    return this.client.get<Viaje[]>(`${this.URL_DATABASE_VIAJES}`)
  }
}
