import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private BASE_URL = 'https://support-ticket-system-q4y8.onrender.com';

  constructor(private http: HttpClient, private auth: AuthService) {}
  //old code
  // private getHeaders() {
  //   const token = this.auth.getToken();
  //   return {
  //     headers: new HttpHeaders({
  //       'Authorization': token ? `Bearer ${token}` : '',
  //       'Content-Type': 'application/json'
  //     })
  //   };
  // }
    private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
    }

// old code
  getTickets() {
    
    return this.http.get<any[]>(`${this.BASE_URL}/tickets`, this.getHeaders());
  }
  getTicketsCount() {
    return this.http.get<{ total: number, open: number, closed: number, my: number }>(`${this.BASE_URL}/tickets/count`, this.getHeaders());
  }
  getMyTickets() {
    return this.http.get<any[]>(`${this.BASE_URL}/my-tickets`, this.getHeaders());
  }
  createTicket(ticket: any) {
    return this.http.post(`${this.BASE_URL}/tickets`, ticket, this.getHeaders());
  }

  getTicketById(id: number) {
    return this.http.get(`${this.BASE_URL}/tickets/${id}`, this.getHeaders());
  }

  updateTicket(id: number, data: any) {
    return this.http.put(`${this.BASE_URL}/tickets/${id}`, data, this.getHeaders());
  }

  getTicketStats() {
    return this.http.get<{ priority: any[] }>(`${this.BASE_URL}/tickets/stats`, this.getHeaders());
  }
   getLatestTicket() {
  return this.http.get<any>(`${this.BASE_URL}/tickets/latest`, this.getHeaders());
}
   getTopCreator(){
    return this.http.get<any>(`${this.BASE_URL}/tickets/top-creator`, this.getHeaders());
   }


}
// today code(1/7/25)
  // getTickets(): Observable<any> {
  //   return this.http.get(`${this.BASE_URL}/tickets`, this.getHeaders());
  // }

  // getMyTickets(): Observable<any> {
  //   return this.http.get(`${this.BASE_URL}/my-tickets`, this.getHeaders());
  // }

  // getTicketsCount(): Observable<any> {
  //   return this.http.get(`${this.BASE_URL}/tickets/count`, this.getHeaders());
  // }

  // getTicketStats(): Observable<any> {
  //   return this.http.get(`${this.BASE_URL}/tickets/stats`, this.getHeaders());
  // }

  // getTicketById(id: number): Observable<any> {
  //   return this.http.get(`${this.BASE_URL}/tickets/${id}`, this.getHeaders());
  // }

  // createTicket(ticket: any): Observable<any> {
  //   return this.http.post(`${this.BASE_URL}/tickets`, ticket, this.getHeaders());
  // }

  // updateTicket(id: number, data: any): Observable<any> {
  //   return this.http.put(`${this.BASE_URL}/tickets/${id}`, data, this.getHeaders());
  // }

  // deleteTicket(id: number): Observable<any> {
  //   return this.http.delete(`${this.BASE_URL}/tickets/${id}`, this.getHeaders());
  // }
// } 
