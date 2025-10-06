import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/toast.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  username = '';
  password = '';
  showPassword = false;
  isLoading = false;

  // Simple QR code pattern for illustration
  qrPattern: boolean[][] = [
    [true, true, true, true, true, true, true, true],
    [true, false, false, false, false, false, false, true],
    [true, false, true, true, true, true, false, true],
    [true, false, true, false, false, true, false, true],
    [true, false, true, false, false, true, false, true],
    [true, false, true, true, true, true, false, true],
    [true, false, false, false, false, false, false, true],
    [true, true, true, true, true, true, true, true],
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService,
  ) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.toastService.warning('Silakan isi semua field!', 'Perhatian!');
      return;
    }

    this.isLoading = true;

    this.authService
      .login({
        username: this.username,
        password: this.password,
      })
      .subscribe({
        next: (response) => {
          this.isLoading = false;

          if (response.data && typeof response.data === 'object' && 'user' in response.data) {
            const user = response.data.user;

            // Redirect based on user role
            this.toastService.success(`Selamat datang, ${user.name}!`, 'Login Berhasil!');

            if (user.role === 0) {
              // Admin - redirect to manage users
              this.router.navigate(['/manage-users']);
            } else if (user.role === 1) {
              // Student - redirect to student dashboard
              this.router.navigate(['/student-dashboard']);
            } else if (user.role === 2) {
              // Lecturer - redirect to dashboard
              this.router.navigate(['/dashboard']);
            } else {
              // Unknown role
              this.authService.logout();
              this.toastService.error('Role pengguna tidak valid.', 'Akses Ditolak!');
            }
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.toastService.error(error.message || 'Username atau password salah!', 'Login Gagal!');
        },
      });
  }
}
