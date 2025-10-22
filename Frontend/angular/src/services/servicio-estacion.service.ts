import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Estacion } from '../models/Entity/estacion';
import { HttpClient } from '@angular/common/http';
import { Ciudad } from '../models/Entity/ciudad';
import { DtoPutEstacion } from '../models/Dto/dto-put-estacion';

@Injectable({
  providedIn: 'root'
})
export class ServicioEstacionService {

  private URL_DATABASE_ESTACION: string = "http://localhost:8081/railvision/estaciones"
  private URL_DATABASE_CIUDAD: string = "http://localhost:8081/railvision/ciudades"

  constructor(private client: HttpClient) { }

  getEstaciones():Observable<Estacion[]>{
    return this.client.get<Estacion[]>(`${this.URL_DATABASE_ESTACION}`)
  }

  getCiudades():Observable<Ciudad[]>{
    return this.client.get<Ciudad[]>(`${this.URL_DATABASE_CIUDAD}`)
  }

  putEstadoEstacion(estacion: DtoPutEstacion): Observable<Estacion>{
    const datos = {
      nombre: estacion.nombre,
      estado: estacion.estado
    }
    return this.client.put<Estacion>(`${this.URL_DATABASE_ESTACION}/${estacion.id}`, datos);
  }
}
