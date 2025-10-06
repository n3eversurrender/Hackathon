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
    this.startCamera();
  }

  private async startCamera(): Promise<void> {
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Camera tidak didukung di browser ini');
        return;
      }

      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      // Create camera modal
      this.showCameraModal(stream);
    } catch (error) {
      console.error('Error accessing camera:', error);
      if (error.name === 'NotAllowedError') {
        alert('Akses camera ditolak. Silakan izinkan akses camera untuk menggunakan fitur scan QR.');
      } else if (error.name === 'NotFoundError') {
        alert('Camera tidak ditemukan di perangkat ini.');
      } else {
        alert('Terjadi kesalahan saat mengakses camera: ' + error.message);
      }
    }
  }

  private showCameraModal(stream: MediaStream): void {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-[#7D2E2E]">Scan QR Code</h3>
          <button id="close-camera" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="relative">
          <video id="camera-video" autoplay playsinline class="w-full h-64 bg-gray-200 rounded-lg"></video>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="border-2 border-white border-dashed w-48 h-48 rounded-lg flex items-center justify-center">
              <div class="text-white text-center">
                <svg class="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" clip-rule="evenodd"></path>
                  <path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <p class="text-sm">Arahkan camera ke QR Code</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-4 flex space-x-3">
          <button id="capture-photo" class="flex-1 bg-[#7D2E2E] text-white px-4 py-2 rounded-lg hover:bg-opacity-90">
            Capture
          </button>
          <button id="switch-camera" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Switch
          </button>
        </div>
        
        <div class="mt-4 text-center">
          <p class="text-sm text-gray-600">QR Code akan terdeteksi secara otomatis</p>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Setup video element
    const video = modal.querySelector('#camera-video') as HTMLVideoElement;
    video.srcObject = stream;

    // Close button handler
    const closeBtn = modal.querySelector('#close-camera');
    closeBtn?.addEventListener('click', () => {
      this.closeCameraModal(modal, stream);
    });

    // Capture button handler
    const captureBtn = modal.querySelector('#capture-photo');
    captureBtn?.addEventListener('click', () => {
      this.capturePhoto(video);
    });

    // Switch camera handler
    const switchBtn = modal.querySelector('#switch-camera');
    switchBtn?.addEventListener('click', () => {
      this.switchCamera(stream, modal);
    });

    // Close on overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeCameraModal(modal, stream);
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeCameraModal(modal, stream);
      }
    });
  }

  private closeCameraModal(modal: HTMLElement, stream: MediaStream): void {
    // Stop all tracks
    stream.getTracks().forEach(track => track.stop());
    
    // Remove modal
    document.body.removeChild(modal);
    
    // Remove event listeners
    document.removeEventListener('keydown', () => {});
  }

  private capturePhoto(video: HTMLVideoElement): void {
    // Create canvas to capture frame
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    
    // Convert to data URL
    const imageData = canvas.toDataURL('image/png');
    
    // Simulate QR detection (in real app, you'd use a QR library)
    console.log('Captured image:', imageData);
    alert('Foto berhasil diambil! (Simulasi - QR detection akan diimplementasi dengan library QR scanner)');
    
    // Here you would integrate with a QR code library like:
    // - jsQR
    // - QuaggaJS
    // - ZXing
  }

  private async switchCamera(stream: MediaStream, modal: HTMLElement): Promise<void> {
    try {
      // Stop current stream
      stream.getTracks().forEach(track => track.stop());
      
      // Get new stream with different facing mode
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user', // Switch to front camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      // Update video element
      const video = modal.querySelector('#camera-video') as HTMLVideoElement;
      video.srcObject = newStream;
      
      // Update close handler to use new stream
      const closeBtn = modal.querySelector('#close-camera');
      closeBtn?.replaceWith(closeBtn.cloneNode(true));
      closeBtn?.addEventListener('click', () => {
        this.closeCameraModal(modal, newStream);
      });
      
    } catch (error) {
      console.error('Error switching camera:', error);
      alert('Gagal mengganti camera');
    }
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
