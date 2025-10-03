import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service';
import { ToastService } from '../../shared/toast.service';

export const roleGuard = (allowedRoles: number[]) => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const toastService = inject(ToastService);

    if (!authService.isLoggedIn()) {
      toastService.warning('Silakan login terlebih dahulu!', 'Akses Ditolak!');
      router.navigate(['/login']);
      return false;
    }

    if (authService.hasRole(allowedRoles)) {
      return true;
    }

    toastService.error('Anda tidak memiliki akses ke halaman ini!', 'Akses Ditolak!');
    router.navigate(['/dashboard']);
    return false;
  };
};

