import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ruta } from '../models/Entity/ruta';
import { DtoPutRuta } from '../models/Dto/dto-ruta';

@Injectable({
  providedIn: 'root'
})
export class ServicioRutasService {

  private URL_DATABASE_RUTAS: string = "http://localhost:8082/railvision/rutas"

  constructor(private client: HttpClient) { }

  getRutas(): Observable<Ruta[]>{
    return this.client.get<Ruta[]>(`${this.URL_DATABASE_RUTAS}`)
  }

  putRutas(dtoRutas: DtoPutRuta[]): Observable<Ruta[]> {
    return this.client.put<Ruta[]>(`${this.URL_DATABASE_RUTAS}`, dtoRutas)
  }

  putEstadoRuta(id: number, estado: string): Observable<Ruta> {
    return this.client.put<Ruta>(`${this.URL_DATABASE_RUTAS}/${id}`, estado, {headers: { 'Content-Type': 'text/plain' }})
  }

}
