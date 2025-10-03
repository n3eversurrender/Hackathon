# 📚 Panduan Menggunakan Shared Layout Component

## 🎯 Konsep

Layout component ini mirip dengan `@yield` di Laravel Blade. Anda bisa membuat layout sekali, lalu dipakai di semua halaman tanpa copy-paste sidebar dan header.

## 🗂️ Struktur File

```
src/app/shared/layouts/
├── sidebar/
│   ├── sidebar.component.ts
│   └── sidebar.component.html
├── header/
│   ├── header.component.ts
│   └── header.component.html
└── main-layout/
    ├── main-layout.component.ts
    └── main-layout.component.html
```

## 🚀 Cara Menggunakan

### 1. Import `MainLayoutComponent` di file TypeScript

```typescript
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MainLayoutComponent } from '../../shared/layouts/main-layout/main-layout.component';

@Component({
  selector: 'app-your-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MainLayoutComponent], // ← Tambahkan ini
  templateUrl: './your-page.html',
})
export class YourPageComponent implements OnInit {
  activeMenu: string = 'nama-menu'; // beranda, kelola-kelas, kelola-user, dll
  currentDate: string = '';
  currentUser: string = 'Dudi';

  // ... kode lainnya
}
```

### 2. Gunakan di file HTML

**SEBELUM (326 baris):**

```html
<div class="min-h-screen bg-[#F5E6D3] flex">
  <!-- Sidebar (90 baris code) -->
  <aside>...</aside>

  <!-- Main Content -->
  <main>
    <!-- Header (20 baris code) -->
    <header>...</header>

    <!-- Content -->
    <div class="p-8">
      <!-- ISI HALAMAN ANDA -->
    </div>
  </main>
</div>
```

**SESUDAH (hanya konten halaman saja!):**

```html
<app-main-layout [activeMenu]="activeMenu" [currentDate]="currentDate" [currentUser]="currentUser">
  <!-- ISI HALAMAN ANDA DI SINI -->
  <!-- Ini akan masuk ke <ng-content> seperti @yield di Laravel -->

  <div class="bg-white rounded-2xl shadow-md p-6 border-2 border-[#7D2E2E]">
    <h1>Konten Halaman Anda</h1>
    <p>Semua konten halaman masuk di sini</p>
  </div>
</app-main-layout>
```

## 📝 Contoh Lengkap: Refactor Halaman Manage Users

### File: `manage-users.ts`

```typescript
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MainLayoutComponent } from '../../shared/layouts/main-layout/main-layout.component';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule, MainLayoutComponent],
  templateUrl: './manage-users.html',
})
export class ManageUsersComponent implements OnInit {
  currentDate: string = '';
  currentUser: string = 'Dudi';
  activeMenu: string = 'kelola-user'; // ← Menu yang aktif

  // Data dan method halaman Anda
  users: User[] = [...];

  ngOnInit(): void {
    this.setCurrentDate();
  }

  setCurrentDate(): void {
    // ... kode untuk set tanggal
  }

  // TIDAK PERLU lagi method setActiveMenu() dan logout()
  // Karena sudah ada di SidebarComponent!
}
```

### File: `manage-users.html`

```html
<app-main-layout [activeMenu]="activeMenu" [currentDate]="currentDate" [currentUser]="currentUser">
  <!-- Konten halaman -->
  <div class="bg-white rounded-2xl shadow-md p-6 border-2 border-[#7D2E2E]">
    <h3>Kelola User</h3>

    <!-- Table, Form, dll -->
    <table>
      ...
    </table>
  </div>
</app-main-layout>

<!-- Modal tetap di luar -->
<div *ngIf="showModal">
  <!-- Modal content -->
</div>
```

## 🎨 Props yang Bisa Dipakai

| Prop          | Type   | Required | Default | Deskripsi                                                                                                                     |
| ------------- | ------ | -------- | ------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `activeMenu`  | string | ✅ Yes   | -       | Menu yang sedang aktif: `'beranda'`, `'kelola-kelas'`, `'kelola-user'`, `'generate-absen'`, `'riwayat-absen'`, `'pengaturan'` |
| `currentDate` | string | ✅ Yes   | -       | Tanggal yang ditampilkan di header                                                                                            |
| `currentUser` | string | ❌ No    | 'Dudi'  | Nama user yang login                                                                                                          |

## 🔧 Kustomisasi

### Jika ingin menambah menu baru di sidebar:

Edit file: `src/app/shared/layouts/sidebar/sidebar.component.html`

```html
<button
  (click)="setActiveMenu('menu-baru')"
  [class.bg-[#8D3E3E]]="activeMenu === 'menu-baru'"
  class="w-full px-6 py-3 flex items-center gap-3 hover:bg-[#8D3E3E] transition-colors text-left"
>
  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <!-- Icon SVG -->
  </svg>
  <span class="font-medium">Menu Baru</span>
</button>
```

Edit file: `src/app/shared/layouts/sidebar/sidebar.component.ts`

```typescript
setActiveMenu(menu: string): void {
  if (menu === 'menu-baru') {
    this.router.navigate(['/menu-baru']);
  }
  // ... kode lainnya
}
```

## ✨ Keuntungan Menggunakan Layout Component

✅ **DRY (Don't Repeat Yourself)** - Tidak perlu copy-paste sidebar & header  
✅ **Mudah Maintenance** - Update 1 tempat, semua halaman berubah  
✅ **Lebih Clean** - File HTML jadi lebih pendek dan fokus ke konten  
✅ **Konsisten** - Semua halaman pasti punya layout yang sama  
✅ **Mirip Laravel Blade** - Konsep `<ng-content>` seperti `@yield`

## 📋 Checklist Refactor Halaman Lama

Untuk setiap halaman yang ingin direfactor:

- [ ] Import `MainLayoutComponent` di file `.ts`
- [ ] Tambahkan `MainLayoutComponent` ke array `imports`
- [ ] Hapus method `setActiveMenu()` dan `logout()` dari component
- [ ] Set property `activeMenu` sesuai halaman (contoh: `'kelola-user'`)
- [ ] Ganti template HTML:
  - [ ] Hapus wrapper `<div class="min-h-screen bg-[#F5E6D3] flex">`
  - [ ] Hapus semua code sidebar (`<aside>...</aside>`)
  - [ ] Hapus semua code header (`<header>...</header>`)
  - [ ] Bungkus konten dengan `<app-main-layout>`
  - [ ] Hapus wrapper `<div class="p-8">` (sudah ada di layout)
  - [ ] Modal tetap di luar `<app-main-layout>`

## 🎯 Halaman yang Perlu Direfactor

- [ ] Dashboard (`/dashboard`)
- [x] Manage Users (`/manage-users`) - **SUDAH (lihat manage-users-new.html)**
- [ ] Manage Classes (`/manage-classes`)
- [ ] Generate Absen (`/generate-absen`)
- [ ] Attendance History (`/attendance-history`)
- [ ] Settings (`/settings`)

---

**Catatan:** File `manage-users-new.html` adalah contoh hasil refactor. Setelah Anda yakin berhasil, rename file tersebut menjadi `manage-users.html` (backup yang lama dulu).
