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
    private toastService: ToastService
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
            
            // Check if user has access (only admin and lecturer)
            if (user.role === 0 || user.role === 2) {
              // role 0 = admin, role 2 = lecturer
              this.toastService.success(
                `Selamat datang, ${user.name}!`,
                'Login Berhasil!'
              );
              this.router.navigate(['/dashboard']);
            } else {
              // Student tidak boleh login
              this.authService.logout();
              this.toastService.error(
                'Hanya Admin dan Dosen yang dapat mengakses sistem ini.',
                'Akses Ditolak!'
              );
            }
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.toastService.error(
            error.message || 'Username atau password salah!',
            'Login Gagal!'
          );
        },
      });
  }
}
