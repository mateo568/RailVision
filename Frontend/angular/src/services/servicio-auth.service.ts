import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioAuthService {
  private apiUrl = 'http://localhost:8000/auth'; // o tu endpoint real

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    return this.http.post(`${this.apiUrl}/login`, formData);
  }
}
