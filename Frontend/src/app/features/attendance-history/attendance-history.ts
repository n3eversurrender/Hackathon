import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MainLayoutComponent } from '../../shared/layouts/main-layout/main-layout.component';

interface AttendanceRecord {
  id: number;
  no: number;
  nama: string;
  nim: string;
  kodeKelas: string;
  namaKelas: string;
  jamAbsen: string;
  tanggal: string;
  status: 'Hadir' | 'Telat' | 'Tidak Hadir';
  session: string;
}

@Component({
  selector: 'app-attendance-history',
  standalone: true,
  imports: [CommonModule, FormsModule, MainLayoutComponent],
  templateUrl: './attendance-history.html',
})
export class AttendanceHistoryComponent implements OnInit {
  currentDate: string = '';
  currentUser: string = 'Dudi';
  activeMenu: string = 'riwayat-absen';

  // Filter states
  selectedKelas: string = '';
  selectedDate: string = '';
  selectedStatus: string = '';
  searchText: string = '';

  // Data
  attendanceRecords: AttendanceRecord[] = [
    {
      id: 1,
      no: 1,
      nama: 'Ahmad Fauzi',
      nim: '2211001',
      kodeKelas: 'IF01A',
      namaKelas: 'Mata Kuliah AI',
      jamAbsen: '13:05',
      tanggal: '2024-10-03',
      status: 'Hadir',
      session: '13:00 - 16:00',
    },
    {
      id: 2,
      no: 2,
      nama: 'Siti Nurhaliza',
      nim: '2211002',
      kodeKelas: 'IF01A',
      namaKelas: 'Mata Kuliah AI',
      jamAbsen: '13:35',
      tanggal: '2024-10-03',
      status: 'Telat',
      session: '13:00 - 16:00',
    },
    {
      id: 3,
      no: 3,
      nama: 'Budi Santoso',
      nim: '2211003',
      kodeKelas: 'IF01B',
      namaKelas: 'Mata Kuliah IOT',
      jamAbsen: '14:10',
      tanggal: '2024-10-03',
      status: 'Hadir',
      session: '14:00 - 17:00',
    },
    {
      id: 4,
      no: 4,
      nama: 'Dewi Lestari',
      nim: '2211004',
      kodeKelas: 'IF01B',
      namaKelas: 'Mata Kuliah IOT',
      jamAbsen: '-',
      tanggal: '2024-10-03',
      status: 'Tidak Hadir',
      session: '14:00 - 17:00',
    },
    {
      id: 5,
      no: 5,
      nama: 'Eko Prasetyo',
      nim: '2211005',
      kodeKelas: 'IF01C',
      namaKelas: 'Mata Kuliah Website',
      jamAbsen: '15:05',
      tanggal: '2024-10-03',
      status: 'Hadir',
      session: '15:00 - 18:00',
    },
    {
      id: 6,
      no: 6,
      nama: 'Fitri Handayani',
      nim: '2211006',
      kodeKelas: 'IF01A',
      namaKelas: 'Mata Kuliah AI',
      jamAbsen: '13:02',
      tanggal: '2024-10-02',
      status: 'Hadir',
      session: '13:00 - 16:00',
    },
    {
      id: 7,
      no: 7,
      nama: 'Gilang Ramadhan',
      nim: '2211007',
      kodeKelas: 'IF01A',
      namaKelas: 'Mata Kuliah AI',
      jamAbsen: '13:45',
      tanggal: '2024-10-02',
      status: 'Telat',
      session: '13:00 - 16:00',
    },
    {
      id: 8,
      no: 8,
      nama: 'Hana Safitri',
      nim: '2211008',
      kodeKelas: 'IF01B',
      namaKelas: 'Mata Kuliah IOT',
      jamAbsen: '14:00',
      tanggal: '2024-10-02',
      status: 'Hadir',
      session: '14:00 - 17:00',
    },
  ];

  filteredRecords: AttendanceRecord[] = [];
  availableClasses: string[] = ['IF01A', 'IF01B', 'IF01C'];

  // Statistics
  get totalHadir(): number {
    return this.filteredRecords.filter((r) => r.status === 'Hadir').length;
  }

  get totalTelat(): number {
    return this.filteredRecords.filter((r) => r.status === 'Telat').length;
  }

  get totalTidakHadir(): number {
    return this.filteredRecords.filter((r) => r.status === 'Tidak Hadir').length;
  }

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.setCurrentDate();
    this.selectedDate = this.formatDateForInput();
    this.filterRecords();
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

  formatDateForInput(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onDateChange(event: any): void {
    this.selectedDate = event.target.value;
    this.filterRecords();
  }

  filterRecords(): void {
    let filtered = [...this.attendanceRecords];

    // Filter by class
    if (this.selectedKelas) {
      filtered = filtered.filter((record) => record.kodeKelas === this.selectedKelas);
    }

    // Filter by date
    if (this.selectedDate) {
      filtered = filtered.filter((record) => record.tanggal === this.selectedDate);
    }

    // Filter by status
    if (this.selectedStatus) {
      filtered = filtered.filter((record) => record.status === this.selectedStatus);
    }

    // Filter by search text
    if (this.searchText) {
      const searchLower = this.searchText.toLowerCase();
      filtered = filtered.filter(
        (record) =>
          record.nama.toLowerCase().includes(searchLower) ||
          record.nim.toLowerCase().includes(searchLower) ||
          record.kodeKelas.toLowerCase().includes(searchLower),
      );
    }

    // Update numbering
    this.filteredRecords = filtered.map((record, index) => ({
      ...record,
      no: index + 1,
    }));
  }

  resetFilters(): void {
    this.selectedKelas = '';
    this.selectedDate = this.formatDateForInput();
    this.selectedStatus = '';
    this.searchText = '';
    this.filterRecords();
  }

  downloadReport(): void {
    if (this.filteredRecords.length === 0) {
      alert('Tidak ada data untuk diunduh!');
      return;
    }

    // Create CSV content
    const headers = [
      'No',
      'Nama',
      'NIM',
      'Kode Kelas',
      'Nama Kelas',
      'Tanggal',
      'Jam Absen',
      'Sesi',
      'Status',
    ];
    const csvContent = [
      headers.join(','),
      ...this.filteredRecords.map((record) =>
        [
          record.no,
          `"${record.nama}"`,
          record.nim,
          record.kodeKelas,
          `"${record.namaKelas}"`,
          record.tanggal,
          record.jamAbsen,
          `"${record.session}"`,
          record.status,
        ].join(','),
      ),
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    const fileName = `Riwayat_Absen_${this.selectedDate || 'All'}_${
      this.selectedKelas || 'All'
    }.csv`;

    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert('Laporan berhasil diunduh!');
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Hadir':
        return 'bg-green-100 text-green-800';
      case 'Telat':
        return 'bg-yellow-100 text-yellow-800';
      case 'Tidak Hadir':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
