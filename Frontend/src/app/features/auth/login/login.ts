import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  username = '';
  password = '';
  showPassword = false;

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

  constructor(private router: Router) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    // TODO: Connect to API later
    console.log('Login attempt:', {
      username: this.username,
      password: this.password,
    });

    // For now, just navigate to dashboard
    if (this.username && this.password) {
      this.router.navigate(['/dashboard']);
    } else {
      alert('Please fill in all fields');
    }
  }
}
