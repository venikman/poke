import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import ClientThemeProvider from './components/ClientThemeProvider';
import UserDashboardContent from './components/UserDashboardContent';

export default function Root() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
        <title>User Dashboard</title>
      </head>
      <body>
        <ClientThemeProvider>
          <Outlet />
        </ClientThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function HydrateFallback() {
  return (
    <>
      <ClientThemeProvider>
        <UserDashboardContent />
      </ClientThemeProvider>
      <Scripts />
    </>
  );
}
