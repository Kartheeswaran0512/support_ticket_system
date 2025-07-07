import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-new-ticket',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <!-- <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-4"> -->
    <div class="bg-gray-900  min-h-screen p-4">  
    <div class="max-w-4xl mx-auto">
        
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <mat-icon class="text-blue-600 text-3xl">confirmation_number</mat-icon>
          </div>
          <h1 class="text-4xl font-bold text-yellow-200 mb-2">Create New Ticket</h1>
          <p class="text-yellow-300">Submit your support request and we'll get back to you soon</p>
        </div>

        <!-- Form Card -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
            <h2 class="text-xl font-semibold text-white flex items-center gap-2">
              <mat-icon>edit</mat-icon>
              Ticket Details
            </h2>
          </div>
          
          <form (ngSubmit)="submit()" class="p-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              
              <!-- Subject -->
              <div class="md:col-span-2">
                <mat-form-field  class="w-full">
                  <mat-label>Subject</mat-label>
                  <mat-icon matPrefix class="text-gray-400 mr-2">title</mat-icon>
                  <input matInput [(ngModel)]="ticket.subject" name="subject" 
                         placeholder="Brief description of your issue" required />
                </mat-form-field>
              </div>

              <!-- Category -->
              <div>
                <mat-form-field  class="w-full">
                  <mat-label>Category</mat-label>
                  <mat-icon matPrefix class="text-gray-400 mr-2">category</mat-icon>
                  <mat-select [(ngModel)]="ticket.category" name="category" required>
                    <mat-option value="Technical Support">
                      <div class="flex items-center gap-2">
                        <mat-icon class="text-blue-500">build</mat-icon>
                        Technical Support
                      </div>
                    </mat-option>
                    <mat-option value="Bug Report">
                      <div class="flex items-center gap-2">
                        <mat-icon class="text-red-500">bug_report</mat-icon>
                        Bug Report
                      </div>
                    </mat-option>
                    <mat-option value="Feature Request">
                      <div class="flex items-center gap-2">
                        <mat-icon class="text-green-500">lightbulb</mat-icon>
                        Feature Request
                      </div>
                    </mat-option>
                    <mat-option value="Account Issues">
                      <div class="flex items-center gap-2">
                        <mat-icon class="text-orange-500">account_circle</mat-icon>
                        Account Issues
                      </div>
                    </mat-option>
                    <mat-option value="Other">
                      <div class="flex items-center gap-2">
                        <mat-icon class="text-gray-500">help</mat-icon>
                        Other
                      </div>
                    </mat-option>
                  </mat-select>
                </mat-form-field>
              </div>

              <!-- Priority -->
              <div>
                <mat-form-field  class="w-full">
                  <mat-label>Priority</mat-label>
                  <mat-icon matPrefix class="text-gray-400 mr-2">priority_high</mat-icon>
                  <mat-select [(ngModel)]="ticket.priority" name="priority" required>
                    <mat-option value="Low">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 bg-green-400 rounded-full"></div>
                        Low Priority
                      </div>
                    </mat-option>
                    <mat-option value="Medium">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        Medium Priority
                      </div>
                    </mat-option>
                    <mat-option value="High">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 bg-red-400 rounded-full"></div>
                        High Priority
                      </div>
                    </mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
            </div>

            <!-- Description -->
            <div class="mb-6">
              <mat-form-field  class="w-full">
                <mat-label>Description</mat-label>
                <mat-icon matPrefix class="text-gray-400 mr-2">description</mat-icon>
                <textarea matInput [(ngModel)]="ticket.description" name="description" 
                         rows="5" placeholder="Please provide detailed information about your issue..." 
                         required></textarea>
              </mat-form-field>
            </div>

            <!-- Attachment -->
            <div class="mb-8">
              <label class="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <mat-icon class="text-gray-500">attach_file</mat-icon>
                Attachment (optional)
              </label>
              <div class="relative">
                <input type="file" #fileInput (change)="onFileSelected($event)" 
                       accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt" class="hidden" />
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                     (click)="fileInput.click()">
                  <div *ngIf="!selectedFile" class="text-gray-500">
                    <mat-icon class="text-4xl mb-2">cloud_upload</mat-icon>
                    <p class="text-sm">Click to upload or drag and drop</p>
                    <p class="text-xs text-gray-400 mt-1">PNG, JPG, PDF, DOC up to 10MB</p>
                  </div>
                  <div *ngIf="selectedFile" class="text-green-600">
                    <mat-icon class="text-4xl mb-2">check_circle</mat-icon>
                    <p class="text-sm font-medium">{{ selectedFile.name }}</p>
                    <p class="text-xs text-gray-500">{{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-gray-200">
              <button type="button" 
                      class="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      (click)="resetForm()">
                <mat-icon>refresh</mat-icon>
                Reset Form
              </button>
              
              <div class="flex gap-3">
                <button type="button" mat-stroked-button 
                        class="px-6 py-2" 
                        routerLink="/dashboard">
                  Cancel
                </button>
                <button type="submit" mat-raised-button color="primary" 
                        [disabled]="isSubmitting"
                        class="px-8 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                  <mat-spinner *ngIf="isSubmitting" diameter="20" class="mr-2"></mat-spinner>
                  <mat-icon *ngIf="!isSubmitting" class="mr-1">send</mat-icon>
                  {{ isSubmitting ? 'Creating...' : 'Create Ticket' }}
                </button>
              </div>
            </div>
          </form>
        </div>
        
        <!-- Help Section -->
        <div class="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div class="flex items-start gap-3">
            <mat-icon class="text-blue-600 mt-1">info</mat-icon>
            <div>
              <h3 class="font-semibold text-blue-800 mb-2">Need Help?</h3>
              <p class="text-blue-700 text-sm leading-relaxed">
                Before submitting a ticket, check our FAQ or knowledge base. 
                For urgent issues, please select "High Priority" and provide detailed steps to reproduce the problem.
              </p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  `,
  styles: [`
    ::ng-deep .mat-mdc-form-field {
      margin-bottom: 0;
    }
    
    ::ng-deep .mat-mdc-select-panel .mat-mdc-option {
      padding: 12px 16px;
    }
    
    .file-upload-area {
      transition: all 0.3s ease;
    }
    
    .file-upload-area:hover {
      background-color: #f8fafc;
    }
  `]
})
export class NewTicketComponent {
  ticket = { subject: '', category: '', priority: '', description: '' };
  selectedFile: File | null = null;
  isSubmitting = false;

  constructor(private ticketService: TicketService, private router: Router) {}
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }
  
  resetForm() {
    this.ticket = { subject: '', category: '', priority: '', description: '' };
    this.selectedFile = null;
  }
  submit() {
    if (!this.ticket.subject || !this.ticket.category || !this.ticket.priority || !this.ticket.description) {
      return;
    }
    
    this.isSubmitting = true;
    this.ticketService.createTicket(this.ticket).subscribe({
      next: () => {
        this.isSubmitting = false;
        alert('Create Ticket Successfully');
        this.router.navigate(['/my-tickets']);
      },
      error: err => {
        this.isSubmitting = false;
        alert(err.error.message || 'Something went wrong.');
      }
    });
  }
}


