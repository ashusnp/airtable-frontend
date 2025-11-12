import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { environment } from '../../../environments/environment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AirtableApiService } from '../../services/api.service';


@Component({
  selector: 'app-airtable-login',
  templateUrl: './airtable-login.component.html',
  // styleUrls: ['./airtable-login.component.scss']
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule,FormsModule, MatInputModule, MatProgressSpinnerModule],
})
export class AirtableLoginComponent {
  @Output() loginSuccess = new EventEmitter<void>();
  email = '';
  password = '';
  mfaCode = '';
  mfaRequired = false;
  mfaToken = '';
  loading = false;

  constructor(private airtable: AirtableApiService) {}

  onLogin() {
    this.loading = true;
    this.airtable.loginWithMfa(this.password).subscribe({
      next: (res: any) => {
        console.log('AirtableLoginComponent onLogin', res);
        if (res.mfaRequired) {
          this.mfaRequired = true;
          this.mfaToken = res.mfaToken;
        } else if (res.isUserLoggedIn) {
          alert('✅ Logged in successfully without MFA');
          localStorage.setItem('isUserLoggedIn', res.isUserLoggedIn);
          localStorage.setItem('cookieExpiryAt', res.cookieExpiryAt);
          this.loginSuccess.emit();
        } else {
          alert('❌ Login failed');
          localStorage.removeItem('isUserLoggedIn');
          localStorage.removeItem('cookieExpiryAt');
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.log('AirtableLoginComponent onLogin error', error);
        alert('❌ Login failed');
        localStorage.removeItem('isUserLoggedIn');
        localStorage.removeItem('cookieExpiryAt');
        this.loading = false;
      }
      });
  }

  onVerifyMfa() {
    this.airtable.verifyMfa(this.mfaCode, this.mfaToken).subscribe((res: any) => {
      if (res.isUserLoggedIn) {
        alert('✅ Logged in successfully with MFA');
        localStorage.setItem('isUserLoggedIn', res.isUserLoggedIn);
        localStorage.setItem('cookieExpiryAt', res.cookieExpiryAt);
        this.loginSuccess.emit();
      }
    });
  }
}
