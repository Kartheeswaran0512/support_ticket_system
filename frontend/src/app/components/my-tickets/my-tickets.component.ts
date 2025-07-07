import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketService } from '../../services/ticket.service';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-tickets',
  standalone: true,
  imports: [
    MatTableModule, 
    CommonModule, 
    RouterModule, 
    MatCardModule, 
    MatChipsModule, 
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule
  ],
  template: `
    <!-- <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4"> -->
      <div class="bg-gray-900  min-h-screen p-4">
      <div class="max-w-7xl mx-auto">
        
        <!-- Header -->
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div class="flex items-center gap-3">
              <div class="bg-blue-100 p-3 rounded-full">
                <mat-icon class="text-blue-600 text-2xl">confirmation_number</mat-icon>
              </div>
              <div>
                <h1 class="text-3xl font-bold text-gray-800">My Tickets</h1>
                <p class="text-gray-600">{{ filteredTickets.length }} of {{ tickets.length }} tickets</p>
              </div>
            </div>
            <button mat-raised-button color="primary" routerLink="/new-ticket" 
                    class="flex items-center gap-2">
              <mat-icon>add</mat-icon>
              New Ticket
            </button>
          </div>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <mat-form-field  class="w-full">
              <mat-label>Search tickets</mat-label>
              <mat-icon matPrefix>search</mat-icon>
              <input matInput [(ngModel)]="searchTerm" (input)="filterTickets()" 
                     placeholder="Search by subject">
            </mat-form-field>
            
            <mat-form-field  class="w-full">
              <mat-label>Filter by Status</mat-label>
              <mat-icon matPrefix>filter_list</mat-icon>
              <mat-select [(ngModel)]="statusFilter" (selectionChange)="filterTickets()">
                <mat-option value="">All Status</mat-option>
                <mat-option value="Open">Open</mat-option>
                <mat-option value="In Progress">In Progress</mat-option>
                <mat-option value="Closed">Closed</mat-option>
              </mat-select>
            </mat-form-field>
            
            <mat-form-field  class="w-full">
              <mat-label>Filter by Priority</mat-label>
              <mat-icon matPrefix>priority_high</mat-icon>
              <mat-select [(ngModel)]="priorityFilter" (selectionChange)="filterTickets()">
                <mat-option value="">All Priorities</mat-option>
                <mat-option value="High">High</mat-option>
                <mat-option value="Medium">Medium</mat-option>
                <mat-option value="Low">Low</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="filteredTickets.length === 0 && tickets.length === 0" 
             class="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div class="max-w-md mx-auto">
            <mat-icon class="text-gray-300 text-6xl mb-4">inbox</mat-icon>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">No tickets yet</h3>
            <p class="text-gray-600 mb-6">Create your first support ticket to get started</p>
            <button mat-raised-button color="primary" routerLink="/new-ticket">
              <mat-icon class="mr-2">add</mat-icon>
              Create First Ticket
            </button>
          </div>
        </div>

        <!-- No Results -->
        <div *ngIf="filteredTickets.length === 0 && tickets.length > 0" 
             class="bg-white rounded-2xl shadow-lg p-12 text-center">
          <mat-icon class="text-gray-300 text-6xl mb-4">search_off</mat-icon>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">No matching tickets</h3>
          <p class="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>

        <!-- Tickets Grid -->
        <div *ngIf="filteredTickets.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <mat-card *ngFor="let t of filteredTickets" 
                    class="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                    [routerLink]="['/ticket', t.id]"
                    (click)="onTicketClick(t)">
            
            <!-- Card Header -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-800 mb-1">{{ t.subject || 'No subject' }}</h3>
                <p class="text-sm text-gray-500">Ticket #{{ t.id }}</p>
              </div>
              <mat-icon class="text-gray-400">{{ getStatusIcon(t.status) }}</mat-icon>
            </div>

            <!-- Status Badge -->
            <div class="mb-3">
              <!-- <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                    [ngClass]="getStatusClass(t.status)"> -->
                <!-- <div class="w-2 h-2 rounded-full mr-2" [ngClass]="getStatusDotClass(t.status)"></div> -->
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium">
                <div class="w-2 h-2 rounded-full mr-2" ></div>

                {{ t.status }}
              </span>
            </div>

            <!-- Ticket Details -->
            <div class="space-y-2 mb-4">
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <mat-icon class="text-gray-400 text-base">category</mat-icon>
                <span>{{ t.category || 'NA' }}</span>
              </div>
              
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <mat-icon class="text-gray-400 text-base">{{ getPriorityIcon(t.priority) }}</mat-icon>
                <span>{{t.priority || 'NA'}}</span>
                <!-- <span class="font-medium" [ngClass]="getPriorityClass(t.priority)">{{ t.priority || 'NA' }} Priority</span> -->
              </div>
            </div>

            <!-- Card Footer -->
            <div class="flex items-center justify-between pt-3 border-t border-gray-100">
              <span class="text-xs text-gray-500">Click to view details</span>
              <mat-icon class="text-blue-500">arrow_forward</mat-icon>
            </div>
          </mat-card>
        </div>
        
      </div>
    </div>
  `,
  // styles: [`
  //   .ticket-card { margin-bottom: 12px; }
  // `]
})
export class MyTicketsComponent implements OnInit {
  tickets: any[] = [];
  filteredTickets: any[] = [];
  searchTerm = '';
  statusFilter = '';
  priorityFilter = '';

  constructor(private ticketService: TicketService) {}

  ngOnInit() {
    this.ticketService.getTickets().subscribe(data => {
      console.log('fetching data',data);
      this.tickets = data;
      this.filteredTickets = data;
    });
  }
  
  filterTickets() {
    this.filteredTickets = this.tickets.filter(ticket => {
      const matchesSearch = !this.searchTerm || 
        ticket.subject.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.statusFilter || ticket.status === this.statusFilter;
      const matchesPriority = !this.priorityFilter || ticket.priority === this.priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }
// old code
  // getColor(status: string): 'primary' | 'accent' | 'warn' {
  //   return status === 'Open' ? 'warn' :
  //          status === 'In Progress' ? 'accent' : 'primary';
  // }
// }

  getColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'open':
        return 'warn';
      case 'pending':
      case 'in progress':
        return 'accent';
      case 'closed':
        return 'primary';
      default:
        return '';
    }
  }
  
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-red-100 text-blue-800';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
  
  getStatusDotClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-red-400';
      case 'in progress':
        return 'bg-yellow-400';
      case 'closed':
        return 'bg-green-400';
      default:
        return 'bg-gray-400';
    }
  }
  
  getStatusIcon(status: string): string {
    switch (status.toLowerCase()) {
      case 'open':
        return 'error_outline';
      case 'in progress':
        return 'hourglass_empty';
      case 'closed':
        return 'check_circle_outline';
      default:
        return 'help_outline';
    }
  }
  
  getPriorityClass(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  }
  
  getPriorityIcon(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'keyboard_double_arrow_up';
      case 'medium':
        return 'keyboard_arrow_up';
      case 'low':
        return 'keyboard_arrow_down';
      default:
        return 'remove';
    }
  }
  
  onTicketClick(ticket: any) {
    console.log('Clicking ticket:', ticket);
    console.log('Navigating to:', `/ticket/${ticket.id}`);
  }
}
