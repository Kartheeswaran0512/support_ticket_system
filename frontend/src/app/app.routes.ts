import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MyTicketsComponent } from './components/my-tickets/my-tickets.component';
import { NewTicketComponent } from './components/new-ticket/new-ticket.component';
import { TicketDetailsComponent } from './components/ticket-details/ticket-details.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminRegisterComponent } from './admin-register/admin-register.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'my-tickets', component: MyTicketsComponent, canActivate: [AuthGuard] },
  { path: 'new-ticket', component: NewTicketComponent, canActivate: [AuthGuard] },
  { path: 'ticket/:id', component: TicketDetailsComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent},
  { path: 'adminregister', component: AdminRegisterComponent},
  { path: 'adminlogin', component: AdminLoginComponent},
  { path: 'login', component: LoginComponent}
];

