import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MainLayoutComponent } from '../../shared/layouts/main-layout/main-layout.component';
import { ToastService } from '../../shared/toast.service';
import { AuthService } from '../auth/auth.service';
import { Course } from '../manage-classes/course.model';
import { CourseService } from '../manage-classes/course.service';
import { AttendanceDetail, SessionWithAttendances } from './attendance-history.model';
import { AttendanceHistoryService } from './attendance-history.service';

@Component({
  selector: 'app-attendance-history',
  standalone: true,
  imports: [CommonModule, FormsModule, MainLayoutComponent],
  templateUrl: './attendance-history.html',
})
export class AttendanceHistoryComponent implements OnInit {
  currentDate: string = '';
  currentUser: string = 'User';
  activeMenu: string = 'attendance-history';

  // Data
  courses: Course[] = [];
  sessions: SessionWithAttendances[] = [];
  selectedSession: SessionWithAttendances | null = null;
  attendances: AttendanceDetail[] = [];

  // Filter
  selectedCourseId: number = 0;
  dateFrom: string = '';
  dateTo: string = '';
  searchText: string = '';

  // Loading states
  isLoadingCourses: boolean = false;
  isLoadingSessions: boolean = false;
  isLoadingAttendances: boolean = false;

  // Modal
  showDetailModal: boolean = false;

  // Filtered attendances for search
  filteredAttendances: AttendanceDetail[] = [];

  constructor(
    private router: Router,
    private courseService: CourseService,
    private attendanceHistoryService: AttendanceHistoryService,
    private authService: AuthService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.setCurrentDate();

    // Get current user
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentUser = user.name;
    }

    // Set default date range (last 30 days)
    const today = new Date();
    this.dateTo = today.toISOString().split('T')[0];
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    this.dateFrom = thirtyDaysAgo.toISOString().split('T')[0];

    this.loadCourses();
    this.loadSessions();

    // Update current date every minute
    setInterval(() => {
      this.setCurrentDate();
    }, 60000);
  }

  setCurrentDate(): void {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];

    const now = new Date();
    const dayName = days[now.getDay()];
    const day = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    this.currentDate = `${dayName}, ${day} ${month} ${year} ${hours}:${minutes}`;
  }

  loadCourses(): void {
    this.isLoadingCourses = true;
    this.courseService.getCourses().subscribe({
      next: (response) => {
        this.isLoadingCourses = false;
        this.courses = response.data.courses;
      },
      error: (error) => {
        this.isLoadingCourses = false;
        this.toastService.error(error.message, 'Gagal Memuat Kelas');
      },
    });
  }

  loadSessions(): void {
    this.isLoadingSessions = true;
    const params: any = {};
    if (this.selectedCourseId > 0) params.course_id = this.selectedCourseId;
    if (this.dateFrom) params.date_from = this.dateFrom;
    if (this.dateTo) params.date_to = this.dateTo;

    console.log('Loading sessions with params:', params);

    this.attendanceHistoryService.getSessionsWithAttendances(params).subscribe({
      next: (response) => {
        this.isLoadingSessions = false;
        console.log('Sessions loaded:', response.data);
        this.sessions = response.data.sessions;
      },
      error: (error) => {
        this.isLoadingSessions = false;
        console.error('Error loading sessions:', error);
        if (error.status !== 404) {
          this.toastService.error(error.message, 'Gagal Memuat Data');
        }
        this.sessions = [];
      },
    });
  }

  onFilterChange(): void {
    this.loadSessions();
  }

  viewAttendances(session: SessionWithAttendances): void {
    this.selectedSession = session;
    this.isLoadingAttendances = true;
    this.showDetailModal = true;

    this.attendanceHistoryService.getAttendancesBySession(session.id).subscribe({
      next: (response) => {
        this.isLoadingAttendances = false;
        this.attendances = response.data.attendances;
        this.filteredAttendances = [...this.attendances];
      },
      error: (error) => {
        this.isLoadingAttendances = false;
        if (error.status !== 404) {
          this.toastService.error(error.message, 'Gagal Memuat Kehadiran');
        }
        this.attendances = [];
        this.filteredAttendances = [];
      },
    });
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedSession = null;
    this.attendances = [];
    this.filteredAttendances = [];
    this.searchText = '';
  }

  filterAttendances(): void {
    if (!this.searchText) {
      this.filteredAttendances = [...this.attendances];
      return;
    }

    const searchLower = this.searchText.toLowerCase();
    this.filteredAttendances = this.attendances.filter(
      (att) =>
        att.student?.name?.toLowerCase().includes(searchLower) ||
        att.student?.username?.toLowerCase().includes(searchLower),
    );
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  formatTime(time: string): string {
    if (!time) return '';
    const parts = time.split(':');
    if (parts.length >= 2) {
      let hours = parseInt(parts[0], 10);
      const minutes = parts[1];
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    }
    return time;
  }

  formatTimestamp(timestamp: string | null): string {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  getStatusBadgeClass(status: string | null): string {
    if (status === 'present') return 'bg-green-100 text-green-800';
    if (status === 'late') return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-600';
  }

  getStatusText(status: string | null): string {
    if (status === 'present') return 'Hadir';
    if (status === 'late') return 'Terlambat';
    return 'Belum Absen';
  }

  getAttendanceCount(session: SessionWithAttendances): number {
    return session.attendances?.filter((a) => a.confirmed).length || 0;
  }

  downloadReport(): void {
    if (!this.selectedSession) return;

    // Create CSV content
    let csv = 'No,Nama,Username,Status,Waktu Absen\n';
    this.filteredAttendances.forEach((att, index) => {
      csv += `${index + 1},${att.student?.name || '-'},${att.student?.username || '-'},${this.getStatusText(att.status)},${this.formatTimestamp(att.timestamp)}\n`;
    });

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `Absensi_${this.selectedSession.course?.code}_${this.selectedSession.date}.csv`,
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.toastService.success('Laporan berhasil diunduh!', 'Berhasil');
  }

  getPresentCount(): number {
    return this.filteredAttendances.filter((a) => a.status === 'present').length;
  }

  getLateCount(): number {
    return this.filteredAttendances.filter((a) => a.status === 'late').length;
  }

  getAbsentCount(): number {
    return this.filteredAttendances.filter((a) => !a.status).length;
  }
}
