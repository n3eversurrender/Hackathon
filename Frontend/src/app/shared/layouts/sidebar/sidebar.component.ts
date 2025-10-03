import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  @Input() activeMenu: string = '';

  constructor(private router: Router) {}

  setActiveMenu(menu: string): void {
    if (menu === 'beranda') {
      this.router.navigate(['/dashboard']);
    } else if (menu === 'kelola-kelas') {
      this.router.navigate(['/manage-classes']);
    } else if (menu === 'kelola-user') {
      this.router.navigate(['/manage-users']);
    } else if (menu === 'generate-absen') {
      this.router.navigate(['/generate-absen']);
    } else if (menu === 'riwayat-absen') {
      this.router.navigate(['/attendance-history']);
    } else if (menu === 'pengaturan') {
      this.router.navigate(['/settings']);
    }
  }

  logout(): void {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      this.router.navigate(['/login']);
    }
  }
}
