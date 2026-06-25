/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import { AuthState } from './types';

export default function App() {
  // ==========================================
  // AUTHENTICATION SESSION STATE
  // ==========================================
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    userEmail: null,
    loginTime: null,
  });

  const [isInitializing, setIsInitializing] = useState(true);

  // ==========================================
  // SESSION PERSISTENCE (READ ON START)
  // ==========================================
  useEffect(() => {
    /* 
       Auth flow compliance check: 
       When the page loads, immediately inspect localStorage 
       to see if there is an active session so the user is not 
       logged out upon hard page refreshes.
    */
    const storedSession = localStorage.getItem('empower_auth_session');
    if (storedSession) {
      try {
        const parsedSession: AuthState = JSON.parse(storedSession);
        if (parsedSession.isAuthenticated && parsedSession.userEmail) {
          setAuth(parsedSession);
        }
      } catch (e) {
        console.error('Failed to restore authentication session', e);
        // Clean corrupt sessions automatically
        localStorage.removeItem('empower_auth_session');
      }
    }
    setIsInitializing(false);
  }, []);

  // ==========================================
  // AUTH ACTION: LOGIN
  // ==========================================
  const handleLogin = (email: string) => {
    const session: AuthState = {
      isAuthenticated: true,
      userEmail: email,
      loginTime: new Date().toISOString(),
    };
    
    // Save state to localStorage to survive page refreshes
    localStorage.setItem('empower_auth_session', JSON.stringify(session));
    setAuth(session);
  };

  // ==========================================
  // AUTH ACTION: LOGOUT
  // ==========================================
  const handleLogout = () => {
    // Clear auth state from localStorage and reset component state
    localStorage.removeItem('empower_auth_session');
    setAuth({
      isAuthenticated: false,
      userEmail: null,
      loginTime: null,
    });
  };

  // Prevent flash of login screen during initialization
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm font-semibold text-slate-500 font-sans">Restoring Secure Session...</span>
        </div>
      </div>
    );
  }

  // ==========================================
  // CONDITIONAL VIEW ROUTER
  // ==========================================
  if (!auth.isAuthenticated) {
    // Unauthenticated -> Gate behind LoginPage
    return <LoginPage onLogin={handleLogin} />;
  }

  // Authenticated -> Display main employee workspace
  return (
    <Dashboard
      userEmail={auth.userEmail || ''}
      onLogout={handleLogout}
    />
  );
}
