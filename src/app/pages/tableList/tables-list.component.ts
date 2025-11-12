import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { AirtableApiService } from '../../services/api.service';

@Component({
  standalone: true,
  selector: 'app-tables-list',
  templateUrl: './tables-list.component.html',
  styleUrls: ['./tables-list.component.scss'],
  imports: [CommonModule, AgGridAngular],
})
export class TablesListComponent implements OnChanges {
  @Input() baseId!: string | null;
  @Output() tableSelected = new EventEmitter<any>();
  rowData: any[] = [];
  gridApi: any;

  // ✅ No sort, no filter — simple pagination only
  columnDefs = [
    { headerName: 'Table ID', field: 'tableId' },
    { headerName: 'Name', field: 'name' },
    { headerName: 'Fields Count', field: 'fields.length' },
  ];

  constructor(private airtable: AirtableApiService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['baseId'] && this.baseId) {
      this.airtable.getTables(this.baseId).subscribe((res) => {
        this.rowData = res || [];

        // Auto-select first table
        setTimeout(() => {
          if (this.rowData.length > 0) {
            const first = this.rowData[0];
            this.tableSelected.emit(first);
            if (this.gridApi) {
              this.gridApi.forEachNode((node: any) => {
                if (node.data.tableId === first.tableId) {
                  node.setSelected(true);
                }
              });
            }
          }
        }, 300);
      });
    }
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  onRowClicked(event: any): void {
    this.tableSelected.emit(event.data);
  }
}
