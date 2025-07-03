import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Observable,Observer } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private BASE_URL = 'https://support-ticket-system-q4y8.onrender.com';
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient, private router: Router) {}
  // old code
  // register(data: any) {
  //   return this.http.post(`${this.BASE_URL}/register`, data);
  // }
    register(user: any): Observable<any> {
    return new Observable(observer => {
      // Simulate a real HTTP request
      this.http.post(`${this.BASE_URL}/register`, user).subscribe({
        next: (response: any) => {
          // Store name and role to show in dashboard
          localStorage.setItem('username', user.name);
          localStorage.setItem('role', user.role);
          observer.next(response);
          observer.complete();
        },
        error: err => observer.error(err)
      });
    });
  }

  login(credentials: any) {
    return this.http.post(`${this.BASE_URL}/login`, credentials);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  setSession(token: string, role: string, username?: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    if (username) {
      localStorage.setItem('username', username);
    }
    this.loggedIn.next(true);
  }

  isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }
  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
