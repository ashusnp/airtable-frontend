# Airtable Integration Frontend

A modern Angular application for integrating with Airtable, allowing users to browse bases, tables, and tickets, and view detailed revision history with a beautiful UI.

## 🚀 Features

- **OAuth Authentication**: Secure login with Airtable OAuth
- **Revision Access Login**: Cookie-based authentication for viewing revision history
- **Base Management**: Browse and select Airtable bases (projects)
- **Table Management**: View and select tables within a base
- **Ticket Management**: Browse tickets with dynamic column generation
- **Revision History**: View detailed revision history for tickets with visual diff indicators
- **Data Sync**: Sync data from Airtable to the backend
- **Responsive UI**: Built with Angular Material and AG Grid Enterprise

## 🛠️ Tech Stack

- **Angular** 19.2.0
- **Angular Material** 19.2.19
- **AG Grid Enterprise** 34.2.0
- **RxJS** 7.8.0
- **TypeScript** 5.7.2

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API server running (default: `http://localhost:3000/api`)

## 🔧 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd AirTable-Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
   - Update `src/environments/environment.ts` with your backend API URL
   - Update AG Grid license key if needed (currently using trial key)

## 🏃 Development

Start the development server:

```bash
ng serve
# or
npm start
```

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## 📁 Project Structure

```
src/
├── app/
│   ├── pages/
│   │   ├── login/                    # OAuth login page
│   │   ├── dashboard/                 # Main dashboard
│   │   ├── baseList/                  # Bases list component
│   │   ├── tableList/                 # Tables list component
│   │   ├── ticketList/                # Tickets list component
│   │   │   └── details/               # Ticket detail dialog
│   │   ├── airTableLogin/             # Revision access login
│   │   └── revisionLoginDialog/       # Revision login dialog
│   ├── services/
│   │   ├── api.service.ts            # Airtable API service
│   │   └── auth.service.ts           # Authentication service
│   ├── guards/
│   │   └── auth.guard.ts             # Route guards
│   └── interceptors/
│       └── auth.interceptor.ts       # HTTP interceptors
└── environments/
    └── environment.ts                 # Environment configuration
```

## 🔑 Key Features Explained

### Authentication Flow
1. **OAuth Login**: Users authenticate via Airtable OAuth on the login page
2. **Revision Access**: Separate cookie-based login for accessing revision history

### Dashboard Features
- **Base Selection**: Select an Airtable base to work with
- **Table Selection**: Select a table within the selected base
- **Ticket Viewing**: View tickets in the selected table with dynamic columns
- **Revision History**: Click on a ticket to view its revision history

### Revision History
- Visual diff indicators (add/remove icons)
- Color-coded changes (green for additions, red for removals)
- Detailed change tracking with timestamps and authors

## 🏗️ Building

Build the project for production:

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## 🧪 Testing

Run unit tests:

```bash
ng test
```

## 📡 API Endpoints

The application communicates with the following backend endpoints:

- `GET /api/airtable/bases` - Get list of bases
- `GET /api/airtable/tables/:baseId` - Get tables for a base
- `GET /api/airtable/tickets/:baseId/:tableId` - Get tickets with pagination
- `GET /api/revision/:recordId` - Get revision history for a record
- `POST /api/airtable/sync` - Sync data from Airtable
- `POST /api/airtable/login-with-mfa` - Login with MFA
- `POST /api/airtable/login-with-mfa-verify` - Verify MFA code
- `POST /api/airtable/logout` - Logout
- `POST /api/airtable/logout-revision-access` - Logout revision access

## 🔐 Environment Configuration

Update `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  API_BASE_URL: 'http://localhost:3000/api', // Your backend URL
  agGridLicenseKey: 'your-license-key' // AG Grid Enterprise license
};
```

## 📝 Code Generation

Generate new components:

```bash
ng generate component component-name
```

For a complete list of available schematics, run:

```bash
ng generate --help
```

## 🎨 UI Components

- **AG Grid Enterprise**: For data tables with sorting, filtering, and pagination
- **Angular Material**: For UI components (buttons, dialogs, tabs, etc.)
- **Responsive Design**: Mobile-friendly layout

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your backend has CORS configured to allow requests from `http://localhost:4200`
2. **Authentication Issues**: Check that cookies are being set correctly (requires `withCredentials: true`)
3. **AG Grid License**: If using AG Grid Enterprise features, ensure a valid license key is configured

## 📚 Additional Resources

- [Angular Documentation](https://angular.dev)
- [Angular Material](https://material.angular.io)
- [AG Grid Documentation](https://www.ag-grid.com)
- [Angular CLI Overview](https://angular.dev/tools/cli)

## 📄 License

This project uses AG Grid Enterprise (trial license). For production use, ensure you have a valid AG Grid Enterprise license.

---

Built with ❤️ using Angular
