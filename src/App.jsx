import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import OAuthCallback from './pages/OAuthCallback';   // ✅ ADD
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/"               element={<DashboardPage />} />
      <Route path="/dashboard"      element={<DashboardPage />} />
      <Route path="/login"          element={<AuthPage />} />
      <Route path="/oauth/callback" element={<OAuthCallback />} />  {/* ✅ ADD */}
      <Route path="/history"        element={
        <ProtectedRoute><div>History View</div></ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}