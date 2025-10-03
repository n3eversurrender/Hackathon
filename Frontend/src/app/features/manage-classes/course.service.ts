import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import {
  ApiResponse,
  Course,
  CourseSchedule,
  CoursesListResponse,
  CreateCourseDto,
  CreateCourseScheduleDto,
  UpdateCourseDto,
  UpdateCourseScheduleDto,
} from './course.model';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
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

  // Course APIs
  getCourses(): Observable<ApiResponse<CoursesListResponse>> {
    return this.http
      .get<ApiResponse<CoursesListResponse>>(`${this.apiUrl}/api/v1/courses`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  getCourse(id: number): Observable<ApiResponse<Course>> {
    return this.http
      .get<ApiResponse<Course>>(`${this.apiUrl}/api/v1/courses/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  createCourse(data: CreateCourseDto): Observable<ApiResponse<Course>> {
    return this.http
      .post<ApiResponse<Course>>(`${this.apiUrl}/api/v1/courses`, data, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  updateCourse(id: number, data: UpdateCourseDto): Observable<ApiResponse<Course>> {
    return this.http
      .put<ApiResponse<Course>>(`${this.apiUrl}/api/v1/courses/${id}`, data, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  deleteCourse(id: number): Observable<ApiResponse<any>> {
    return this.http
      .delete<ApiResponse<any>>(`${this.apiUrl}/api/v1/courses/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  // Course Schedule APIs
  getCourseSchedules(courseId: number): Observable<ApiResponse<CourseSchedule[]>> {
    return this.http
      .get<ApiResponse<CourseSchedule[]>>(`${this.apiUrl}/api/v1/courses/${courseId}/schedules`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  getCourseSchedule(courseId: number, scheduleId: number): Observable<ApiResponse<CourseSchedule>> {
    return this.http
      .get<ApiResponse<CourseSchedule>>(
        `${this.apiUrl}/api/v1/courses/${courseId}/schedules/${scheduleId}`,
        {
          headers: this.getHeaders(),
        },
      )
      .pipe(catchError(this.handleError));
  }

  createCourseSchedule(
    courseId: number,
    data: CreateCourseScheduleDto,
  ): Observable<ApiResponse<CourseSchedule>> {
    return this.http
      .post<ApiResponse<CourseSchedule>>(
        `${this.apiUrl}/api/v1/courses/${courseId}/schedules`,
        data,
        {
          headers: this.getHeaders(),
        },
      )
      .pipe(catchError(this.handleError));
  }

  updateCourseSchedule(
    courseId: number,
    scheduleId: number,
    data: UpdateCourseScheduleDto,
  ): Observable<ApiResponse<CourseSchedule>> {
    return this.http
      .put<ApiResponse<CourseSchedule>>(
        `${this.apiUrl}/api/v1/courses/${courseId}/schedules/${scheduleId}`,
        data,
        {
          headers: this.getHeaders(),
        },
      )
      .pipe(catchError(this.handleError));
  }

  deleteCourseSchedule(courseId: number, scheduleId: number): Observable<ApiResponse<any>> {
    return this.http
      .delete<ApiResponse<any>>(
        `${this.apiUrl}/api/v1/courses/${courseId}/schedules/${scheduleId}`,
        {
          headers: this.getHeaders(),
        },
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Terjadi kesalahan';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      if (error.error?.message) {
        if (Array.isArray(error.error.message)) {
          errorMessage = error.error.message.join(', ');
        } else {
          errorMessage = error.error.message;
        }
      } else {
        errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
