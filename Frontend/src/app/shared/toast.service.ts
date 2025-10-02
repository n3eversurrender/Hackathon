import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Toast } from './toast.model';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$: Observable<Toast[]> = this.toastsSubject.asObservable();
  private nextId = 1;

  show(type: Toast['type'], message: string, title?: string, duration: number = 5000) {
    const toast: Toast = {
      id: this.nextId++,
      type,
      message,
      title,
      duration,
    };

    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, toast]);

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => this.remove(toast.id), duration);
    }
  }

  success(message: string, title: string = 'Sukses!') {
    this.show('success', message, title);
  }

  error(message: string, title: string = 'Error!') {
    this.show('error', message, title);
  }

  info(message: string, title: string = 'Info') {
    this.show('info', message, title);
  }

  warning(message: string, title: string = 'Perhatian!') {
    this.show('warning', message, title);
  }

  remove(id: number) {
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next(currentToasts.filter((toast) => toast.id !== id));
  }
}
