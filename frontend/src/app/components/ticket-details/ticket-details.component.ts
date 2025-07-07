import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-ticket-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatDividerModule,
    RouterModule
  ],
  template: `
    <div class="min-h-screen bg-gray-900 p-4">
      <div class="max-w-4xl mx-auto">
        <!-- Back Button -->
        <button mat-stroked-button routerLink="/my-tickets" class="mb-4">
          <mat-icon>arrow_back</mat-icon>
          Back to My Tickets
        </button>
        
        <!-- Loading State -->
        <div *ngIf="!ticket" class="text-center py-8">
          <p>Loading ticket...</p>
        </div>
        
        <!-- Ticket Details -->
        <mat-card *ngIf="ticket" class="mb-6">
          <mat-card-header>
            <mat-icon mat-card-avatar>confirmation_number</mat-icon>
            <mat-card-title>{{ ticket.subject }}</mat-card-title>
            <mat-card-subtitle>Ticket #{{ ticket.id }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p class="text-sm text-gray-600">Category</p>
                <p class="font-medium">{{ ticket.category }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Priority</p>
                <mat-chip [color]="getPriorityColor(ticket.priority)" selected>
                  {{ ticket.priority }}
                </mat-chip>
              </div>
              <div>
                <p class="text-sm text-gray-600">Status</p>
                <mat-chip [color]="getStatusColor(ticket.status)" selected>
                  {{ ticket.status }}
                </mat-chip>
              </div>
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-2">Description</p>
              <p class="whitespace-pre-wrap">{{ ticket.description }}</p>
            </div>
          </mat-card-content>
        </mat-card>

    <mat-card class="comments-section">
      <mat-card-header>
        <mat-icon mat-card-avatar>comment</mat-icon>
        <mat-card-title>Comments ({{ comments.length }})</mat-card-title>
      </mat-card-header>
      
      <mat-card-content>
        <div *ngIf="comments.length === 0" class="no-comments">
          <mat-icon>chat_bubble_outline</mat-icon>
          <p>No comments yet. Be the first to comment!</p>
        </div>
        
        <div *ngFor="let comment of comments; let last = last" class="comment-item">
          <div class="comment-header">
            <mat-icon class="user-icon">account_circle</mat-icon>
            <span class="username">{{ comment.user_id }}</span>
          </div>
          <div class="comment-content">
            <p>{{ comment.comment }}</p>
            <div *ngIf="comment.attachment" class="attachment">
              <mat-icon>attach_file</mat-icon>
              <a [href]="'http://localhost:4000/uploads/' + comment.attachment" target="_blank">
                {{ comment.attachment }}
              </a>
            </div>
          </div>
          <mat-divider *ngIf="!last"></mat-divider>
        </div>
      </mat-card-content>
    </mat-card>

    <mat-card class="add-comment-section">
      <mat-card-header>
        <mat-icon mat-card-avatar>add_comment</mat-icon>
        <mat-card-title>Add Comment</mat-card-title>
      </mat-card-header>
      
      <mat-card-content>
        <form (ngSubmit)="submitComment()" class="comment-form">
          <mat-form-field class="full-width">
            <mat-label>Write your comment</mat-label>
            <mat-icon matPrefix>edit</mat-icon>
            <textarea matInput [(ngModel)]="newComment.comment" name="comment" 
                     rows="3" placeholder="Share your thoughts..." required></textarea>
          </mat-form-field>
          
          <div class="file-upload">
            <input type="file" #fileInput (change)="onFileChange($event)" 
                   accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" hidden />
            <button mat-stroked-button type="button" (click)="fileInput.click()">
              <mat-icon>attach_file</mat-icon>
              {{ selectedFile ? selectedFile.name : 'Attach File' }}
            </button>
          </div>
          
          <div class="form-actions">
            <button mat-raised-button color="primary" type="submit" 
                    [disabled]="!newComment.comment.trim()">
              <mat-icon>send</mat-icon>
              Submit Comment
            </button>
          </div>
        </form>
      </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    
    .comments-section, .add-comment-section {
      margin-bottom: 20px;
    }
    
    .no-comments {
      text-align: center;
      padding: 40px 20px;
      color: #666;
    }
    
    .no-comments mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #ccc;
      margin-bottom: 16px;
    }
    
    .comment-item {
      padding: 16px 0;
    }
    
    .comment-header {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }
    
    .user-icon {
      margin-right: 8px;
      color: #666;
    }
    
    .username {
      font-weight: 500;
      color: #333;
    }
    
    .comment-content {
      margin-left: 32px;
    }
    
    .comment-content p {
      margin: 0 0 8px 0;
      line-height: 1.5;
    }
    
    .attachment {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: #f5f5f5;
      border-radius: 4px;
      margin-top: 8px;
    }
    
    .attachment mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #666;
    }
    
    .attachment a {
      color: #1976d2;
      text-decoration: none;
    }
    
    .attachment a:hover {
      text-decoration: underline;
    }
    
    .comment-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .file-upload {
      display: flex;
      align-items: center;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
    }
    
    mat-card-header mat-icon[mat-card-avatar] {
      background: #1976d2;
      color: white;
    }
  `]
})
export class TicketDetailsComponent implements OnInit {
  ticket: any;
  comments: any[] = [];
  ticketId: number = 0;
  newComment = { comment: '' };
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private http: HttpClient,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.ticketId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Ticket ID:', this.ticketId);
    
    if (this.ticketId) {
      this.ticketService.getTicketById(this.ticketId).subscribe({
        next: ticket => {
          console.log('Ticket loaded:', ticket);
          this.ticket = ticket;
        },
        error: err => {
          console.error('Error loading ticket:', err);
          alert('Failed to load ticket: ' + (err.error?.message || 'Unknown error'));
        }
      });
      this.loadComments();
    } else {
      console.error('Invalid ticket ID');
      alert('Invalid ticket ID');
    }
  }

  loadComments() {
    this.http.get<any[]>(`http://localhost:4000/api/comments/${this.ticketId}`).subscribe({
      next: data => {
        this.comments = data || [];
      },
      error: err => {
        console.error('Error loading comments:', err);
        this.comments = [];
      }
    });
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  submitComment() {
    const formData = new FormData();
    formData.append('comment', this.newComment.comment);
    if (this.selectedFile) {
      formData.append('attachment', this.selectedFile);
    }

    this.http.post(`http://localhost:4000/api/comments/${this.ticketId}`, formData).subscribe({
      next: () => {
        this.newComment.comment = '';
        this.selectedFile = null;
        this.loadComments();
      },
      error: err => {
        alert('Comment failed: ' + (err.error.message || 'Unknown error'));
      }
    });
  }
  
  getPriorityColor(priority: string): string {
    switch (priority?.toLowerCase()) {
      case 'high': return 'warn';
      case 'medium': return 'accent';
      case 'low': return 'primary';
      default: return '';
    }
  }
  
  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'open': return 'warn';
      case 'in progress': return 'accent';
      case 'closed': return 'primary';
      default: return '';
    }
  }
}






