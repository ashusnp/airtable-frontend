import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AirtableApiService } from '../../services/api.service';

@Component({
  standalone: true,
  selector: 'app-revision-login-dialog',
  templateUrl: './revision-login-dialog.component.html',
  styleUrls: ['./revision-login-dialog.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
})
export class RevisionLoginDialogComponent {
  password = '';
  mfaCode = '';
  mfaRequired = false;
  mfaToken = '';
  loading = false;

  constructor(
    private airtable: AirtableApiService,
    public dialogRef: MatDialogRef<RevisionLoginDialogComponent>
  ) {}

  onLogin() {
    this.loading = true;
    if (this.mfaRequired) {
      this.airtable.verifyMfa(this.mfaCode, this.mfaToken).subscribe({
        next: (res: any) => {
          if (res.isUserLoggedIn) {
            localStorage.setItem('isUserLoggedIn', res.isUserLoggedIn);
            localStorage.setItem('cookieExpiryAt', res.cookieExpiryAt);
            alert('✅ Logged in successfully');
            this.dialogRef.close(true);
          } else {
            alert('❌ Login failed');
            this.dialogRef.close(false);
          }
        },
        error: () => {
          alert('❌ Login failed');
          this.dialogRef.close(false);
        },
      });
    } else {
      this.airtable.loginWithMfa(this.password).subscribe({
        next: (res: any) => {
          if (res.mfaRequired) {
            this.mfaRequired = true;
            this.mfaToken = res.mfaToken;
            this.loading = false;
          } else if (res.isUserLoggedIn) {
            localStorage.setItem('isUserLoggedIn', res.isUserLoggedIn);
            localStorage.setItem('cookieExpiryAt', res.cookieExpiryAt);
            alert('✅ Logged in successfully');
            this.dialogRef.close(true);
          } else {
            alert('❌ Login failed');
            this.dialogRef.close(false);
          }
        },
        error: () => {
          alert('❌ Login failed');
          this.dialogRef.close(false);
        },
      });
    }
  }
}
