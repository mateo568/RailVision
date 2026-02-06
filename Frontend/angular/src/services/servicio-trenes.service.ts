import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Tren } from '../models/Entity/tren';

@Injectable({
  providedIn: 'root'
})
export class ServicioTrenesService {

  private URL_DATABASE_TRENES: string = "http://localhost:8000/trenes"

  constructor(private client: HttpClient) { }

  addTren(tren: any): Observable<any> {
  return this.client.post(
    `${this.URL_DATABASE_TRENES}/add`,
    tren
  );
  }
  
  getTrenes(): Observable<Tren[]> {
    return this.client.get<{ trenes: Tren[] }>(`${this.URL_DATABASE_TRENES}/`)
    .pipe(map(res => res.trenes))
  }

  updateEstadoTren(trenId: number, estado: string): Observable<any> {
  return this.client.put(
    `${this.URL_DATABASE_TRENES}/estado/${trenId}?estado=${estado}`,
    {}
  );
  }

}


