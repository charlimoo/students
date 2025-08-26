// start of frontend/src/components/ProtectedRoute.tsx
import React, { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { LoginPage } from './LoginPage'; // Adjust path if needed
import { RefreshCw } from 'lucide-react';

// Define the type for the props that LoginPage expects
interface LoginPageProps {
  onNavigate: (page: string) => void;
  onSignUp: () => void;
  onInstitutionSignUp: () => void;
  onStaffSignUp: () => void;
}

interface ProtectedRouteProps {
  children: ReactNode;
  loginPageProps: LoginPageProps;
}

export const ProtectedRoute = ({ children, loginPageProps }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show a loading indicator while the AuthContext is verifying the token on initial app load.
  // This prevents a brief flash of the login page before redirecting to the dashboard.
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Verifying session...</p>
        </div>
      </div>
    );
  }

  // If loading is finished and the user is not authenticated, render the LoginPage.
  if (!isAuthenticated) {
    // Pass all necessary props down to the LoginPage component
    return <LoginPage {...loginPageProps} />;
  }

  // If loading is finished and the user is authenticated, render the protected content.
  return <>{children}</>;
};
// end of frontend/src/components/ProtectedRoute.tsx