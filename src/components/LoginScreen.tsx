// ============================================================
// LOGIN SCREEN
// The page shown when the user is signed out.
// Any email and password works — this is a demo (no real auth).
// Clicking "Log In" calls the login() function from the auth context.
// ============================================================

import { useState } from 'react';
import { Briefcase, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function LoginScreen() {
  // Get the login function from the auth context.
  const { login } = useAuth();

  // Form input state.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Called when the user clicks "Log In".
  function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    login(email);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-100">
      {/* Login card */}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-md">
          {/* Logo + title */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-blue-600 flex items-center justify-center mb-4">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">WorkSphere</h1>
            <p className="text-slate-500 mt-2 text-center">
              Sign in to your workspace to continue
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Remember me + forgot password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300" />
                Remember me
              </label>
              <span className="text-blue-600 hover:text-blue-700 cursor-pointer transition-colors">
                Forgot password?
              </span>
            </div>

            {/* Log In button */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
            >
              Log In
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Demo hint */}
          <p className="text-center text-slate-400 text-sm mt-6">
            Demo mode — just click "Log In" to enter the workspace
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
