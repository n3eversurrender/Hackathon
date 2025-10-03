import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import {
  CourseSchedule,
  CreateCourseScheduleDto,
  UpdateCourseScheduleDto,
} from './course-schedule.model';

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

interface ScheduleListResponse {
  count: number;
  schedules: CourseSchedule[];
}

@Injectable({
  providedIn: 'root',
})
export class CourseScheduleService {
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

  getSchedulesByCourse(courseId: number): Observable<ApiResponse<ScheduleListResponse>> {
    return this.http.get<ApiResponse<ScheduleListResponse>>(
      `${this.apiUrl}/api/v1/courses/${courseId}/schedules`,
      { headers: this.getHeaders() },
    );
  }

  getSchedule(courseId: number, scheduleId: number): Observable<ApiResponse<CourseSchedule>> {
    return this.http.get<ApiResponse<CourseSchedule>>(
      `${this.apiUrl}/api/v1/courses/${courseId}/schedules/${scheduleId}`,
      { headers: this.getHeaders() },
    );
  }

  createSchedule(
    courseId: number,
    data: CreateCourseScheduleDto,
  ): Observable<ApiResponse<CourseSchedule>> {
    return this.http.post<ApiResponse<CourseSchedule>>(
      `${this.apiUrl}/api/v1/courses/${courseId}/schedules`,
      data,
      { headers: this.getHeaders() },
    );
  }

  updateSchedule(
    courseId: number,
    scheduleId: number,
    data: UpdateCourseScheduleDto,
  ): Observable<ApiResponse<CourseSchedule>> {
    return this.http.put<ApiResponse<CourseSchedule>>(
      `${this.apiUrl}/api/v1/courses/${courseId}/schedules/${scheduleId}`,
      data,
      { headers: this.getHeaders() },
    );
  }

  deleteSchedule(courseId: number, scheduleId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.apiUrl}/api/v1/courses/${courseId}/schedules/${scheduleId}`,
      { headers: this.getHeaders() },
    );
  }
}
