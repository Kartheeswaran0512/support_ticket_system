
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule,ReactiveFormsModule,Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,MatIconModule, MatProgressSpinnerModule,RouterModule],
  template: `
    <!-- <div class="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 flex items-center justify-center p-4"> -->
     <div class="bg-gray-900 min-h-screen flex items-center justify-center p-4"> 
      <div class="w-full max-w-md">
        
        <!-- Logo/Brand Section -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4 shadow-lg">
            <mat-icon class="text-white text-3xl">person_add</mat-icon>
          </div>
          <h1 class="text-3xl font-bold text-yellow-300 mb-2">Join Support Portal</h1>
          <p class="text-yellow-300">Create your account to get started</p>
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
  <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">

    <!-- Name Field -->
    <div class="space-y-2">
      <label class="text-sm font-medium text-gray-700 flex items-center gap-2">
        <mat-icon class="text-gray-500 text-base">badge</mat-icon>
        Full Name
      </label>
      <div class="relative">
        <input
          formControlName="name"
          type="text"
          placeholder="Enter your full name"
          [disabled]="isLoading"
          class="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
        />
        <mat-icon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">person</mat-icon>
        <div *ngIf="form.controls['name'].touched && form.controls['name'].invalid" class="text-red-500 text-sm mt-1">
          Name is required.
        </div>
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
          formControlName="email"
          type="email"
          placeholder="Enter your email"
          [disabled]="isLoading"
          class="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
        />
        <mat-icon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">alternate_email</mat-icon>
        <div *ngIf="form.controls['email'].touched && form.controls['email'].errors" class="text-red-500 text-sm mt-1">
          <div *ngIf="form.controls['email'].errors?.['required']">Email is required.</div>
          <div *ngIf="form.controls['email'].errors?.['email'] || form.controls['email'].errors?.['pattern']">
            Please enter a valid email address.
          </div>
        </div>
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
          formControlName="password"
          [type]="showPassword ? 'text' : 'password'"
          placeholder="Create a strong password"
          [disabled]="isLoading"
          class="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
        />
        <mat-icon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">lock</mat-icon>
        <button
          type="button"
          (click)="togglePassword()"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <mat-icon class="text-xl">{{ showPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
        </button>
        <div *ngIf="form.controls['password'].touched && form.controls['password'].invalid" class="text-red-500 text-sm mt-1">
          Password must be at least 6 characters long.
        </div>
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
          formControlName="role"
          [disabled]="isLoading"
          class="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed appearance-none bg-white"
        >
          <option value="customer">Customer</option>
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
      [disabled]="isLoading || form.invalid"
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
      <a routerLink="/login" class="text-green-600 hover:text-green-700 font-medium transition-colors">Sign In</a>
    </p>
  </div>
</div>

  `
})
export class RegisterComponent {
  form : FormGroup;
  error='';
  success = '';
  isLoading = false;
  showPassword = false;

  constructor(private auth: AuthService, private router: Router,
    private fb: FormBuilder) {
       this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [
        Validators.required,
        Validators.email,
        // Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
        // restrict gmail.com
       Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.com$')

      ]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['customer']
    });
  }
   togglePassword() {
    this.showPassword = !this.showPassword;
  }
   onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error = 'Please fix all validation errors.';
      return;
    }
   
    this.error = '';
    this.success = '';
    this.isLoading = true;

    const customerData = this.form.value;

    this.auth.register(customerData).subscribe({
      next: (res) => {
        this.success = '🎉 Account created! Redirecting...';
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err?.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}


//   onSubmit(form :any) {
//     //old code
//     // if (!this.name || !this.email || !this.password) {
//     //   this.error = 'Please fill in all fields';
//     //   return;
//     // }
//      if (form.invalid) {
//       this.error = 'Please fix all validation errors.';
//       return;
//      }
    
//     if (this.password.length < 6) {
//       this.error = 'Password must be at least 6 characters long';
//       return;
//     }
    
//     this.isLoading = true;
//     this.error = '';
//     this.success = '';

//     const AdminData = {
//     name: this.name,
//     email: this.email,
//     password: this.password,
//     role: this.role   // fallback role
//   };
//     //old code
//   //   this.auth.Adminregister({ 
//   //     name: this.name, 
//   //     email: this.email, 
//   //     password: this.password, 
//   //     role: this.role 
//   //   }).subscribe({
//   //     next: () => {
//   //       this.isLoading = false;
//   //       this.success = 'Account created successfully! Redirecting to login...';
//   //       setTimeout(() => {
//   //         this.router.navigate(['/adminlogin']);
//   //       }, 2000);
//   //     },
//   //     error: err => {
//   //       this.isLoading = false;
//   //       this.error = err.error.message || 'Registration failed. Please try again.';
//   //     }
//   //   });
//   // }
//   console.log('register ',AdminData);
//   this.auth.Adminregister(AdminData).subscribe({
//   next: (res) => {
//     console.log('✅ Registration success:', res);
//     this.isLoading = false;
//     this.success = '🎉 Account created! Redirecting...';
//     setTimeout(() => this.router.navigate(['/adminlogin']), 2000);
//   },
//   error: (err) => {
//     console.error('❌ Registration failed:', err);
//     this.isLoading = false;
//     this.error = err?.error?.message || 'Registration failed. Please try again.';
//   },
//   complete: () => {
//     console.log('✅ Register observable completed');
//   }
// });
//   }


  
//   togglePassword() {
//     this.showPassword = !this.showPassword;
//   }
// }
