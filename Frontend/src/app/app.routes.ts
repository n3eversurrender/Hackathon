import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { DashboardComponent } from './features/dashboard/dashboard';
import { ManageClassesComponent } from './features/manage-classes/manage-classes';
import { ManageUsersComponent } from './features/manage-users/manage-users';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'manage-users', component: ManageUsersComponent },
  { path: 'manage-classes', component: ManageClassesComponent },
];
