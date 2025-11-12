
import { ModuleRegistry } from 'ag-grid-community';
import { AllCommunityModule } from 'ag-grid-community';
import { ServerSideRowModelModule, SideBarModule, MenuModule, ColumnsToolPanelModule } from 'ag-grid-enterprise';

// ✅ Register before Angular bootstraps
ModuleRegistry.registerModules([
  AllCommunityModule,
  ServerSideRowModelModule,
  SideBarModule,
  MenuModule,
  ColumnsToolPanelModule
]);
import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { authInterceptor } from './app/interceptors/auth.interceptor';
import { LicenseManager } from 'ag-grid-enterprise';
import { environment } from './environments/environment';

LicenseManager.setLicenseKey(environment.agGridLicenseKey);

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(BrowserAnimationsModule),
    provideAnimations(),
  ],
}).catch(err => console.error(err));
