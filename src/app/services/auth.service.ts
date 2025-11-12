import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AirtableAuthService {
  connected = signal(false);

  constructor(private http: HttpClient) {}

   checkAuth(): Observable<any> {
    return this.http.get(`${environment.API_BASE_URL}/airtable/status`, {
      withCredentials: true,
    });
  }
}
