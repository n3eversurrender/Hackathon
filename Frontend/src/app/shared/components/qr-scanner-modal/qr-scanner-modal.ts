import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgxScannerQrcodeComponent, ScannerQRCodeConfig, ScannerQRCodeResult } from 'ngx-scanner-qrcode';

@Component({
  selector: 'app-qr-scanner-modal',
  standalone: true,
  imports: [CommonModule, NgxScannerQrcodeComponent],
  templateUrl: './qr-scanner-modal.html',
})
export class QrScannerModalComponent {
  @Input() isOpen = false;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() qrCodeScanned = new EventEmitter<string>();
  @ViewChild('action') action!: NgxScannerQrcodeComponent;

  config: ScannerQRCodeConfig = {
    constraints: {
      video: {
        width: { min: 640, ideal: 1280 },
        height: { min: 480, ideal: 720 },
        aspectRatio: { ideal: 1.7777777778 },
      },
    },
    isBeep: true,
    vibrate: 300,
  };

  onScan(res: ScannerQRCodeResult[], action?: any): void {
    if (res && res.length) {
      const { value } = res[0];
      if (value) {
        action.stop();
        this.qrCodeScanned.emit(value);
        this.closeModal();
      }
    }
  }

  closeModal(): void {
    this.isOpen = false;
    this.isOpenChange.emit(false);
    if (this.action) {
      this.action.stop();
    }
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeModal();
    }
  }

  startScanner(): void {
    if (this.action) {
      this.action.start();
    }
  }

  stopScanner(): void {
    if (this.action) {
      this.action.stop();
    }
  }
}
