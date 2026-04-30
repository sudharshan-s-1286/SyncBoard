import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

import TeamManagement from './pages/TeamManagement';
import ProjectWorkspace from './pages/ProjectWorkspace';
import TaskBoard from './pages/TaskBoard';
import Settings from './pages/Settings';
import AllTasks from './pages/AllTasks';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import InvitationsPage from './pages/InvitationsPage';
import ForgotPassword from './pages/ForgotPassword';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
};

const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  return user ? <Navigate to="/dashboard" /> : children;
};

export default function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<PublicOnlyRoute><Landing /></PublicOnlyRoute>} />
      <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
      <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
      <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPassword /></PublicOnlyRoute>} />

      {/* Authenticated workspace */}
      <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/teams" element={<TeamManagement />} />
        <Route path="/projects" element={<ProjectWorkspace />} />
        <Route path="/projects/:projectId" element={<TaskBoard />} />
        <Route path="/tasks" element={<AllTasks />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/invitations" element={<InvitationsPage />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
