import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { ProjectDetails } from './pages/ProjectDetails';
import { Clients } from './pages/Clients';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Tools } from './pages/Tools';
import { ToolWorkspace } from './pages/ToolWorkspace';
import { Templates } from './pages/Templates';
import { AdminDashboard } from './pages/AdminDashboard';
import { MagicBox } from './pages/MagicBox';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { LoadingScreen } from './components/LoadingScreen';
import { User } from './types';
import { supabaseService } from './services/supabaseService';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  user: User | null;
}

const ProtectedRoute = ({ children, user }: ProtectedRouteProps) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  // START with null user to enforce login wall
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on load
    const session = supabaseService.auth.getSession();
    if (session) {
      setUser(session);
    }
    // Simulate a minimum load time for smooth UX
    setTimeout(() => {
        setLoading(false);
    }, 800);
  }, []);

  const handleLogin = () => {
    const session = supabaseService.auth.getSession();
    setUser(session);
  };

  const handleLogout = () => {
    supabaseService.auth.signOut();
    setUser(null);
  };

  const handleUpdateUser = (updatedUser: Partial<User>) => {
      if (user) {
          setUser({ ...user, ...updatedUser });
      }
  };

  if (loading) return <LoadingScreen />;

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register onLogin={handleLogin} /> : <Navigate to="/" />} />

        {/* Protected Routes - Locked behind login */}
        <Route path="/" element={<ProtectedRoute user={user}><Layout user={user} onLogout={handleLogout}><Dashboard /></Layout></ProtectedRoute>} />
        
        <Route path="/magicbox" element={<ProtectedRoute user={user}><Layout user={user} onLogout={handleLogout}><MagicBox /></Layout></ProtectedRoute>} />
        <Route path="/tools" element={<ProtectedRoute user={user}><Layout user={user} onLogout={handleLogout}><Tools /></Layout></ProtectedRoute>} />
        <Route path="/tools/:id" element={<ProtectedRoute user={user}><Layout user={user} onLogout={handleLogout}><ToolWorkspace /></Layout></ProtectedRoute>} />
        
        <Route path="/templates" element={<ProtectedRoute user={user}><Layout user={user} onLogout={handleLogout}><Templates /></Layout></ProtectedRoute>} />
        
        <Route path="/projects" element={<ProtectedRoute user={user}><Layout user={user} onLogout={handleLogout}><Projects /></Layout></ProtectedRoute>} />
        <Route path="/projects/:id" element={<ProtectedRoute user={user}><Layout user={user} onLogout={handleLogout}><ProjectDetails /></Layout></ProtectedRoute>} />
        
        <Route path="/clients" element={<ProtectedRoute user={user}><Layout user={user} onLogout={handleLogout}><Clients /></Layout></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute user={user}><Layout user={user} onLogout={handleLogout}><Reports /></Layout></ProtectedRoute>} />
        
        <Route path="/settings" element={<ProtectedRoute user={user}><Layout user={user} onLogout={handleLogout}><Settings user={user} onUserUpdate={handleUpdateUser} /></Layout></ProtectedRoute>} />
        
        {/* Admin Route */}
        <Route path="/admin" element={
            <ProtectedRoute user={user}>
                {user?.role === 'admin' 
                ? <Layout user={user} onLogout={handleLogout}><AdminDashboard /></Layout> 
                : <Navigate to="/" />}
            </ProtectedRoute>
        } />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;