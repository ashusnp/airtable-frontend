import {
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  GridApi,
  GridOptions,
  RowModelType,
  ColDef
} from 'ag-grid-community';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AirtableApiService } from '../../services/api.service';
import { TicketDetailComponent } from './details/ticket-detail.component';

@Component({
  standalone: true,
  selector: 'app-tickets-list',
  templateUrl: './tickets-list.component.html',
  styleUrls: ['./tickets-list.component.scss'],
  imports: [CommonModule, AgGridAngular, MatDialogModule],
})
export class TicketsListComponent implements OnChanges {
  @Input() baseId!: string | null;
  @Input() tableId!: string | null;

  gridApi!: GridApi;
  totalRecords = 0;
  pageSize = 20;
  columnDefs: ColDef[] = [];

  gridOptions: GridOptions = {
    rowModelType: 'serverSide' as RowModelType,
    pagination: true,
    paginationPageSize: 20,
    cacheBlockSize: 20,
    animateRows: true,
    suppressCellFocus: true,
    enableCellTextSelection: true,
  };

  constructor(private airtable: AirtableApiService, private matDialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Changes in TicketsListComponent', changes, this.tableId);
    if (this.gridApi && this.baseId && this.tableId) {
      this.setupDatasource();
    }
  }

  onGridReady(event: any): void {
    this.gridApi = event.api;
    this.setupDatasource();
  }

  private setupDatasource(): void {
    if (!this.gridApi || !this.baseId || !this.tableId) return;

    const ds = {
      getRows: (params: any) => {
        const limit = this.gridApi.paginationGetPageSize() || this.pageSize;
        const startRow = params.request.startRow || 0;
        const page = Math.floor(startRow / limit) + 1;

        this.airtable.getTickets(this.baseId!, this.tableId!, page, limit).subscribe({
          next: (res: any) => {
            const rows = res.data || [];
            this.totalRecords = res.total || rows.length;

            if (rows.length > 0) {
              this.generateColumns(rows[0]);
            }

            params.success({ rowData: rows, rowCount: this.totalRecords });
          },
          error: (err) => {
            console.error('Error loading tickets', err);
            params.fail();
          },
        });
      },
    };

    // ✅ this replaces setServerSideDatasource()
    this.gridApi.setGridOption('serverSideDatasource', ds);
  }

  private generateColumns(firstRecord: any): void {
    const fields = Object.keys(firstRecord?.fields || {});
    const baseCols: ColDef[] = [
      { headerName: 'Record ID', field: 'recordId', minWidth: 150 },
      { headerName: 'Created Time', field: 'createdTime', minWidth: 180 },
    ];
    // console.log('fields', fields);
    const fieldCols: ColDef[] = fields.map((key) => ({
      headerName: key,
      field: `fields.${key}`,
      autoHeight: true,
      cellRenderer: (p: any) => this.renderFieldValue(p.value),
    }));

    this.columnDefs = [...baseCols.slice(0, 1), ...fieldCols, baseCols[1]];
    this.gridApi.setGridOption('columnDefs', this.columnDefs);
  }

  private renderFieldValue(value: any): string {
    if (value == null) return '';
    if (Array.isArray(value) && value[0]?.url) {
      return value
        .map(
          (f: any) =>
            `<img src="${f.thumbnails?.small?.url || f.url}"
             style="width:50px;height:35px;object-fit:cover;border-radius:4px;margin:2px;">`
        )
        .join('');
    }
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') {
      if (value.value) return value.value;
      if (value.name || value.email)
        return `${value.name || ''}${value.email ? ' (' + value.email + ')' : ''}`;
      return JSON.stringify(value);
    }
    return value.toString();
  }

  onRowClicked(event: any): void {
    if (localStorage.getItem('isUserLoggedIn') !== 'true') {
      alert('❌ Please login to view revisions');
      return;
    }
    this.matDialog.open(TicketDetailComponent, {
      width: '90vw',
      maxWidth: '95vw',
      panelClass: 'ticket-detail-dialog',
      data: { record: event.data },
    });
  }
}
