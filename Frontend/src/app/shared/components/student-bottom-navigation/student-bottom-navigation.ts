import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-student-bottom-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-bottom-navigation.html',
})
export class StudentBottomNavigationComponent {
  @Input() activePage: 'dashboard' | 'history' | 'profile' = 'dashboard';
  @Output() navigateToDashboard = new EventEmitter<void>();
  @Output() navigateToHistory = new EventEmitter<void>();
  @Output() openQRScanner = new EventEmitter<void>();
  @Output() navigateToProfile = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  onDashboardClick(): void {
    this.navigateToDashboard.emit();
  }

  onHistoryClick(): void {
    this.navigateToHistory.emit();
  }

  onQRScannerClick(): void {
    this.openQRScanner.emit();
  }

  onProfileClick(): void {
    this.navigateToProfile.emit();
  }

  onLogoutClick(): void {
    this.logout.emit();
  }

  isActive(page: string): boolean {
    return this.activePage === page;
  }
}
