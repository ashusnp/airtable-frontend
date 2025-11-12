import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { BasesListComponent } from '../baseList/bases-list.component';
import { TablesListComponent } from '../tableList/tables-list.component';
import { TicketsListComponent } from '../ticketList/tickets-list.component';
import { AirtableApiService } from '../../services/api.service';
import { RevisionLoginDialogComponent } from '../revisionLoginDialog/revision-login-dialog.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { AirtableAuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    CommonModule,
    MatTabsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    BasesListComponent,
    TablesListComponent,
    TicketsListComponent,
    MatDividerModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
  ],
})
export class DashboardComponent {
  loading = false;
  selectedBaseId: string | null = null;
  selectedTableId: string | null = null;
  selectedBase: any | null = null;
  selectedTable: any | null = null;

  // ✅ Two login states
  isOAuthLoggedIn = true; // assume user already logged in with OAuth
  isRevisionLoggedIn = !!localStorage.getItem('isUserLoggedIn');
  cookieExpiryAt = localStorage.getItem('cookieExpiryAt');
  userName = 'Admin User'; // can be replaced with OAuth user info

  constructor(
    private airtable: AirtableApiService,
    private dialog: MatDialog,
    private router: Router,
    private auth: AirtableAuthService
  ) {}

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (!userData) {
      this.auth.checkAuth().subscribe({
        next: (user: any) => {
          if (user?.email) {
            localStorage.setItem('user', JSON.stringify(user));
            this.userName = user.email || '';
          }
        },
      });
    } else {
      try {
        const parsed = JSON.parse(userData);
        this.userName = parsed.email || '';
      } catch {
        console.warn('Invalid user data in localStorage');
      }
    }

    const expiry = localStorage.getItem('cookieExpiryAt');
    if (!expiry || (expiry && new Date() > new Date(expiry))) {
      this.logoutRevision();
    }
  }

  profileClick() {
    const expiry = localStorage.getItem('cookieExpiryAt');
    if (!expiry || (expiry && new Date() > new Date(expiry))) {
      this.logoutRevision();
    }
  }

  // 🔄 Sync data
  syncNow(): void {
    this.loading = true;
    this.airtable.syncData().subscribe({
      next: () => (this.loading = false),
      error: () => (this.loading = false),
    });
  }

  // 🔐 Open Revision Login Dialog
  openRevisionLoginDialog(): void {
    const dialogRef = this.dialog.open(RevisionLoginDialogComponent, {
      width: '400px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((success) => {
      if (success) {
        this.isRevisionLoggedIn = true;
        this.cookieExpiryAt = localStorage.getItem('cookieExpiryAt');
      }
    });
  }

  // 🚪 Logout Revision
  logoutRevision(): void {
    localStorage.removeItem('isUserLoggedIn');
    localStorage.removeItem('cookieExpiryAt');
    this.isRevisionLoggedIn = false;
    this.airtable.logoutRevisionAccess().subscribe();
  }

  // 🚪 Logout Main (OAuth)
  logoutMain(): void {
    this.isOAuthLoggedIn = false;
    this.logoutRevision();
    document.cookie =
      'myCookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.clear();
    this.airtable.logout().subscribe(() => {
      this.router.navigateByUrl('/login');
    });
  }

  // 🧱 Base / Table Selection
  onBaseSelected(base: any): void {
    if (this.selectedBaseId === base.baseId) {
      return;
    }
    this.selectedBaseId = base.baseId;
    this.selectedBase = base;
  }

  onTableSelected(table: any): void {
    this.selectedTableId = table.tableId;
    this.selectedTable = table;
  }
}
