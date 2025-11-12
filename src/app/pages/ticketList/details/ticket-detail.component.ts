import { Component, Inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AirtableApiService } from '../../../services/api.service';

interface Revision {
  uuid: string;
  issueId: string;
  columnName: string;
  columnType: string;
  oldValue: string;
  newValue: string;
  createdDate: string | Date;
  authoredBy: string;
  authoredName: string;
  authoredEmail: string;
  authoredAvatar: string;
}

@Component({
  standalone: true,
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss'],
  imports: [CommonModule, MatButtonModule, MatDividerModule, MatIconModule],
})
export class TicketDetailComponent {
  @Input() record: any;
  revisions: Revision[] = [];
  loading = false;

  constructor(
    private airtable: AirtableApiService,
    @Inject(MAT_DIALOG_DATA) public data: { record: any }
  ) {
    this.record = data.record;
  }

  ngOnInit() {
    if (this.record?.recordId) {
      this.loadRevisions();
    }
  }

  loadRevisions() {
    this.loading = true;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    this.airtable.getRevisions(this.record.recordId, timeZone).subscribe({
      next: (res: any) => {
        this.revisions = (res?.revisions || []).map((r: any) => ({
          ...r,
          createdDate: new Date(r.createdDate),
        }));
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  isObject(value: any): boolean {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  getFieldEntries(): [string, any][] {
    if (!this.record?.fields) return [];
    return Object.entries(this.record.fields);
  }

  getDisplayValue(value: any): string {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    if (Array.isArray(value)) return value.join(', ');
    if (this.isObject(value)) {
      if ('value' in value) return value.value; // AI field case
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  }
}
