import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TicketService } from '../../services/ticket.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule, NgxChartsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-4">
      <div class="max-w-4xl mx-auto">
        
        <!-- Header -->
        <div class="bg-gray-300 rounded-2xl shadow-lg p-6 mb-6">
          <!-- <div class="bg-white/70 backdrop-blur-md shadow-md rounded-xl p-4"> -->
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-3xl font-bold text-gray-800">Dashboard</h1>
              <p class="text-gray-600 mt-1">
                Welcome <span class="font-semibold text-indigo-600">{{ username }}</span>, 
                <span class="text-sm bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">{{ role }}</span>
              </p>
            </div>
            <button
              (click)="logout()"
              class="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              Logout
            </button>
          </div>
        </div>

        <!-- Statistics Cards -->
        <div class="bg-blue-100 rounded-2xl shadow-lg p-6 mb-6">
          <!-- <div class="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl p-6 shadow-lg"> -->
  <!-- Total Tickets, Open, Closed, Top Creator, Latest Ticket -->


          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-800">Statistics</h2>
            <button
              (click)="loadCount()"
              class="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Refresh
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Total Tickets -->
            <div class="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-blue-100 text-sm mb-1">Total Tickets</p>
                  <p class="text-3xl font-bold">{{ totalTickets }}</p>
                </div>
                <div class="bg-blue-400 bg-opacity-30 p-3 rounded-lg">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 12c0-1.104.896-2 2-2v-4a2 2 0 00-2-2H4a2 2 0 00-2 2v4c1.104 0 2 .896 2 2s-.896 2-2 2v4a2 2 0 002 2h16a2 2 0 002-2v-4c-1.104 0-2-.896-2-2z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <!-- Open Tickets -->
            <div class="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-orange-100 text-sm mb-1">Open Tickets</p>
                  <p class="text-3xl font-bold">{{ openTickets }}</p>
                </div>
                <div class="bg-orange-400 bg-opacity-30 p-3 rounded-lg">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <!-- Closed Tickets -->
            <div class="bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-100 text-sm mb-1">Closed Tickets</p>
                  <p class="text-3xl font-bold">{{ closedTickets }}</p>
                </div>
                <div class="bg-gray-400 bg-opacity-30 p-3 rounded-lg">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <!-- Latest Ticket (Admin Only) -->
            <div class="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 text-white cursor-pointer" 
                 (click)="viewLatestTicket()" 
                 *ngIf="role === 'admin' && latestTicket">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <p class="text-green-100 text-sm mb-1">Latest Ticket</p>
                  <!-- <p class="text-lg font-bold truncate">{{ latestTicket.subject }}</p> -->
                  <p class="text-green-200 text-xs">{{ latestTicket.status | titlecase }} • {{ latestTicket.created_at | date:'MMM d' }}</p>
                </div>
                <div class="bg-green-400 bg-opacity-30 p-3 rounded-lg">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </div>
              </div>
            </div>
            <!-- Top Creator Card (Admin Only) -->
              <!-- <div class="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 text-white cursor-pointer" 
                 (click)="loadTopCreator()" 
                 *ngIf="role === 'admin' && topCreator">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <p class="text-green-100 text-sm mb-1">Top Creator</p>
                  <!-- <p class="text-lg font-bold truncate">{{ latestTicket.subject }}</p> -->
                  <!-- <p class="text-green-200 text-xs">{{ topCreator.username | titlecase }}</p>
                   <p class="text-green-200 text-xs">{{ topCreator.ticketCount }}</p>
                </div>
                <div class="bg-green-400 bg-opacity-30 p-3 rounded-lg">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </div>
              </div> --> 
             
            <!-- <div *ngIf="topCreator" class="p-4 bg-white rounded-lg shadow mt-6">
  <h3 class="text-lg font-semibold mb-2">👨‍💻 Top Ticket Creator</h3>
  <p><strong>Name:</strong> {{ topCreator.username }}</p>
  <p><strong>Total Tickets:</strong> {{ topCreator.ticketCount }}</p>
</div> -->
           <!-- Top Ticket Creator Card (Admin Only) -->
<div class="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white" *ngIf="topCreator && role === 'admin'">
  <div class="flex items-center justify-between">
    <div>
      <p class="text-purple-100 text-lg mb-1">Top Creator</p>
      <p class="text-lg  mb-1 ">{{ topCreator.name }}</p>
      <p class="text-purple-200 font-bold text-lg">{{ topCreator.count }} Tickets</p>
    </div>
    <div class="bg-purple-400 bg-opacity-30 p-3 rounded-lg">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    </div>
  </div>
</div>

        
            
            <!-- My Tickets Card (Customer or Admin fallback) -->
            <div class="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 text-white" 
                 *ngIf="role !== 'admin' || !latestTicket">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-green-100 text-sm mb-1">My Tickets</p>
                  <p class="text-3xl font-bold">{{ myTickets }}</p>
                </div>
                <div class="bg-green-400 bg-opacity-30 p-3 rounded-lg">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>


        <!-- Admin Charts Section -->
        <div *ngIf="role === 'admin'" class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <!-- Pie Chart -->
           <div class="bg-yellow-100 rounded-2xl shadow-lg p-6"> 
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Ticket Status Distribution</h3>
            <ngx-charts-pie-chart
              [results]="pieChartData"
              [view]="[400, 300]"
              [legend]="true"
              [labels]="true"
              [doughnut]="false"
              [arcWidth]="0.25">
            </ngx-charts-pie-chart>
          </div>
          
          <!-- Bar Chart -->
          <div class="bg-orange-100 rounded-2xl shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Tickets by Priority</h3>
            <ngx-charts-bar-vertical
              [results]="barChartData"
              [view]="[400, 300]"
              [xAxis]="true"
              [yAxis]="true"
              [legend]="false"
              [showXAxisLabel]="true"
              [showYAxisLabel]="true"
              xAxisLabel="Priority"
              yAxisLabel="Count">
            </ngx-charts-bar-vertical>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class=" bg-red-100
rounded-2xl shadow-lg p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              routerLink="/new-ticket"
              class="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-md transition-all duration-200 transform hover:scale-105"
            >
              <div class="bg-blue-400 bg-opacity-30 p-2 rounded-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
              </div>
              <div class="text-left">
                <p class="font-semibold">Create New Ticket</p>
                <p class="text-blue-100 text-sm">Submit a new support request</p>
              </div>
            </button>
            
            <button
              routerLink="/my-tickets"
              class="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl shadow-md transition-all duration-200 transform hover:scale-105"
            >
              <div class="bg-purple-400 bg-opacity-30 p-2 rounded-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <div class="text-left">
                <p class="font-semibold">View My Tickets</p>
                <p class="text-purple-100 text-sm">Check your ticket status</p>
              </div>
            </button>
            
            <button
              *ngIf="role === 'admin'"
              routerLink="/admin-tickets"
              class="flex items-center gap-3 p-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-md transition-all duration-200 transform hover:scale-105"
            >
              <div class="bg-red-400 bg-opacity-30 p-2 rounded-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <div class="text-left">
                <p class="font-semibold">Manage All Tickets</p>
                <p class="text-red-100 text-sm">Admin panel</p>
              </div>
            </button>
          </div>
        </div>
        
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  role = '';
  username = '';
  totalTickets = 0;
  openTickets = 0;
  closedTickets = 0;
  myTickets = 0;
  latestTicket: any;
  topCreator:any;

  // Chart data
  pieChartData: any[] = [];
  barChartData: any[] = [];

  constructor(private auth: AuthService, private ticketService: TicketService, private router: Router) {}

  ngOnInit(): void {
    this.role = this.auth.getRole() || '';
    this.username = this.auth.getUsername() || '';
    this.loadCount();
    if (this.role === 'admin') {
      this.loadChartData();
      this.loadLatestTicket();
      this.loadTopCreator();
    }
  }
  
  loadCount() {
    this.ticketService.getTicketsCount().subscribe({
      next: (res: any) => {
        console.log('tickets count', res);
        this.totalTickets = res.total || 0;
        this.openTickets = res.open || 0;
        this.closedTickets = res.closed || 0;
        this.myTickets = res.my || 0;
        
        if (this.role === 'admin') {
          this.updateChartData();
        }
      },
      error: (err) => {
        console.error('Error loading count:', err);
        this.totalTickets = 0;
        this.openTickets = 0;
        this.closedTickets = 0;
        this.myTickets = 0;
      }
    });
  }
// before
// {
//   "priority": [
//     { "priority": "high", "count": 5 },
//     { "priority": "medium", "count": 3 },
//     { "priority": "low", "count": 2 }
//   ]
// }
//after loadchartdata called
// [
//   { name: "High", value: 5 },
//   { name: "Medium", value: 3 },
//   { name: "Low", value: 2 }
// ]


  loadChartData() {
    this.ticketService.getTicketStats().subscribe({
      next: (res: any) => {
        this.barChartData = res.priority.map((item: any) => ({
          name: item.priority.charAt(0).toUpperCase() + item.priority.slice(1),
          value: item.count
        }));
      },
      error: (err) => {
        console.error('Error loading chart data:', err);
        this.barChartData = [];
      }
    });
  }

  updateChartData() {
    this.pieChartData = [
      { name: 'Open', value: this.openTickets },
      { name: 'Closed', value: this.closedTickets }
    ];
  }

   // latest ticket added customer
  loadLatestTicket() {
    this.ticketService.getLatestTicket().subscribe({
      next: (res: any) => {
        console.log('Latest ticket', res); 
        this.latestTicket = res;
      },
      error: (err) => {
        console.error('Error loading latest ticket:', err);
        this.latestTicket = null;
      }
    });
  }

  // top ticket count

  loadTopCreator(){
    this.ticketService.getTopCreator().subscribe({
      next: (res: any) => {
        console.log('Top creator', res);
        this.topCreator = res;
      },
      error: (err) => {
        console.error('Error loading latest ticket:', err);
        this.latestTicket = null;
      }
    });
  }

  viewLatestTicket() {
    if (this.latestTicket) {
      this.router.navigate(['/ticket', this.latestTicket.id], { fragment: 'comments' });
    }
  }

  logout(): void {
    this.auth.logout();
  }
}