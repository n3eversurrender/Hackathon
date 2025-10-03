import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { DashboardStatistics, RecentAttendance, SessionWithStats } from './dashboard.model';

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
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

  getStatistics(date?: string): Observable<ApiResponse<DashboardStatistics>> {
    const params = date ? `?date=${date}` : '';
    return this.http.get<ApiResponse<DashboardStatistics>>(
      `${this.apiUrl}/api/v1/dashboard/statistics${params}`,
      { headers: this.getHeaders() },
    );
  }

  getTodaySessions(date?: string): Observable<ApiResponse<{ sessions: SessionWithStats[] }>> {
    const params = date ? `?date=${date}` : '';
    return this.http.get<ApiResponse<{ sessions: SessionWithStats[] }>>(
      `${this.apiUrl}/api/v1/dashboard/today-sessions${params}`,
      { headers: this.getHeaders() },
    );
  }

  getRecentAttendances(): Observable<ApiResponse<{ attendances: RecentAttendance[] }>> {
    return this.http.get<ApiResponse<{ attendances: RecentAttendance[] }>>(
      `${this.apiUrl}/api/v1/dashboard/recent-attendances`,
      { headers: this.getHeaders() },
    );
  }
}
