import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface BaseRow { id: string; name: string; createdAt: string; }
export interface TicketRow { id: string; title: string; status: string; assignee: string; }
export interface RevisionPoint { name: string; value: number; }

@Injectable({ providedIn: 'root' })
export class AirtableApiService {
  private baseUrl = `${environment.API_BASE_URL}`;
  constructor(private http: HttpClient) {}
  // Replace these with real HTTP calls to your Node v22 backend
  getBases(): Observable<any> {
    return this.http.get(`${this.baseUrl}/airtable/bases`, { withCredentials: true });
  }

  getTables(baseId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/airtable/tables/${baseId}`, { withCredentials: true });
  }

  getTickets(baseId: string, tableId: string, page: number, limit: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/airtable/tickets/${baseId}/${tableId}?page=${page}&limit=${limit}`, { withCredentials: true });
  }

  syncData(): Observable<any> {
    return this.http.post(`${this.baseUrl}/airtable/sync`, {}, { withCredentials: true });
  }
  getRevisions(recordId: string, timeZone: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/revision/${recordId}?timeZone=${timeZone}`, {
      withCredentials: true,
    });
  }
  logoutRevisionAccess(): Observable<any> {
    return this.http.post(`${this.baseUrl}/airtable/logout-revision-access`, {}, { withCredentials: true });
  }

  loginWithMfa(password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/airtable/login-with-mfa`, {  password }, { withCredentials: true });
  }
  verifyMfa(mfaCode: string, mfaToken: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/airtable/login-with-mfa-verify`, { mfaCode, mfaToken }, { withCredentials: true });
  }
  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/airtable/logout`, {}, { withCredentials: true });
  }
}
