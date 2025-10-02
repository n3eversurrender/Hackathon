import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface User {
  id: number;
  nama: string;
  nim: string;
  email: string;
  kelas: string;
  role: 'student' | 'lecturer';
}

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-users.html',
})
export class ManageUsersComponent implements OnInit {
  currentDate: string = '';
  currentUser: string = 'Dudi';

  // Modal states
  showModal: boolean = false;
  isEditMode: boolean = false;
  modalTitle: string = 'Tambah User Baru';

  // Form data
  formData: User = {
    id: 0,
    nama: '',
    nim: '',
    email: '',
    kelas: '',
    role: 'student',
  };

  // Search
  searchText: string = '';

  // Dummy data users
  users: User[] = [
    {
      id: 1,
      nama: 'Felix Lengyel',
      nim: '2101001',
      email: 'felix@student.ac.id',
      kelas: 'IF01A',
      role: 'student',
    },
    {
      id: 2,
      nama: 'John Doe',
      nim: '2101002',
      email: 'john@student.ac.id',
      kelas: 'IF01A',
      role: 'student',
    },
    {
      id: 3,
      nama: 'Jane Smith',
      nim: '2101003',
      email: 'jane@student.ac.id',
      kelas: 'IF01B',
      role: 'student',
    },
    {
      id: 4,
      nama: 'Michael Johnson',
      nim: '2101004',
      email: 'michael@student.ac.id',
      kelas: 'IF02A',
      role: 'student',
    },
    {
      id: 5,
      nama: 'Sarah Williams',
      nim: '2101005',
      email: 'sarah@student.ac.id',
      kelas: 'IF01A',
      role: 'student',
    },
  ];

  filteredUsers: User[] = [];
  activeMenu: string = 'kelola-kelas';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.setCurrentDate();
    this.filteredUsers = [...this.users];
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

  setActiveMenu(menu: string): void {
    this.activeMenu = menu;
    if (menu === 'beranda') {
      this.router.navigate(['/dashboard']);
    } else if (menu === 'kelola-kelas') {
      this.router.navigate(['/manage-classes']);
    }
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter((user) => {
      const searchLower = this.searchText.toLowerCase();
      return (
        user.nama.toLowerCase().includes(searchLower) ||
        user.nim.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.kelas.toLowerCase().includes(searchLower)
      );
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.modalTitle = 'Tambah User Baru';
    this.formData = {
      id: 0,
      nama: '',
      nim: '',
      email: '',
      kelas: '',
      role: 'student',
    };
    this.showModal = true;
  }

  openEditModal(user: User): void {
    this.isEditMode = true;
    this.modalTitle = 'Edit User';
    this.formData = { ...user };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.formData = {
      id: 0,
      nama: '',
      nim: '',
      email: '',
      kelas: '',
      role: 'student',
    };
  }

  saveUser(): void {
    if (!this.formData.nama || !this.formData.nim || !this.formData.email || !this.formData.kelas) {
      alert('Harap isi semua field!');
      return;
    }

    if (this.isEditMode) {
      // Update existing user
      const index = this.users.findIndex((u) => u.id === this.formData.id);
      if (index !== -1) {
        this.users[index] = { ...this.formData };
        alert('User berhasil diupdate!');
      }
    } else {
      // Add new user
      const newUser: User = {
        ...this.formData,
        id: Math.max(...this.users.map((u) => u.id)) + 1,
      };
      this.users.push(newUser);
      alert('User berhasil ditambahkan!');
    }

    this.filteredUsers = [...this.users];
    this.closeModal();
  }

  deleteUser(user: User): void {
    if (confirm(`Apakah Anda yakin ingin menghapus ${user.nama}?`)) {
      this.users = this.users.filter((u) => u.id !== user.id);
      this.filteredUsers = [...this.users];
      alert('User berhasil dihapus!');
    }
  }

  logout(): void {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      this.router.navigate(['/login']);
    }
  }
}
