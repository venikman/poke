import { StrictMode, startTransition } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import ClientThemeProvider from './components/ClientThemeProvider';
import HomePage from './routes/home';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
]);

startTransition(() => {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    throw new Error('Missing #root element');
  }

  createRoot(rootElement).render(
    <StrictMode>
      <ClientThemeProvider>
        <RouterProvider router={router} />
      </ClientThemeProvider>
    </StrictMode>,
  );
});
