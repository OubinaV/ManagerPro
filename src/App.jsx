
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import OwnerDashboard from '@/pages/OwnerDashboard';
import DriverDashboard from '@/pages/DriverDashboard';
import ParticlesBackground from '@/components/ParticlesBackground';
import ProfilePage from '@/pages/ProfilePage';
import LoginPage from '@/pages/LoginPage';
import BillingPage from '@/pages/BillingPage';
import ExpensesPage from '@/pages/ExpensesPage';
import StatisticsPage from '@/pages/StatisticsPage';
import SettingsPage from '@/pages/SettingsPage';
import { Loader2 } from 'lucide-react';
import { NotificationProvider } from '@/contexts/NotificationContext';

const AppRouter = () => {
  const { profile } = useAuth();

  if (!profile) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          profile.user_type === 'owner' ? (
            <OwnerDashboard />
          ) : (
            <DriverDashboard />
          )
        }
      />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      {profile.user_type === 'driver' && <Route path="/billing" element={<BillingPage />} />}
      {profile.user_type === 'driver' && <Route path="/expenses" element={<ExpensesPage />} />}
      {profile.user_type === 'driver' && <Route path="/statistics" element={<StatisticsPage />} />}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <ParticlesBackground />
        <div className="relative z-10 flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-yellow-400 mb-4" />
          <p className="text-lg">Cargando aplicación...</p>
        </div>
      </div>
    );
  }

  return (
    <NotificationProvider>
      <ParticlesBackground />
      <Router>
        <Routes>
          <Route
            path="/login"
            element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />}
          />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <AppRouter />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </NotificationProvider>
  );
}

export default App;
