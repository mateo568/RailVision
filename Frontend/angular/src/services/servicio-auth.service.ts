import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginResponse {
  status: string;
  usuario_id: number;
  email: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServicioAuthService {
  private apiUrl = 'http://localhost:8000/auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      formData
    );
  }
}