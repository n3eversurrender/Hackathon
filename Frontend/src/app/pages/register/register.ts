import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html'
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private router: Router) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    // Validation
    if (!this.name || !this.email || !this.username || !this.password || !this.confirmPassword) {
      alert('Semua field harus diisi!');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Password dan Konfirmasi Password tidak sama!');
      return;
    }

    // TODO: Connect to API later
    console.log('Register attempt:', {
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.password
    });
    
    // For now, just show alert for demo
    alert(`Register demo:\nNama: ${this.name}\nEmail: ${this.email}\nUsername: ${this.username}\n\nAPI connection will be added later.`);
  }
}
