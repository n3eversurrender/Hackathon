import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Class {
  id: number;
  namaKelas: string;
  kodeKelas: string;
}

interface Session {
  id: number;
  namaKelas: string;
  kodeKelas: string;
  jam: string;
  jamMulai: string;
  jamSelesai: string;
  status: string;
  durasiWaktu: number; // in minutes
}

interface SessionFormData {
  id: number;
  kodeKelas: string;
  jamMulai: string;
  jamSelesai: string;
  durasiWaktu: number;
}

@Component({
  selector: 'app-generate-absen',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './generate-absen.html',
})
export class GenerateAbsenComponent implements OnInit {
  currentDate: string = '';
  currentUser: string = 'Dudi';

  // Modal states
  showModal: boolean = false;
  showViewModal: boolean = false;
  isEditMode: boolean = false;
  modalTitle: string = 'Tambah Sesi Absen';

  // Form data
  formData: SessionFormData = {
    id: 0,
    kodeKelas: '',
    jamMulai: '',
    jamSelesai: '',
    durasiWaktu: 30,
  };

  // View data
  viewData: Session = {
    id: 0,
    namaKelas: '',
    kodeKelas: '',
    jam: '',
    jamMulai: '',
    jamSelesai: '',
    status: '',
    durasiWaktu: 0,
  };

  // Available classes
  availableClasses: Class[] = [
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

  // Sessions data
  sessions: Session[] = [
    {
      id: 1,
      namaKelas: 'Mata Kuliah AI',
      kodeKelas: 'IF01A',
      jam: '01:00 PM - 04:00PM',
      jamMulai: '13:00',
      jamSelesai: '16:00',
      status: '5 Menit Lagi',
      durasiWaktu: 30,
    },
    {
      id: 2,
      namaKelas: 'Mata Kuliah IOT',
      kodeKelas: 'IF01B',
      jam: '01:00 PM - 04:00PM',
      jamMulai: '13:00',
      jamSelesai: '16:00',
      status: 'Sudah Habis',
      durasiWaktu: 30,
    },
    {
      id: 3,
      namaKelas: 'Mata Kuliah Website',
      kodeKelas: 'IF01C',
      jam: '01:00 PM - 04:00PM',
      jamMulai: '13:00',
      jamSelesai: '16:00',
      status: 'Sudah Habis',
      durasiWaktu: 30,
    },
  ];

  activeMenu: string = 'generate-absen';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.setCurrentDate();
    // Update session statuses periodically
    setInterval(() => {
      this.updateSessionStatuses();
    }, 60000); // Update every minute
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
    } else if (menu === 'kelola-user') {
      this.router.navigate(['/manage-users']);
    } else if (menu === 'riwayat-absen') {
      this.router.navigate(['/attendance-history']);
    } else if (menu === 'pengaturan') {
      this.router.navigate(['/settings']);
    }
  }

  updateSessionStatuses(): void {
    const now = new Date();
    this.sessions.forEach((session) => {
      const [startHour, startMinute] = session.jamMulai.split(':').map(Number);
      const sessionStart = new Date();
      sessionStart.setHours(startHour, startMinute, 0, 0);

      const timeDiff = sessionStart.getTime() - now.getTime();
      const minutesDiff = Math.floor(timeDiff / (1000 * 60));

      if (minutesDiff <= 5 && minutesDiff > 0) {
        session.status = '5 Menit Lagi';
      } else if (minutesDiff <= 0) {
        session.status = 'Sudah Habis';
      } else {
        session.status = `${minutesDiff} Menit Lagi`;
      }
    });
  }

  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${String(hour12).padStart(2, '0')}:${minutes} ${ampm}`;
  }

  onClassChange(): void {
    // You can do additional logic here if needed when class changes
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.modalTitle = 'Tambah Sesi Absen';
    this.formData = {
      id: 0,
      kodeKelas: '',
      jamMulai: '',
      jamSelesai: '',
      durasiWaktu: 30,
    };
    this.showModal = true;
  }

  openEditModal(session: Session): void {
    this.isEditMode = true;
    this.modalTitle = 'Edit Sesi Absen';
    this.formData = {
      id: session.id,
      kodeKelas: session.kodeKelas,
      jamMulai: session.jamMulai,
      jamSelesai: session.jamSelesai,
      durasiWaktu: session.durasiWaktu,
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.formData = {
      id: 0,
      kodeKelas: '',
      jamMulai: '',
      jamSelesai: '',
      durasiWaktu: 30,
    };
  }

  saveSession(): void {
    if (
      !this.formData.kodeKelas ||
      !this.formData.jamMulai ||
      !this.formData.jamSelesai ||
      !this.formData.durasiWaktu
    ) {
      alert('Harap isi semua field!');
      return;
    }

    const selectedClass = this.availableClasses.find(
      (cls) => cls.kodeKelas === this.formData.kodeKelas,
    );

    if (!selectedClass) {
      alert('Kelas tidak ditemukan!');
      return;
    }

    const jamFormatted = `${this.formatTime(this.formData.jamMulai)} - ${this.formatTime(
      this.formData.jamSelesai,
    )}`;

    if (this.isEditMode) {
      // Update existing session
      const index = this.sessions.findIndex((s) => s.id === this.formData.id);
      if (index !== -1) {
        this.sessions[index] = {
          id: this.formData.id,
          namaKelas: selectedClass.namaKelas,
          kodeKelas: selectedClass.kodeKelas,
          jam: jamFormatted,
          jamMulai: this.formData.jamMulai,
          jamSelesai: this.formData.jamSelesai,
          status: this.sessions[index].status,
          durasiWaktu: this.formData.durasiWaktu,
        };
        alert('Sesi berhasil diupdate!');
      }
    } else {
      // Add new session
      const newSession: Session = {
        id: Math.max(...this.sessions.map((s) => s.id), 0) + 1,
        namaKelas: selectedClass.namaKelas,
        kodeKelas: selectedClass.kodeKelas,
        jam: jamFormatted,
        jamMulai: this.formData.jamMulai,
        jamSelesai: this.formData.jamSelesai,
        status: 'Belum Dimulai',
        durasiWaktu: this.formData.durasiWaktu,
      };
      this.sessions.push(newSession);
      alert('Sesi berhasil ditambahkan!');
    }

    this.updateSessionStatuses();
    this.closeModal();
  }

  viewSession(session: Session): void {
    this.viewData = { ...session };
    this.showViewModal = true;
  }

  closeViewModal(): void {
    this.showViewModal = false;
  }

  deleteSession(session: Session): void {
    if (confirm(`Apakah Anda yakin ingin menghapus sesi ${session.namaKelas}?`)) {
      this.sessions = this.sessions.filter((s) => s.id !== session.id);
      alert('Sesi berhasil dihapus!');
    }
  }

  logout(): void {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      this.router.navigate(['/login']);
    }
  }
}
