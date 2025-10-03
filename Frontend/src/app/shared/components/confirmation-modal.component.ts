import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
      (click)="onBackdropClick($event)"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 animate-modal-in"
        (click)="$event.stopPropagation()"
      >
        <!-- Header -->
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center gap-4">
            <!-- Icon -->
            <div [class]="getIconClass()">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  [attr.d]="getIconPath()"
                />
              </svg>
            </div>
            <!-- Title -->
            <h3 class="text-xl font-bold text-gray-900">{{ title }}</h3>
          </div>
        </div>

        <!-- Body -->
        <div class="p-6">
          <p class="text-gray-600 text-base leading-relaxed">{{ message }}</p>
        </div>

        <!-- Footer -->
        <div class="p-6 bg-gray-50 rounded-b-2xl flex gap-3 justify-end">
          <button
            (click)="onCancel()"
            class="px-6 py-3 rounded-xl font-medium text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 transition-colors"
          >
            {{ cancelText }}
          </button>
          <button
            (click)="onConfirm()"
            [class]="getConfirmButtonClass()"
            class="px-6 py-3 rounded-xl font-medium text-white transition-colors"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      @keyframes modal-in {
        from {
          opacity: 0;
          transform: scale(0.9) translateY(-20px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }

      .animate-modal-in {
        animation: modal-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }
    `,
  ],
})
export class ConfirmationModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Konfirmasi';
  @Input() message = 'Apakah Anda yakin?';
  @Input() confirmText = 'Ya';
  @Input() cancelText = 'Batal';
  @Input() type: 'warning' | 'danger' | 'info' = 'warning';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }

  getIconClass(): string {
    switch (this.type) {
      case 'danger':
        return 'flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center';
      case 'warning':
        return 'flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center';
      case 'info':
        return 'flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center';
      default:
        return 'flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center';
    }
  }

  getIconPath(): string {
    switch (this.type) {
      case 'danger':
        return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z';
      case 'warning':
        return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z';
      case 'info':
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
      default:
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }

  getConfirmButtonClass(): string {
    switch (this.type) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700';
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-700';
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  }
}
