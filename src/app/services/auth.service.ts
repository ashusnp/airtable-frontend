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
  disconnect() {
    this.connected.set(false);
    document.cookie = 'airtable_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
  }
}
