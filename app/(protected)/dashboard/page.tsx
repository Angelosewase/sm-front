'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { useAuth } from '@/contexts/auth-context';
import { LogOut, User, Shield, Key, Lock } from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <nav className="border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name || user?.email}!</h2>
              <p className="text-muted-foreground">
                This is a protected route secured by Next.js middleware and httpOnly cookies.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-2">User ID</h3>
                <p className="text-sm text-muted-foreground break-all">{user?.id}</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-2">Status</h3>
                <p className="text-sm text-green-500 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Authenticated
                </p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Security Features (Production-Ready)
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Key className="w-4 h-4 mt-0.5 text-green-500" />
                  <div>
                    <strong className="text-foreground">HttpOnly Cookies:</strong> JWT tokens stored in httpOnly cookies, inaccessible to JavaScript (XSS protection)
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Key className="w-4 h-4 mt-0.5 text-green-500" />
                  <div>
                    <strong className="text-foreground">Next.js Middleware:</strong> Server-side route protection before page loads
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Key className="w-4 h-4 mt-0.5 text-green-500" />
                  <div>
                    <strong className="text-foreground">Secure Cookies:</strong> SameSite=Lax, Secure flag in production
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Key className="w-4 h-4 mt-0.5 text-green-500" />
                  <div>
                    <strong className="text-foreground">Server Actions:</strong> Cookie management via Next.js server actions
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Key className="w-4 h-4 mt-0.5 text-green-500" />
                  <div>
                    <strong className="text-foreground">Automatic Redirects:</strong> Middleware handles auth state changes
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Key className="w-4 h-4 mt-0.5 text-green-500" />
                  <div>
                    <strong className="text-foreground">Password Reset Flow:</strong> OTP-based reset with 15-minute expiration
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-lg p-6">
              <h3 className="font-semibold mb-2 text-violet-400">🎉 Production Ready</h3>
              <p className="text-sm text-muted-foreground">
                This authentication system follows security best practices with httpOnly cookies, 
                Next.js middleware for server-side protection, and proper cookie management.
              </p>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
