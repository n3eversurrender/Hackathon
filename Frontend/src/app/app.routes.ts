import { Routes } from '@angular/router';
import { AttendanceHistoryComponent } from './features/attendance-history/attendance-history';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { DashboardComponent } from './features/dashboard/dashboard';
import { GenerateAbsenComponent } from './features/generate-absen/generate-absen';
import { ManageClassesComponent } from './features/manage-classes/manage-classes';
import { ManageUsersComponent } from './features/manage-users/manage-users';
import { SettingsComponent } from './features/settings/settings';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'manage-users', component: ManageUsersComponent },
  { path: 'manage-classes', component: ManageClassesComponent },
  { path: 'generate-absen', component: GenerateAbsenComponent },
  { path: 'attendance-history', component: AttendanceHistoryComponent },
  { path: 'settings', component: SettingsComponent },
];
