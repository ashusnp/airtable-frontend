import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { AirtableApiService } from '../../services/api.service';

@Component({
  standalone: true,
  selector: 'app-bases-list',
  templateUrl: './bases-list.component.html',
  styleUrls: ['./bases-list.component.scss'],
  imports: [CommonModule, AgGridAngular],
})
export class BasesListComponent implements OnInit {
  @Output() baseSelected = new EventEmitter<any>();
  rowData: any[] = [];
  gridApi: any;

  // ✅ No sort, no filter — simple display
  columnDefs = [
    { headerName: 'Base ID', field: 'baseId' },
    { headerName: 'Name', field: 'name' },
    { headerName: 'Permission', field: 'permissionLevel' },
  ];

  constructor(private airtable: AirtableApiService) {}

  ngOnInit(): void {
    this.airtable.getBases().subscribe((res) => {
      this.rowData = res || [];

      // Auto-select first base
      setTimeout(() => {
        if (this.rowData.length > 0) {
          const first = this.rowData[0];
          this.baseSelected.emit(first);
          if (this.gridApi) {
            this.gridApi.forEachNode((node: any) => {
              if (node.data.baseId === first.baseId) node.setSelected(true);
            });
          }
        }
      }, 300);
    });
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  onRowClicked(event: any): void {
    this.baseSelected.emit(event.data);
  }
}
