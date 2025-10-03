import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal.component';
import { MainLayoutComponent } from '../../shared/layouts/main-layout/main-layout.component';
import { ToastService } from '../../shared/toast.service';
import { AuthService } from '../auth/auth.service';
import { CourseSchedule, DAY_NAMES } from './course-schedule.model';
import { CourseScheduleService } from './course-schedule.service';
import { Course } from './course.model';
import { CourseService } from './course.service';

@Component({
  selector: 'app-manage-classes',
  standalone: true,
  imports: [CommonModule, FormsModule, MainLayoutComponent, ConfirmationModalComponent],
  templateUrl: './manage-classes.html',
})
export class ManageClassesComponent implements OnInit {
  currentDate: string = '';
  currentUser: string = 'Dudi';

  // Modal states
  showModal: boolean = false;
  isEditMode: boolean = false;
  modalTitle: string = 'Tambah Kelas';
  showDeleteModal: boolean = false;
  classToDelete: Course | null = null;

  // Schedule modal states
  showScheduleModal: boolean = false;
  isEditScheduleMode: boolean = false;
  scheduleModalTitle: string = 'Tambah Jadwal';
  showDeleteScheduleModal: boolean = false;
  scheduleToDelete: CourseSchedule | null = null;
  currentCourseId: number = 0;

  // Loading states
  isLoading: boolean = false;
  isSaving: boolean = false;
  isLoadingSchedules: Record<number, boolean> = {};

  // Form data
  formData: {
    id: number;
    name: string;
    code: string;
  } = {
    id: 0,
    name: '',
    code: '',
  };

  // Schedule form data
  scheduleFormData: {
    id: number;
    day_of_week: number;
    start_time: string;
    end_time: string;
  } = {
    id: 0,
    day_of_week: 1,
    start_time: '',
    end_time: '',
  };

  // Search
  searchText: string = '';

  // Data from API
  classes: Course[] = [];
  filteredClasses: Course[] = [];
  activeMenu: string = 'kelola-kelas';

  // Expanded classes and their schedules
  expandedClasses = new Set<number>();
  classSchedules: Record<number, CourseSchedule[]> = {};

  // Day names for display
  dayNames = DAY_NAMES;

  constructor(
    private router: Router,
    private courseService: CourseService,
    private courseScheduleService: CourseScheduleService,
    private toastService: ToastService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.setCurrentDate();
    this.loadClasses();

    // Get current user
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentUser = user.name;
    }
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

  loadClasses(): void {
    this.isLoading = true;
    this.courseService.getCourses().subscribe({
      next: (response) => {
        this.isLoading = false;
        // Backend returns data with structure: { count: number, courses: Course[] }
        this.classes = response.data.courses;
        this.filteredClasses = [...this.classes];
      },
      error: (error) => {
        this.isLoading = false;
        this.toastService.error(error.message, 'Gagal Memuat Data');
      },
    });
  }

  filterClasses(): void {
    this.filteredClasses = this.classes.filter((cls) => {
      const searchLower = this.searchText.toLowerCase();
      return (
        cls.name.toLowerCase().includes(searchLower) ||
        cls.code.toLowerCase().includes(searchLower) ||
        cls.lecturer?.name.toLowerCase().includes(searchLower)
      );
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.modalTitle = 'Tambah Kelas';
    this.formData = {
      id: 0,
      name: '',
      code: '',
    };
    this.showModal = true;
  }

  openEditModal(cls: Course): void {
    this.isEditMode = true;
    this.modalTitle = 'Edit Kelas';
    this.formData = {
      id: cls.id,
      name: cls.name,
      code: cls.code,
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.formData = {
      id: 0,
      name: '',
      code: '',
    };
  }

  saveClass(): void {
    if (!this.formData.name || !this.formData.code) {
      this.toastService.warning('Harap isi semua field!', 'Perhatian');
      return;
    }

    this.isSaving = true;

    if (this.isEditMode) {
      // Update existing class
      this.courseService
        .updateCourse(this.formData.id, {
          name: this.formData.name,
          code: this.formData.code,
        })
        .subscribe({
          next: (_response) => {
            this.isSaving = false;
            this.toastService.success('Kelas berhasil diupdate!', 'Berhasil');
            this.loadClasses();
            this.closeModal();
          },
          error: (error) => {
            this.isSaving = false;
            this.toastService.error(error.message, 'Gagal Update');
          },
        });
    } else {
      // Add new class
      this.courseService
        .createCourse({
          name: this.formData.name,
          code: this.formData.code,
        })
        .subscribe({
          next: (_response) => {
            this.isSaving = false;
            this.toastService.success('Kelas berhasil ditambahkan!', 'Berhasil');
            this.loadClasses();
            this.closeModal();
          },
          error: (error) => {
            this.isSaving = false;
            this.toastService.error(error.message, 'Gagal Menambah');
          },
        });
    }
  }

  openDeleteModal(cls: Course): void {
    this.classToDelete = cls;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (!this.classToDelete) return;

    this.courseService.deleteCourse(this.classToDelete.id).subscribe({
      next: (_response) => {
        this.toastService.success('Kelas berhasil dihapus!', 'Berhasil');
        this.loadClasses();
        this.showDeleteModal = false;
        this.classToDelete = null;
      },
      error: (error) => {
        this.toastService.error(error.message, 'Gagal Menghapus');
        this.showDeleteModal = false;
        this.classToDelete = null;
      },
    });
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.classToDelete = null;
  }

  // ========== Schedule Management ==========

  toggleExpand(courseId: number): void {
    if (this.expandedClasses.has(courseId)) {
      this.expandedClasses.delete(courseId);
    } else {
      this.expandedClasses.add(courseId);
      this.loadSchedules(courseId);
    }
  }

  isExpanded(courseId: number): boolean {
    return this.expandedClasses.has(courseId);
  }

  loadSchedules(courseId: number): void {
    if (this.classSchedules[courseId]) {
      return; // Already loaded
    }

    this.isLoadingSchedules[courseId] = true;
    this.courseScheduleService.getSchedulesByCourse(courseId).subscribe({
      next: (response) => {
        this.isLoadingSchedules[courseId] = false;
        this.classSchedules[courseId] = response.data.schedules.sort(
          (a, b) => a.day_of_week - b.day_of_week,
        );
        // Don't show success toast for loading data (too noisy)
      },
      error: (error) => {
        this.isLoadingSchedules[courseId] = false;
        // Only show error toast if it's a real error, not just empty data
        // 404 might mean the endpoint doesn't exist, but empty array is handled by empty state UI
        if (error.status !== 404) {
          this.toastService.error(error.message, 'Gagal Memuat Jadwal');
        }
        // Set empty array so UI shows empty state instead of loading forever
        this.classSchedules[courseId] = [];
      },
    });
  }

  openAddScheduleModal(courseId: number): void {
    this.currentCourseId = courseId;
    this.isEditScheduleMode = false;
    this.scheduleModalTitle = 'Tambah Jadwal';
    this.scheduleFormData = {
      id: 0,
      day_of_week: 1,
      start_time: '',
      end_time: '',
    };
    this.showScheduleModal = true;
  }

  openEditScheduleModal(courseId: number, schedule: CourseSchedule): void {
    this.currentCourseId = courseId;
    this.isEditScheduleMode = true;
    this.scheduleModalTitle = 'Edit Jadwal';
    this.scheduleFormData = {
      id: schedule.id,
      day_of_week: schedule.day_of_week,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
    };
    this.showScheduleModal = true;
  }

  closeScheduleModal(): void {
    this.showScheduleModal = false;
    this.scheduleFormData = {
      id: 0,
      day_of_week: 1,
      start_time: '',
      end_time: '',
    };
  }

  saveSchedule(): void {
    if (!this.scheduleFormData.start_time || !this.scheduleFormData.end_time) {
      this.toastService.warning('Harap isi semua field!', 'Perhatian');
      return;
    }

    this.isSaving = true;

    if (this.isEditScheduleMode) {
      // Update existing schedule
      this.courseScheduleService
        .updateSchedule(this.currentCourseId, this.scheduleFormData.id, {
          day_of_week: this.scheduleFormData.day_of_week,
          start_time: this.scheduleFormData.start_time,
          end_time: this.scheduleFormData.end_time,
        })
        .subscribe({
          next: (_response) => {
            this.isSaving = false;
            this.toastService.success('Jadwal berhasil diupdate!', 'Berhasil');
            delete this.classSchedules[this.currentCourseId]; // Clear cache
            this.loadSchedules(this.currentCourseId); // Reload
            this.closeScheduleModal();
          },
          error: (error) => {
            this.isSaving = false;
            this.toastService.error(error.message, 'Gagal Update');
          },
        });
    } else {
      // Add new schedule
      this.courseScheduleService
        .createSchedule(this.currentCourseId, {
          day_of_week: this.scheduleFormData.day_of_week,
          start_time: this.scheduleFormData.start_time,
          end_time: this.scheduleFormData.end_time,
        })
        .subscribe({
          next: (_response) => {
            this.isSaving = false;
            this.toastService.success('Jadwal berhasil ditambahkan!', 'Berhasil');
            delete this.classSchedules[this.currentCourseId]; // Clear cache
            this.loadSchedules(this.currentCourseId); // Reload
            this.closeScheduleModal();
          },
          error: (error) => {
            this.isSaving = false;
            this.toastService.error(error.message, 'Gagal Menambah');
          },
        });
    }
  }

  openDeleteScheduleModal(courseId: number, schedule: CourseSchedule): void {
    this.currentCourseId = courseId;
    this.scheduleToDelete = schedule;
    this.showDeleteScheduleModal = true;
  }

  confirmDeleteSchedule(): void {
    if (!this.scheduleToDelete) return;

    this.courseScheduleService
      .deleteSchedule(this.currentCourseId, this.scheduleToDelete.id)
      .subscribe({
        next: (_response) => {
          this.toastService.success('Jadwal berhasil dihapus!', 'Berhasil');
          delete this.classSchedules[this.currentCourseId]; // Clear cache
          this.loadSchedules(this.currentCourseId); // Reload
          this.showDeleteScheduleModal = false;
          this.scheduleToDelete = null;
        },
        error: (error) => {
          this.toastService.error(error.message, 'Gagal Menghapus');
          this.showDeleteScheduleModal = false;
          this.scheduleToDelete = null;
        },
      });
  }

  cancelDeleteSchedule(): void {
    this.showDeleteScheduleModal = false;
    this.scheduleToDelete = null;
  }

  getSchedulesForCourse(courseId: number): CourseSchedule[] {
    return this.classSchedules[courseId] || [];
  }

  // Format time from HH:MM:SS to HH:MM AM/PM
  formatTime(time: string): string {
    if (!time) return '';
    // If time is in format HH:MM:SS, remove seconds and add AM/PM
    const parts = time.split(':');
    if (parts.length >= 2) {
      let hours = parseInt(parts[0], 10);
      const minutes = parts[1];
      const ampm = hours >= 12 ? 'PM' : 'AM';

      // Convert to 12-hour format
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 should be 12

      return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    }
    return time;
  }
}
