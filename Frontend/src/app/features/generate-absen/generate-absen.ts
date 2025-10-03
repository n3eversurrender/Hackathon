import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal.component';
import { MainLayoutComponent } from '../../shared/layouts/main-layout/main-layout.component';
import { ToastService } from '../../shared/toast.service';
import { AuthService } from '../auth/auth.service';
import { CourseSchedule, DAY_NAMES } from '../manage-classes/course-schedule.model';
import { CourseScheduleService } from '../manage-classes/course-schedule.service';
import { Course } from '../manage-classes/course.model';
import { CourseService } from '../manage-classes/course.service';
import { Session } from './session.model';
import { SessionService } from './session.service';

@Component({
  selector: 'app-generate-absen',
  standalone: true,
  imports: [CommonModule, FormsModule, MainLayoutComponent, ConfirmationModalComponent],
  templateUrl: './generate-absen.html',
})
export class GenerateAbsenComponent implements OnInit {
  currentDate: string = '';
  currentUser: string = 'Dudi';
  activeMenu: string = 'generate-absen';

  // Modal states
  showModal: boolean = false;
  showViewModal: boolean = false;
  showDeleteModal: boolean = false;
  isEditMode: boolean = false;
  modalTitle: string = 'Generate Sesi Absen';

  // Loading states
  isLoading: boolean = false;
  isSaving: boolean = false;
  isLoadingSchedules: boolean = false;

  // Delete session
  sessionToDelete: Session | null = null;

  // Form data
  formData: {
    id: number;
    course_id: number;
    schedule_id: number;
    date: string;
    start_time: string;
    end_time: string;
  } = {
    id: 0,
    course_id: 0,
    schedule_id: 0,
    date: '',
    start_time: '',
    end_time: '',
  };

  // View data
  viewData: Session | null = null;

  // Data
  courses: Course[] = [];
  schedules: CourseSchedule[] = [];
  sessions: Session[] = [];
  dayNames = DAY_NAMES;

  constructor(
    private router: Router,
    private courseService: CourseService,
    private courseScheduleService: CourseScheduleService,
    private sessionService: SessionService,
    private toastService: ToastService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.setCurrentDate();
    this.loadCourses();
    this.loadSessions();

    // Get current user
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentUser = user.name;
    }

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
    this.courseService.getCourses().subscribe({
      next: (response) => {
        this.courses = response.data.courses;
      },
      error: (error) => {
        this.toastService.error(error.message, 'Gagal Memuat Kelas');
      },
    });
  }

  loadSessions(): void {
    this.isLoading = true;
    this.sessionService.getSessions().subscribe({
      next: (response) => {
        this.isLoading = false;
        this.sessions = response.data.sessions;
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status !== 404) {
          this.toastService.error(error.message, 'Gagal Memuat Sesi');
        }
        this.sessions = [];
      },
    });
  }

  onCourseChange(): void {
    if (this.formData.course_id) {
      this.isLoadingSchedules = true;
      this.courseScheduleService.getSchedulesByCourse(this.formData.course_id).subscribe({
        next: (response) => {
          this.isLoadingSchedules = false;
          this.schedules = response.data.schedules || [];
          this.formData.schedule_id = 0; // Reset schedule selection
        },
        error: (error) => {
          this.isLoadingSchedules = false;
          this.schedules = [];
          // Only show error toast if it's not a 404 (which means no schedules yet - that's okay)
          if (error.status !== 404) {
            this.toastService.error(error.message, 'Gagal Memuat Jadwal');
          }
        },
      });
    } else {
      this.schedules = [];
      this.formData.schedule_id = 0;
    }
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.modalTitle = 'Generate Sesi Absen';
    const today = new Date().toISOString().split('T')[0];
    this.formData = {
      id: 0,
      course_id: 0,
      schedule_id: 0,
      date: today,
      start_time: '',
      end_time: '',
    };
    this.schedules = [];
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.formData = {
      id: 0,
      course_id: 0,
      schedule_id: 0,
      date: '',
      start_time: '',
      end_time: '',
    };
    this.schedules = [];
  }

  saveSession(): void {
    if (
      !this.formData.course_id ||
      !this.formData.schedule_id ||
      !this.formData.date ||
      !this.formData.start_time ||
      !this.formData.end_time
    ) {
      this.toastService.warning('Harap isi semua field!', 'Perhatian');
      return;
    }

    this.isSaving = true;

    const sessionData = {
      course_id: this.formData.course_id,
      schedule_id: this.formData.schedule_id,
      date: this.formData.date,
      start_time: this.formData.start_time,
      end_time: this.formData.end_time,
    };

    this.sessionService.createSession(sessionData).subscribe({
      next: () => {
        this.isSaving = false;
        this.toastService.success('Sesi berhasil di-generate dengan QR Code!', 'Berhasil');
        this.loadSessions();
        this.closeModal();
      },
      error: (error) => {
        this.isSaving = false;
        this.toastService.error(error.message, 'Gagal Generate Sesi');
      },
    });
  }

  viewSession(session: Session): void {
    this.viewData = session;
    this.showViewModal = true;
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.viewData = null;
  }

  openDeleteModal(session: Session): void {
    this.sessionToDelete = session;
    this.showDeleteModal = true;
  }

  confirmDeleteSession(): void {
    if (!this.sessionToDelete) return;

    this.sessionService.deleteSession(this.sessionToDelete.id).subscribe({
      next: () => {
        this.toastService.success('Sesi berhasil dihapus!', 'Berhasil');
        this.loadSessions();
        this.cancelDeleteSession();
      },
      error: (error) => {
        this.toastService.error(error.message, 'Gagal Menghapus');
      },
    });
  }

  cancelDeleteSession(): void {
    this.showDeleteModal = false;
    this.sessionToDelete = null;
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

  downloadQRCode(session: Session): void {
    if (!session.qr_code) {
      this.toastService.warning('QR Code tidak tersedia', 'Perhatian');
      return;
    }

    // Create download link
    const link = document.createElement('a');
    link.href = session.qr_code;
    link.download = `QR-${session.course?.code || session.id}-${session.date}.png`;
    link.click();

    this.toastService.success('QR Code berhasil diunduh!', 'Berhasil');
  }

  printQRCode(session: Session): void {
    if (!session.qr_code) {
      this.toastService.warning('QR Code tidak tersedia', 'Perhatian');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${session.course?.name || 'Session'}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 20px;
              }
              h2 { color: #7D2E2E; }
              img { max-width: 400px; margin: 20px 0; }
              .info { margin: 10px 0; font-size: 14px; }
            </style>
          </head>
          <body>
            <h2>${session.course?.name || 'Sesi Absensi'}</h2>
            <div class="info"><strong>Kode:</strong> ${session.course?.code || '-'}</div>
            <div class="info"><strong>Tanggal:</strong> ${this.formatDate(session.date)}</div>
            <div class="info"><strong>Waktu:</strong> ${this.formatTime(session.start_time)} - ${this.formatTime(session.end_time)}</div>
            <img src="${session.qr_code}" alt="QR Code" />
            <p>Scan QR code ini untuk absensi</p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }
}
