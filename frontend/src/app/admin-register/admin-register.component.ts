
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatProgressSpinnerModule,RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        
        <!-- Logo/Brand Section -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4 shadow-lg">
            <mat-icon class="text-white text-3xl">person_add</mat-icon>
          </div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Join Support Portal</h1>
          <p class="text-gray-600">Create your account to get started</p>
        </div>

        <!-- Register Card -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
            <h2 class="text-2xl font-semibold text-white text-center flex items-center justify-center gap-2">
              <mat-icon>app_registration</mat-icon>
              Create Account
            </h2>
          </div>
          
          <div class="p-8">
            <form (ngSubmit)="onRegister()" class="space-y-6">
              
              <!-- Name Field -->
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <mat-icon class="text-gray-500 text-base">badge</mat-icon>
                  Full Name
                </label>
                <div class="relative">
                  <input
                    [(ngModel)]="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    required
                    [disabled]="isLoading"
                    class="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                  <mat-icon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">person</mat-icon>
                </div>
              </div>

              <!-- Email Field -->
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <mat-icon class="text-gray-500 text-base">email</mat-icon>
                  Email Address
                </label>
                <div class="relative">
                  <input
                    [(ngModel)]="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    [disabled]="isLoading"
                    class="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                  <mat-icon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">alternate_email</mat-icon>
                </div>
              </div>

              <!-- Password Field -->
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <mat-icon class="text-gray-500 text-base">lock</mat-icon>
                  Password
                </label>
                <div class="relative">
                  <input
                    [(ngModel)]="password"
                    name="password"
                    [type]="showPassword ? 'text' : 'password'"
                    placeholder="Create a strong password"
                    required
                    [disabled]="isLoading"
                    class="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                  <mat-icon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">lock</mat-icon>
                  <button
                    type="button"
                    (click)="togglePassword()"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <mat-icon class="text-xl">{{ showPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                  </button>
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  Password should be at least 6 characters long
                </div>
              </div>

              <!-- Role Field -->
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <mat-icon class="text-gray-500 text-base">admin_panel_settings</mat-icon>
                  Account Type
                </label>
                <div class="relative">
                  <select
                    [(ngModel)]="role"
                    name="role"
                    [disabled]="isLoading"
                    class="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed appearance-none bg-white"
                  >
                    <option value="customer">Admin</option>
                    <!-- <option value="admin">Admin - Manage all tickets</option> -->
                  </select>
                  <mat-icon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">group</mat-icon>
                  <mat-icon class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl pointer-events-none">expand_more</mat-icon>
                </div>
              </div>

              <!-- Error Message -->
              <div *ngIf="error" class="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                <mat-icon class="text-red-500 text-xl">error</mat-icon>
                <p class="text-red-700 text-sm">{{ error }}</p>
              </div>

              <!-- Success Message -->
              <div *ngIf="success" class="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                <mat-icon class="text-green-500 text-xl">check_circle</mat-icon>
                <p class="text-green-700 text-sm">{{ success }}</p>
              </div>

              <!-- Register Button -->
              <button
                type="submit"
                [disabled]="isLoading || !name || !email || !password"
                class="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                <mat-spinner *ngIf="isLoading" diameter="20" class="mr-2"></mat-spinner>
                <mat-icon *ngIf="!isLoading">person_add</mat-icon>
                {{ isLoading ? 'Creating Account...' : 'Create Account' }}
              </button>
            </form>
            
            <!-- Additional Links -->
            <div class="mt-6 text-center">
              <p class="text-sm text-gray-600">
                Already have an account? 
                <a routerLink="/adminlogin" class="text-green-600 hover:text-green-700 font-medium transition-colors">Sign In</a>
              </p>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="text-center mt-8">
          <p class="text-sm text-gray-500">
            By creating an account, you agree to our Terms of Service
          </p>
        </div>
        
      </div>
    </div>
  `
})
export class AdminRegisterComponent {
  name = '';
  email = '';
  password = '';
  role = 'admin';
  error = '';
  success = '';
  isLoading = false;
  showPassword = false;

  constructor(private auth: AuthService, private router: Router) {}

  onAdminRegister() {
    if (!this.name || !this.email || !this.password) {
      this.error = 'Please fill in all fields';
      return;
    }
    
    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters long';
      return;
    }
    
    this.isLoading = true;
    this.error = '';
    this.success = '';
      const userData = {
    name: this.name,
    email: this.email,
    password: this.password,
    role: this.role  // fallback role
  };
    //old code
  //   this.auth.Adminregister({ 
  //     name: this.name, 
  //     email: this.email, 
  //     password: this.password, 
  //     role: this.role 
  //   }).subscribe({
  //     next: () => {
  //       this.isLoading = false;
  //       this.success = 'Account created successfully! Redirecting to login...';
  //       setTimeout(() => {
  //         this.router.navigate(['/adminlogin']);
  //       }, 2000);
  //     },
  //     error: err => {
  //       this.isLoading = false;
  //       this.error = err.error.message || 'Registration failed. Please try again.';
  //     }
  //   });
  // }
  this.auth.Adminregister(userData).subscribe({
  next: (res) => {
    console.log('✅ Registration success:', res);
    this.isLoading = false;
    this.success = '🎉 Account created! Redirecting...';
    setTimeout(() => this.router.navigate(['/adminlogin']), 2000);
  },
  error: (err) => {
    console.error('❌ Registration failed:', err);
    this.isLoading = false;
    this.error = err?.error?.message || 'Registration failed. Please try again.';
  },
  complete: () => {
    console.log('✅ Register observable completed');
  }
});
  }

  
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
