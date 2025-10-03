import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../features/auth/auth.model';
import { AuthService } from '../../../features/auth/auth.service';
import { ConfirmationModalComponent } from '../../components/confirmation-modal.component';
import { ToastService } from '../../toast.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, ConfirmationModalComponent],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  @Input() activeMenu: string = '';
  currentUser: User | null = null;
  isAdmin: boolean = false;
  showLogoutModal = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.isAdmin = user?.role === 0; // 0 = Admin
    });
  }

  setActiveMenu(menu: string): void {
    // Check role access for manage-users (admin only)
    if (menu === 'kelola-user' && !this.isAdmin) {
      this.toastService.error('Hanya Admin yang dapat mengakses halaman ini!', 'Akses Ditolak!');
      return;
    }

    if (menu === 'beranda') {
      this.router.navigate(['/dashboard']);
    } else if (menu === 'kelola-kelas') {
      this.router.navigate(['/manage-classes']);
    } else if (menu === 'kelola-user') {
      this.router.navigate(['/manage-users']);
    } else if (menu === 'generate-absen') {
      this.router.navigate(['/generate-absen']);
    } else if (menu === 'riwayat-absen') {
      this.router.navigate(['/attendance-history']);
    } else if (menu === 'pengaturan') {
      this.router.navigate(['/settings']);
    }
  }

  logout(): void {
    this.showLogoutModal = true;
  }

  confirmLogout(): void {
    this.showLogoutModal = false;
    // Clear all sessions and local storage
    localStorage.clear();
    sessionStorage.clear();
    
    this.authService.logout();
    this.toastService.success('Anda telah keluar dari sistem.', 'Logout Berhasil!');
  }

  cancelLogout(): void {
    this.showLogoutModal = false;
  }
}
