// start of frontend/src/main.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.tsx';
import { Toaster } from 'sonner'; // Add Sonner for notifications

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      {/* 
        Toaster is placed here to be globally available.
        Set richColors to true for styled success/error/info toasts.
        Set position to a preferred corner.
      */}
      <Toaster richColors position="top-center" />
    </AuthProvider>
  </React.StrictMode>
);
// end of frontend/src/main.tsx