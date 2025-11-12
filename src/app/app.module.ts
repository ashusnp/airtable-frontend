import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AgGridModule } from 'ag-grid-angular';

import { routes } from './app.routes';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BasesListComponent } from './pages/baseList/bases-list.component';
import { TablesListComponent } from './pages/tableList/tables-list.component';
import { TicketsListComponent } from './pages/ticketList/tickets-list.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    BasesListComponent,
    TablesListComponent,
    TicketsListComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    routes,
    MatTabsModule,
    MatButtonModule,
    MatSnackBarModule,
    AgGridModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
