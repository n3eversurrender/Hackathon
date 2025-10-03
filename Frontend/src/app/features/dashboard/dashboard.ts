import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MainLayoutComponent } from '../../shared/layouts/main-layout/main-layout.component';
import { ToastService } from '../../shared/toast.service';
import { AuthService } from '../auth/auth.service';
import { DashboardStatistics, RecentAttendance, SessionWithStats } from './dashboard.model';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MainLayoutComponent],
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit {
  currentDate: string = '';
  currentUser: string = 'User';

  // Statistics
  statistics: DashboardStatistics = {
    totalSessions: 0,
    totalAttendances: 0,
    averageAttendance: 0,
    date: '',
  };

  // Sessions today
  sessions: SessionWithStats[] = [];
  activeSessions: SessionWithStats[] = [];

  // Recent attendances
  recentAttendances: RecentAttendance[] = [];

  // Loading states
  isLoadingStats: boolean = false;
  isLoadingSessions: boolean = false;
  isLoadingAttendances: boolean = false;

  // Filter states
  selectedDate: string = '';

  // Sidebar menu state
  activeMenu: string = 'beranda';

  constructor(
    private router: Router,
    private dashboardService: DashboardService,
    private authService: AuthService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.setCurrentDate();
    this.selectedDate = new Date().toISOString().split('T')[0];

    // Get current user
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentUser = user.name;
    }

    // Load dashboard data
    this.loadStatistics();
    this.loadSessions();
    this.loadRecentAttendances();

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

  loadStatistics(): void {
    this.isLoadingStats = true;
    this.dashboardService.getStatistics(this.selectedDate).subscribe({
      next: (response) => {
        this.isLoadingStats = false;
        this.statistics = response.data;
      },
      error: (error) => {
        this.isLoadingStats = false;
        this.toastService.error(error.message, 'Gagal Memuat Statistik');
      },
    });
  }

  loadSessions(): void {
    this.isLoadingSessions = true;
    this.dashboardService.getTodaySessions(this.selectedDate).subscribe({
      next: (response) => {
        this.isLoadingSessions = false;
        this.sessions = response.data.sessions;
        this.activeSessions = this.sessions.filter((s) => s.isActive);
      },
      error: (error) => {
        this.isLoadingSessions = false;
        this.toastService.error(error.message, 'Gagal Memuat Sesi');
      },
    });
  }

  loadRecentAttendances(): void {
    this.isLoadingAttendances = true;
    this.dashboardService.getRecentAttendances().subscribe({
      next: (response) => {
        this.isLoadingAttendances = false;
        this.recentAttendances = response.data.attendances;
      },
      error: (error) => {
        this.isLoadingAttendances = false;
        // Don't show error for recent attendances, just keep it empty
      },
    });
  }

  onDateChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.selectedDate = target.value;
    this.loadStatistics();
    this.loadSessions();
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

  formatTimestamp(timestamp: string): string {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  viewSessionDetail(session: SessionWithStats): void {
    // Navigate to attendance history or show modal
    this.router.navigate(['/attendance-history'], {
      queryParams: { sessionId: session.id },
    });
  }
}
