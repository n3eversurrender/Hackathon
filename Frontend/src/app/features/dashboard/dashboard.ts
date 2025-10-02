import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface AttendanceRecord {
  no: number;
  nama: string;
  jamAbsen: string;
  kodeKelas: string;
  status: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit {
  currentDate: string = '';
  currentUser: string = 'Dudi';

  // Statistics
  totalKehadiran: number = 20;
  telatAbsen: number = 15;
  tidakAdaAbsen: number = 5;

  // Filter states
  selectedKelas: string = '';
  selectedDate: Date = new Date();
  searchText: string = '';

  // Dummy data untuk tabel
  attendanceRecords: AttendanceRecord[] = [
    {
      no: 1,
      nama: 'Felix Lengyel',
      jamAbsen: '09:00 AM',
      kodeKelas: 'IF01A',
      status: 'Tepat Waktu',
    },
    {
      no: 2,
      nama: 'Felix Lengyel',
      jamAbsen: '09:00 AM',
      kodeKelas: 'IF01A',
      status: 'Tepat Waktu',
    },
    {
      no: 3,
      nama: 'Felix Lengyel',
      jamAbsen: '09:00 AM',
      kodeKelas: 'IF01A',
      status: 'Tepat Waktu',
    },
    {
      no: 4,
      nama: 'Felix Lengyel',
      jamAbsen: '09:00 AM',
      kodeKelas: 'IF01A',
      status: 'Tepat Waktu',
    },
    {
      no: 5,
      nama: 'Felix Lengyel',
      jamAbsen: '09:00 AM',
      kodeKelas: 'IF01A',
      status: 'Tepat Waktu',
    },
    {
      no: 6,
      nama: 'Felix Lengyel',
      jamAbsen: '09:00 AM',
      kodeKelas: 'IF01A',
      status: 'Tepat Waktu',
    },
  ];

  filteredRecords: AttendanceRecord[] = [];

  // Sidebar menu state
  activeMenu: string = 'beranda';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.setCurrentDate();
    this.filteredRecords = [...this.attendanceRecords];
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
    if (menu === 'kelola-user') {
      this.router.navigate(['/manage-users']);
    } else if (menu === 'kelola-kelas') {
      this.router.navigate(['/manage-classes']);
    } else if (menu === 'pengaturan') {
      this.router.navigate(['/settings']);
    }
  }

  filterRecords(): void {
    this.filteredRecords = this.attendanceRecords.filter((record) => {
      const matchesSearch = record.nama.toLowerCase().includes(this.searchText.toLowerCase());
      return matchesSearch;
    });
  }

  downloadReport(): void {
    alert('Fitur download akan ditambahkan nanti');
  }

  logout(): void {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      this.router.navigate(['/login']);
    }
  }

  formatDateForInput(): string {
    const year = this.selectedDate.getFullYear();
    const month = String(this.selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(this.selectedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onDateChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.selectedDate = new Date(target.value);
  }
}
