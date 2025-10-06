import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QrScannerModalComponent } from '../qr-scanner-modal/qr-scanner-modal';

@Component({
  selector: 'app-student-bottom-navigation',
  standalone: true,
  imports: [CommonModule, QrScannerModalComponent],
  templateUrl: './student-bottom-navigation.html',
})
export class StudentBottomNavigationComponent {
  @Input() activePage: 'dashboard' | 'history' | 'profile' = 'dashboard';
  @Output() navigateToDashboard = new EventEmitter<void>();
  @Output() navigateToHistory = new EventEmitter<void>();
  @Output() openQRScanner = new EventEmitter<void>();
  @Output() navigateToProfile = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  showQRScanner = false;

  onDashboardClick(): void {
    this.navigateToDashboard.emit();
  }

  onHistoryClick(): void {
    this.navigateToHistory.emit();
  }

  onQRScannerClick(): void {
    this.openQRScanner.emit();
    this.showQRScanner = true;
  }

  onQRCodeScanned(qrCode: string): void {
    console.log('QR Code scanned:', qrCode);
    alert(`QR Code berhasil dipindai: ${qrCode}`);
    this.showQRScanner = false;
  }

  onQRScannerClose(): void {
    this.showQRScanner = false;
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
