/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldAlert, Sparkles } from 'lucide-react';
import { DEMO_CREDENTIALS } from '../constants';

interface LoginPageProps {
  onLogin: (email: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic form validation
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    // Simulate a brief loading transition for sleek UX
    setTimeout(() => {
      // Check against hardcoded credentials in constants.ts
      if (
        email.toLowerCase() === DEMO_CREDENTIALS.email.toLowerCase() &&
        password === DEMO_CREDENTIALS.password
      ) {
        onLogin(email.toLowerCase());
      } else {
        setError('Invalid email or password. Please try again.');
        setIsLoading(false);
      }
    }, 600);
  };

  const handleFillDemoCredentials = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setError(null);
  };

  return (
    <div id="login-container" className="min-h-screen flex items-center justify-center bg-[#080808] px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md space-y-8 bg-white/5 p-8 rounded-2xl shadow-2xl border border-white/10 transition-all duration-300">
        
        {/* Logo / Header Section */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-900/50 mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 id="login-title" className="text-3xl font-bold tracking-tight text-white font-display">
            Empower
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Professional Employee Management Hub
          </p>
        </div>

        {/* Form Section */}
        <form id="login-form" onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div id="login-error" className="flex items-start gap-3 p-4 bg-rose-950/40 text-rose-300 text-sm rounded-xl border border-rose-500/30 animate-fadeIn">
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
              <div>
                <p className="font-semibold">Login Failed</p>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
                  placeholder="admin@empower.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  id="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              id="login-submit-button"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-lg shadow-indigo-950/50 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Verifying Credentials...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

        {/* Demo Assistant Helper Tooltip */}
        <div id="demo-credentials-help" className="pt-4 border-t border-white/10 text-center">
          <p className="text-xs text-gray-400">
            Testing out Empower? Use the demo account:
          </p>
          <div className="mt-2 inline-flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-lg text-xs">
            <span className="font-mono text-gray-300">admin@empower.com</span>
            <span className="text-gray-500">|</span>
            <span className="font-mono text-gray-300">admin123</span>
          </div>
          <button
            type="button"
            id="fill-demo-credentials"
            onClick={handleFillDemoCredentials}
            className="block w-full mt-3 text-xs text-indigo-400 hover:text-indigo-300 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 rounded-md"
          >
            Auto-fill demo credentials
          </button>
        </div>
      </div>
    </div>
  );
}
