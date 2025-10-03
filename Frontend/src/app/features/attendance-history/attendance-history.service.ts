import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { AttendanceDetail, SessionWithAttendances } from './attendance-history.model';

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class AttendanceHistoryService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  // Get all sessions with attendances (optionally filtered)
  getSessionsWithAttendances(params?: {
    course_id?: number;
    date_from?: string;
    date_to?: string;
  }): Observable<ApiResponse<{ sessions: SessionWithAttendances[] }>> {
    let queryParams = '';
    if (params) {
      const queryArray: string[] = [];
      if (params.course_id) queryArray.push(`course_id=${params.course_id}`);
      if (params.date_from) queryArray.push(`date_from=${params.date_from}`);
      if (params.date_to) queryArray.push(`date_to=${params.date_to}`);
      if (queryArray.length > 0) {
        queryParams = '?' + queryArray.join('&');
      }
    }
    return this.http.get<ApiResponse<{ sessions: SessionWithAttendances[] }>>(
      `${this.apiUrl}/api/v1/sessions${queryParams}`,
      { headers: this.getHeaders() },
    );
  }

  // Get specific session with its attendances
  getSessionDetail(sessionId: number): Observable<ApiResponse<SessionWithAttendances>> {
    return this.http.get<ApiResponse<SessionWithAttendances>>(
      `${this.apiUrl}/api/v1/sessions/${sessionId}`,
      { headers: this.getHeaders() },
    );
  }

  // Get attendances for a specific session
  getAttendancesBySession(
    sessionId: number,
  ): Observable<ApiResponse<{ attendances: AttendanceDetail[] }>> {
    return this.http.get<ApiResponse<{ attendances: AttendanceDetail[] }>>(
      `${this.apiUrl}/api/v1/attendances?session_id=${sessionId}`,
      { headers: this.getHeaders() },
    );
  }
}
