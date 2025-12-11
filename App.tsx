import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ChaletDetails from './pages/ChaletDetails';
import BecomeHost from './pages/BecomeHost';
import ChaletsPage from './pages/Chalets'; // Import the new page
import { AuthModal } from './components/Auth';
import AIChatbot from './components/AIChatbot';
import { User, UserRole } from './types';
import { dataService } from './services/dataService';
import { AppProvider } from './contexts/AppContext';

const AppContent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Load auth from local storage on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedUserId = localStorage.getItem('reva_user_id');
      if (storedUserId) {
        const foundUser = await dataService.getUserById(storedUserId);
        if (foundUser) setUser(foundUser);
      }
    };
    checkAuth();
  }, []);

  const handleLoginSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    localStorage.setItem('reva_user_id', authenticatedUser.id);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('reva_user_id');
  };

  return (
    <Router>
      <Layout 
        user={user} 
        onLogout={handleLogout} 
        onLoginClick={() => setIsAuthOpen(true)}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chalets" element={<ChaletsPage />} />
          <Route path="/chalets/:id" element={<ChaletDetails />} />
          <Route path="/become-host" element={<BecomeHost />} />
          <Route 
            path="/dashboard" 
            element={
              user && (user.role === UserRole.ADMIN || user.role === UserRole.OWNER) 
                ? <Dashboard user={user} /> 
                : <Navigate to="/" />
            } 
          />
        </Routes>

        <AuthModal 
          isOpen={isAuthOpen} 
          onClose={() => setIsAuthOpen(false)} 
          onLoginSuccess={handleLoginSuccess} 
        />
        
        <AIChatbot />
      </Layout>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;