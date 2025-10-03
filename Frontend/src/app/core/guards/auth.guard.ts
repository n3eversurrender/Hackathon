import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service';
import { ToastService } from '../../shared/toast.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  if (authService.isLoggedIn()) {
    return true;
  }

  toastService.warning('Silakan login terlebih dahulu!', 'Akses Ditolak!');
  router.navigate(['/login']);
  return false;
};

