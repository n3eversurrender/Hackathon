import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentBottomNavigationComponent } from '../../shared/components/student-bottom-navigation/student-bottom-navigation';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, StudentBottomNavigationComponent],
  templateUrl: './student-dashboard.html',
})
export class StudentDashboardComponent implements OnInit {
  currentUser: string = 'Budi';
  currentTime: string = '';
  greeting: string = '';
  selectedPeriod: string = 'Bulanan';
  activeTab: string = 'Bulanan';
  activePage: 'dashboard' | 'history' | 'profile' = 'dashboard';

  // Mock data for weekly attendance
  weeklyStats = {
    onTime: 3,
    late: 1,
    absent: 1,
  };

  // Mock data for overall attendance
  overallAttendance = {
    percentage: 70,
    present: 70,
    late: 20,
    absent: 10,
  };

  // Mock data for monthly chart
  monthlyData = [
    { month: 'Sep', percentage: 50, color: 'orange' },
    { month: 'Oct', percentage: 80, color: 'primary' },
    { month: 'Nov', percentage: 60, color: 'orange' },
    { month: 'Dec', percentage: 40, color: 'pink' },
    { month: 'Jan', percentage: 100, color: 'primary' },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateTime();
    this.setGreeting();

    // Update time every minute
    setInterval(() => {
      this.updateTime();
    }, 60000);
  }

  updateTime(): void {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    this.currentTime = `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  }

  setGreeting(): void {
    const hour = new Date().getHours();
    if (hour < 12) {
      this.greeting = 'Selamat Pagi,';
    } else if (hour < 15) {
      this.greeting = 'Selamat Siang,';
    } else if (hour < 18) {
      this.greeting = 'Selamat Sore,';
    } else {
      this.greeting = 'Selamat Malam,';
    }
  }

  onPeriodChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedPeriod = target.value;
  }

  onTabChange(tab: string): void {
    this.activeTab = tab;
  }

  getBarHeight(percentage: number): string {
    return `${percentage}%`;
  }

  getBarColor(color: string): string {
    const colorMap: Record<string, string> = {
      primary: 'bg-[#7D2E2E]',
      teal: 'bg-teal-500',
      orange: 'bg-orange-500',
      pink: 'bg-pink-500',
    };
    return colorMap[color] || 'bg-gray-500';
  }

  navigateToHistory(): void {
    this.router.navigate(['/student-history']);
  }

  navigateToProfile(): void {
    this.router.navigate(['/student-profile']);
  }

  logout(): void {
    // TODO: Implement logout functionality
    console.log('Logout');
    this.router.navigate(['/login']);
  }

  // Bottom Navigation Event Handlers
  onNavigateToDashboard(): void {
    // Already on dashboard, do nothing
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onNavigateToHistory(): void {
    this.router.navigate(['/student-history']);
  }

  onOpenQRScanner(): void {
    // TODO: Implement QR scanner functionality
    console.log('Open QR Scanner');
  }

  onNavigateToProfile(): void {
    this.router.navigate(['/student-profile']);
  }

  onLogout(): void {
    this.logout();
  }
}
