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

  getTrenes(): Observable<Tren[]> {
    return this.client.get<{ trenes: Tren[] }>(`${this.URL_DATABASE_TRENES}/`)
    .pipe(map(res => res.trenes))
  }
}
