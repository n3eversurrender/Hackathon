import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentBottomNavigationComponent } from '../../shared/components/student-bottom-navigation/student-bottom-navigation';

interface AttendanceRecord {
  id: string;
  date: string;
  courseName: string;
  courseCode: string;
  startTime: string;
  endTime: string;
  status: 'present' | 'late' | 'absent';
  timestamp: string;
}

@Component({
  selector: 'app-student-history',
  standalone: true,
  imports: [CommonModule, FormsModule, StudentBottomNavigationComponent],
  templateUrl: './student-history.html',
})
export class StudentHistoryComponent implements OnInit {
  currentUser: string = 'Budi';
  selectedFilter: string = 'all';
  selectedPeriod: string = 'week';
  activePage: 'dashboard' | 'history' | 'profile' = 'history';

  // Mock data for attendance history
  attendanceHistory: AttendanceRecord[] = [
    {
      id: '1',
      date: '2024-01-15',
      courseName: 'Pemrograman Web',
      courseCode: 'PW001',
      startTime: '08:00',
      endTime: '10:00',
      status: 'present',
      timestamp: '2024-01-15T08:05:00Z',
    },
    {
      id: '2',
      date: '2024-01-14',
      courseName: 'Basis Data',
      courseCode: 'BD001',
      startTime: '10:00',
      endTime: '12:00',
      status: 'late',
      timestamp: '2024-01-14T10:15:00Z',
    },
    {
      id: '3',
      date: '2024-01-13',
      courseName: 'Algoritma',
      courseCode: 'AL001',
      startTime: '08:00',
      endTime: '10:00',
      status: 'present',
      timestamp: '2024-01-13T07:55:00Z',
    },
    {
      id: '4',
      date: '2024-01-12',
      courseName: 'Struktur Data',
      courseCode: 'SD001',
      startTime: '10:00',
      endTime: '12:00',
      status: 'absent',
      timestamp: '',
    },
    {
      id: '5',
      date: '2024-01-11',
      courseName: 'Pemrograman Web',
      courseCode: 'PW001',
      startTime: '08:00',
      endTime: '10:00',
      status: 'present',
      timestamp: '2024-01-11T08:02:00Z',
    },
    {
      id: '6',
      date: '2024-01-10',
      courseName: 'Basis Data',
      courseCode: 'BD001',
      startTime: '10:00',
      endTime: '12:00',
      status: 'late',
      timestamp: '2024-01-10T10:20:00Z',
    },
  ];

  filteredHistory: AttendanceRecord[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.filterHistory();
  }

  onFilterChange(): void {
    this.filterHistory();
  }

  onPeriodChange(): void {
    this.filterHistory();
  }

  filterHistory(): void {
    let filtered = [...this.attendanceHistory];

    // Filter by status
    if (this.selectedFilter !== 'all') {
      filtered = filtered.filter((record) => record.status === this.selectedFilter);
    }

    // Filter by period
    const now = new Date();
    if (this.selectedPeriod === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter((record) => new Date(record.date) >= weekAgo);
    } else if (this.selectedPeriod === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter((record) => new Date(record.date) >= monthAgo);
    }

    this.filteredHistory = filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'late':
        return 'bg-orange-100 text-orange-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'present':
        return 'Hadir';
      case 'late':
        return 'Terlambat';
      case 'absent':
        return 'Tidak Hadir';
      default:
        return 'Unknown';
    }
  }

  formatDate(dateStr: string): string {
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

  formatTime(timeStr: string): string {
    if (!timeStr) return '-';
    const time = new Date(timeStr);
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  getAttendanceStats(): { present: number; late: number; absent: number; total: number } {
    const stats = {
      present: 0,
      late: 0,
      absent: 0,
      total: this.filteredHistory.length,
    };

    this.filteredHistory.forEach((record) => {
      switch (record.status) {
        case 'present':
          stats.present++;
          break;
        case 'late':
          stats.late++;
          break;
        case 'absent':
          stats.absent++;
          break;
      }
    });

    return stats;
  }

  goBack(): void {
    this.router.navigate(['/student-dashboard']);
  }

  goToDashboard(): void {
    this.router.navigate(['/student-dashboard']);
  }

  goToHistory(): void {
    // Already on history page, do nothing or scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goToQRScanner(): void {
    // TODO: Implement QR scanner functionality
    console.log('Open QR Scanner');
  }

  goToProfile(): void {
    this.router.navigate(['/student-profile']);
  }

  logout(): void {
    // TODO: Implement logout functionality
    console.log('Logout');
    this.router.navigate(['/login']);
  }

  // Bottom Navigation Event Handlers
  onNavigateToDashboard(): void {
    this.router.navigate(['/student-dashboard']);
  }

  onNavigateToHistory(): void {
    // Already on history page, do nothing or scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onOpenQRScanner(): void {
    // TODO: Implement QR scanner functionality
    console.log('Open QR Scanner');
  }

  onNavigateToProfile(): void {
    this.router.navigate(['/student-profile']);
  }

  onLogout(): void {
    this.logout();
  }
}
