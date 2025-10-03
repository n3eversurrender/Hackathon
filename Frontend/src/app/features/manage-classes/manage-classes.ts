import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { MainLayoutComponent } from '../../shared/layouts/main-layout/main-layout.component';
import { ToastService } from '../../shared/toast.service';
import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal.component';
import { CourseService } from './course.service';
import { Course } from './course.model';

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

  // Loading states
  isLoading: boolean = false;
  isSaving: boolean = false;

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

  // Search
  searchText: string = '';

  // Data from API
  classes: Course[] = [];
  filteredClasses: Course[] = [];
  activeMenu: string = 'kelola-kelas';

  constructor(
    private router: Router,
    private courseService: CourseService,
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
        this.classes = response.data;
        this.filteredClasses = [...this.classes];
        this.toastService.success(`${this.classes.length} kelas berhasil dimuat`, 'Data Dimuat');
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
          next: (response) => {
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
          next: (response) => {
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
      next: (response) => {
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
}
