import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MainLayoutComponent } from '../../shared/layouts/main-layout/main-layout.component';

interface UserProfile {
  name: string;
  email: string;
  nim: string;
  role: string;
  phone: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, MainLayoutComponent],
  templateUrl: './settings.html',
})
export class SettingsComponent implements OnInit {
  currentDate: string = '';
  currentUser: string = 'Dudi';
  activeMenu: string = 'pengaturan';
  activeTab: string = 'profile';

  // Profile data
  profile: UserProfile = {
    name: 'Dudi',
    email: 'dudi@student.ac.id',
    nim: '2101001',
    role: 'Dosen',
    phone: '081234567890',
  };

  // Password data
  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  // Show password toggles
  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  // Notification settings
  notificationSettings = {
    emailNotifications: true,
    pushNotifications: true,
    attendanceReminder: true,
    classUpdates: true,
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.setCurrentDate();
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

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  saveProfile(): void {
    if (!this.profile.name || !this.profile.email) {
      alert('Nama dan email tidak boleh kosong!');
      return;
    }
    alert('Profil berhasil diperbarui!');
  }

  changePassword(): void {
    if (
      !this.passwordData.currentPassword ||
      !this.passwordData.newPassword ||
      !this.passwordData.confirmPassword
    ) {
      alert('Harap isi semua field password!');
      return;
    }

    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      alert('Password baru dan konfirmasi password tidak cocok!');
      return;
    }

    if (this.passwordData.newPassword.length < 6) {
      alert('Password baru minimal 6 karakter!');
      return;
    }

    alert('Password berhasil diubah!');
    this.passwordData = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
  }

  saveNotificationSettings(): void {
    alert('Pengaturan notifikasi berhasil disimpan!');
  }
}
