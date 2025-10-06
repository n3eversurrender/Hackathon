import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentBottomNavigationComponent } from '../../shared/components/student-bottom-navigation/student-bottom-navigation';

interface StudentProfile {
  id: number;
  name: string;
  email: string;
  studentId: string;
  phone: string;
  major: string;
  semester: number;
  year: number;
  avatar?: string;
}

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, StudentBottomNavigationComponent],
  templateUrl: './student-profile.html',
})
export class StudentProfileComponent implements OnInit {
  currentUser: StudentProfile = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@student.university.ac.id',
    studentId: 'ST2024001',
    phone: '+62 812-3456-7890',
    major: 'Teknik Informatika',
    semester: 6,
    year: 2024,
    avatar: '',
  };

  isEditing = false;
  editForm: StudentProfile = { ...this.currentUser };
  activePage: 'dashboard' | 'history' | 'profile' = 'profile';

  constructor(private router: Router) {}

  ngOnInit(): void {}

  goBack(): void {
    this.router.navigate(['/student-dashboard']);
  }

  startEdit(): void {
    this.isEditing = true;
    this.editForm = { ...this.currentUser };
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editForm = { ...this.currentUser };
  }

  saveProfile(): void {
    // Simulate API call
    this.currentUser = { ...this.editForm };
    this.isEditing = false;
    console.log('Profile saved:', this.currentUser);
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  onAvatarChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.editForm.avatar = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  goToDashboard(): void {
    this.router.navigate(['/student-dashboard']);
  }

  goToHistory(): void {
    this.router.navigate(['/student-history']);
  }

  goToQRScanner(): void {
    // TODO: Implement QR scanner functionality
    console.log('Open QR Scanner');
  }

  goToProfile(): void {
    // Already on profile page, do nothing or scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  logout(): void {
    // TODO: Implement logout functionality
    console.log('Logout');
    this.router.navigate(['/login']);
  }

  // Bottom Navigation Event Handlers
  onNavigateToDashboard(): void {
    this.router.navigate(['/student-dashboard']);
  }

  onNavigateToHistory(): void {
    this.router.navigate(['/student-history']);
  }

  onOpenQRScanner(): void {
    // TODO: Implement QR scanner functionality
    console.log('Open QR Scanner');
  }

  onNavigateToProfile(): void {
    // Already on profile page, do nothing or scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onLogout(): void {
    this.logout();
  }
}
