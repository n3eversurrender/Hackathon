import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  title?: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.toastsSubject.asObservable();
  private idCounter = 0;

  show(
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    title?: string,
    duration = 5000,
  ) {
    const id = ++this.idCounter;
    const toast: Toast = { id, type, message, title, duration };

    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, toast]);

    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }
  }

  success(message: string, title = 'Berhasil!') {
    this.show(message, 'success', title);
  }

  error(message: string, title = 'Gagal!') {
    this.show(message, 'error', title);
  }

  info(message: string, title = 'Info') {
    this.show(message, 'info', title);
  }

  warning(message: string, title = 'Peringatan!') {
    this.show(message, 'warning', title);
  }

  remove(id: number) {
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next(currentToasts.filter((toast) => toast.id !== id));
  }
}
