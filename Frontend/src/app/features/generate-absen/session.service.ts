import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import {
  CreateSessionDto,
  Session,
  SessionListResponse,
  UpdateSessionDto,
} from './session.model';

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getSessions(): Observable<ApiResponse<SessionListResponse>> {
    return this.http.get<ApiResponse<SessionListResponse>>(
      `${this.apiUrl}/api/v1/sessions`,
      { headers: this.getHeaders() },
    );
  }

  getSession(id: number): Observable<ApiResponse<Session>> {
    return this.http.get<ApiResponse<Session>>(
      `${this.apiUrl}/api/v1/sessions/${id}`,
      { headers: this.getHeaders() },
    );
  }

  createSession(data: CreateSessionDto): Observable<ApiResponse<Session>> {
    return this.http.post<ApiResponse<Session>>(
      `${this.apiUrl}/api/v1/sessions`,
      data,
      { headers: this.getHeaders() },
    );
  }

  updateSession(id: number, data: UpdateSessionDto): Observable<ApiResponse<Session>> {
    return this.http.put<ApiResponse<Session>>(
      `${this.apiUrl}/api/v1/sessions/${id}`,
      data,
      { headers: this.getHeaders() },
    );
  }

  deleteSession(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.apiUrl}/api/v1/sessions/${id}`,
      { headers: this.getHeaders() },
    );
  }
}

