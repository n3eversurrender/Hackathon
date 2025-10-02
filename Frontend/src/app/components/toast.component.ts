import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-md">
      @for (toast of toasts$ | async; track toast.id) {
        <div
          [class]="getToastClass(toast.type)"
          class="transform transition-all duration-300 ease-out animate-slide-in rounded-xl shadow-2xl overflow-hidden"
        >
          <div class="flex items-start gap-3 p-4">
            <!-- Icon with animated background -->
            <div class="flex-shrink-0">
              <div [class]="getIconBgClass(toast.type)" class="rounded-full p-2">
                @if (toast.type === 'success') {
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                } @else if (toast.type === 'error') {
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                } @else if (toast.type === 'warning') {
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                } @else {
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              @if (toast.title) {
                <h3 class="font-bold text-base mb-1">{{ toast.title }}</h3>
              }
              <p class="text-sm opacity-90">{{ toast.message }}</p>
            </div>

            <!-- Close Button -->
            <button
              (click)="close(toast.id)"
              class="flex-shrink-0 hover:opacity-70 transition-opacity"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Progress bar -->
          <div class="h-1 bg-black/10 rounded-b-xl overflow-hidden">
            <div
              class="h-full bg-white/30 animate-progress"
              [style.animation-duration.ms]="toast.duration"
            ></div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      @keyframes slide-in {
        from {
          opacity: 0;
          transform: translateX(100%) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
      }

      @keyframes progress {
        from {
          width: 100%;
        }
        to {
          width: 0%;
        }
      }

      .animate-slide-in {
        animation: slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .animate-progress {
        animation: progress linear forwards;
      }
    `,
  ],
})
export class ToastComponent {
  toasts$;

  constructor(private toastService: ToastService) {
    this.toasts$ = this.toastService.toasts$;
  }

  getToastClass(type: string): string {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
      case 'error':
        return 'bg-gradient-to-r from-red-500 to-rose-600 text-white';
      case 'warning':
        return 'bg-gradient-to-r from-amber-500 to-orange-600 text-white';
      case 'info':
      default:
        return 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white';
    }
  }

  getIconBgClass(type: string): string {
    switch (type) {
      case 'success':
        return 'bg-white/20';
      case 'error':
        return 'bg-white/20';
      case 'warning':
        return 'bg-white/20';
      case 'info':
      default:
        return 'bg-white/20';
    }
  }

  close(id: number) {
    this.toastService.remove(id);
  }
}
