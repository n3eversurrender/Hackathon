import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
})
export class RegisterComponent {
  name = '';
  email = '';
  username = '';
  password = '';
  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService,
  ) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    // Validation
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.toastService.error('Field Nama, Email, dan Password harus diisi!', 'Validasi Gagal');
      return;
    }

    if (this.password.length < 8) {
      this.toastService.error('Password minimal 8 karakter!', 'Validasi Gagal');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.toastService.error('Password dan Konfirmasi Password tidak sama!', 'Validasi Gagal');
      return;
    }

    this.isLoading = true;

    const registerData = {
      name: this.name,
      email: this.email,
      password: this.password,
      ...(this.username && { username: this.username }),
      role: 1, // Default to Student role (1)
    };

    this.authService.register(registerData).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Register success:', response);
        this.toastService.success(
          `Selamat datang, ${this.name}! Silakan login dengan akun Anda.`,
          'Registrasi Berhasil!',
        );
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Register error:', error);
        this.toastService.error(error.message, 'Registrasi Gagal');
      },
    });
  }
}
