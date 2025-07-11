import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <!-- <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4"> -->
    <div class="bg-gray-900 min-h-screen flex items-center justify-center p-4">  
    <div class="w-full max-w-md">
        
        <!-- Logo/Brand Section -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 shadow-lg">
            <mat-icon class="text-white text-3xl">support_agent</mat-icon>
          </div>
          <h1 class="text-3xl font-bold text-orange-300 mb-2">Support Portal</h1>
          <p class="text-orange-300">Sign in to your account</p>
        </div>

        <!-- Login Card -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
            <h2 class="text-2xl font-semibold text-white text-center flex items-center justify-center gap-2">
              <mat-icon>login</mat-icon>
              Welcome Back
            </h2>
          </div>
          
          <div class="p-8">
            <form (ngSubmit)="onLogin()" class="space-y-6">
              
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
                    class="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                  <mat-icon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">person</mat-icon>
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
                    placeholder="Enter your password"
                    required
                    [disabled]="isLoading"
                    class="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
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
              </div>

              <!-- Error Message -->
              <div *ngIf="error" class="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                <mat-icon class="text-red-500 text-xl">error</mat-icon>
                <p class="text-red-700 text-sm">{{ error }}</p>
              </div>

              <!-- Login Button -->
              <button
                type="submit"
                [disabled]="isLoading || !email || !password"
                class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                <mat-spinner *ngIf="isLoading" diameter="20" class="mr-2"></mat-spinner>
                <mat-icon *ngIf="!isLoading">login</mat-icon>
                {{ isLoading ? 'Signing in...' : 'Sign In' }}
              </button>
            </form>
            
            <!-- Additional Links -->
            <div class="mt-6 text-center">
              <p class="text-sm text-gray-600">
                Don't have an account? 
                <a href="/adminregister" class="text-blue-600 hover:text-blue-700 font-medium transition-colors">Contact Admin</a>
              </p>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="text-center mt-8">
          <p class="text-sm text-orange-300">
            © 2024 Support Portal. All rights reserved.
          </p>
        </div>
        
      </div>
    </div>
  `
})
export class AdminLoginComponent {
  email = '';
  password = '';
  error = '';
  isLoading = false;
  showPassword = false;

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    if (!this.email || !this.password) {
      this.error = 'Please fill in all fields';
      return;
    }
    
    this.isLoading = true;
    this.error = '';
    
    this.auth.Adminlogin({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        this.auth.setSession(res.token, res.role, res.username);
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: err => {
        this.isLoading = false;
        this.error = err.error.message || 'Login failed. Please try again.';
      }
    });
  }
  
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
