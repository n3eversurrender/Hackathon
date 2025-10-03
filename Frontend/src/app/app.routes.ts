import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { AttendanceHistoryComponent } from './features/attendance-history/attendance-history';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { DashboardComponent } from './features/dashboard/dashboard';
import { GenerateAbsenComponent } from './features/generate-absen/generate-absen';
import { ManageClassesComponent } from './features/manage-classes/manage-classes';
import { ManageUsersComponent } from './features/manage-users/manage-users';
import { SettingsComponent } from './features/settings/settings';

// Role constants based on backend
// 0 = Admin, 1 = Student, 2 = Lecturer
const ADMIN = 0;
const LECTURER = 2;

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard, roleGuard([ADMIN, LECTURER])],
  },
  {
    path: 'manage-users',
    component: ManageUsersComponent,
    canActivate: [authGuard, roleGuard([ADMIN])],
  },
  {
    path: 'manage-classes',
    component: ManageClassesComponent,
    canActivate: [authGuard, roleGuard([ADMIN, LECTURER])],
  },
  {
    path: 'generate-absen',
    component: GenerateAbsenComponent,
    canActivate: [authGuard, roleGuard([ADMIN, LECTURER])],
  },
  {
    path: 'attendance-history',
    component: AttendanceHistoryComponent,
    canActivate: [authGuard, roleGuard([ADMIN, LECTURER])],
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [authGuard, roleGuard([ADMIN, LECTURER])],
  },
];
