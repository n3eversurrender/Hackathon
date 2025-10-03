import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MainLayoutComponent } from '../../shared/layouts/main-layout/main-layout.component';

interface Class {
  id: number;
  namaKelas: string;
  kodeKelas: string;
}

@Component({
  selector: 'app-manage-classes',
  standalone: true,
  imports: [CommonModule, FormsModule, MainLayoutComponent],
  templateUrl: './manage-classes.html',
})
export class ManageClassesComponent implements OnInit {
  currentDate: string = '';
  currentUser: string = 'Dudi';

  // Modal states
  showModal: boolean = false;
  isEditMode: boolean = false;
  modalTitle: string = 'Tambah Kelas';

  // Form data
  formData: Class = {
    id: 0,
    namaKelas: '',
    kodeKelas: '',
  };

  // Search
  searchText: string = '';

  // Dummy data kelas
  classes: Class[] = [
    {
      id: 1,
      namaKelas: 'Mata Kuliah AI',
      kodeKelas: 'IF01A',
    },
    {
      id: 2,
      namaKelas: 'Mata Kuliah IOT',
      kodeKelas: 'IF01B',
    },
    {
      id: 3,
      namaKelas: 'Mata Kuliah Website',
      kodeKelas: 'IF01C',
    },
  ];

  filteredClasses: Class[] = [];
  activeMenu: string = 'kelola-kelas';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.setCurrentDate();
    this.filteredClasses = [...this.classes];
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

  filterClasses(): void {
    this.filteredClasses = this.classes.filter((cls) => {
      const searchLower = this.searchText.toLowerCase();
      return (
        cls.namaKelas.toLowerCase().includes(searchLower) ||
        cls.kodeKelas.toLowerCase().includes(searchLower)
      );
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.modalTitle = 'Tambah Kelas';
    this.formData = {
      id: 0,
      namaKelas: '',
      kodeKelas: '',
    };
    this.showModal = true;
  }

  openEditModal(cls: Class): void {
    this.isEditMode = true;
    this.modalTitle = 'Edit Kelas';
    this.formData = { ...cls };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.formData = {
      id: 0,
      namaKelas: '',
      kodeKelas: '',
    };
  }

  saveClass(): void {
    if (!this.formData.namaKelas || !this.formData.kodeKelas) {
      alert('Harap isi semua field!');
      return;
    }

    if (this.isEditMode) {
      // Update existing class
      const index = this.classes.findIndex((c) => c.id === this.formData.id);
      if (index !== -1) {
        this.classes[index] = { ...this.formData };
        alert('Kelas berhasil diupdate!');
      }
    } else {
      // Add new class
      const newClass: Class = {
        ...this.formData,
        id: Math.max(...this.classes.map((c) => c.id)) + 1,
      };
      this.classes.push(newClass);
      alert('Kelas berhasil ditambahkan!');
    }

    this.filteredClasses = [...this.classes];
    this.closeModal();
  }

  deleteClass(cls: Class): void {
    if (confirm(`Apakah Anda yakin ingin menghapus ${cls.namaKelas}?`)) {
      this.classes = this.classes.filter((c) => c.id !== cls.id);
      this.filteredClasses = [...this.classes];
      alert('Kelas berhasil dihapus!');
    }
  }
}
