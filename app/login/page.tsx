'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginB2B, getB2BProfile } from '@/lib/api';
import { setAuthSession } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await loginB2B({ email, password });
      
      const token =
        response.access_token ||
        response.token ||
        response.data?.access_token ||
        response.data?.token;

      if (!token) {
        throw new Error('No access token returned from server.');
      }

      let user = response.user || response.data?.user || null;

      // If user profile not included in login response, attempt to fetch /auth/me
      if (!user) {
        try {
          user = await getB2BProfile(token);
        } catch {
          // If /auth/me fails or is optional, proceed with default user data
          user = {
            email: email.trim(),
            name: email.split('@')[0],
          };
        }
      }

      // Store auth session
      setAuthSession(token, user);

      // Redirect to dashboard
      router.push('/');
      router.refresh();
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err?.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-color)',
        padding: '20px',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '36px 32px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
          borderRadius: '16px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            className="brand-mark"
            style={{
              width: '52px',
              height: '52px',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--primary)',
              color: 'white',
              borderRadius: '14px',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ width: '30px', height: '30px' }}
            >
              <path d="M4 13c4-8 12-9 16-7-1 7-5 12-12 13-2-1-3-3-4-6Z" />
              <path d="M8 16c2-4 5-7 10-9" />
            </svg>
          </div>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: 'var(--text-color)',
              marginBottom: '6px',
              letterSpacing: '-0.02em',
            }}
          >
            eFresh B2B Portal
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0 }}>
            Sign in with your B2B account credentials
          </p>
        </div>

        <form onSubmit={handleLogin}>
          {error && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#dc2626',
                padding: '12px 14px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                lineHeight: 1.4,
              }}
            >
              <svg
                style={{ width: '18px', height: '18px', flexShrink: 0, marginTop: '1px' }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div style={{ marginBottom: '18px' }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '6px',
                color: 'var(--text-color)',
              }}
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="field-inline search-inline"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '14px',
              }}
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '6px',
              }}
            >
              <label
                htmlFor="password"
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-color)',
                }}
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--muted)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="field-inline search-inline"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '14px',
              }}
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '15px',
              fontWeight: 600,
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.75 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {loading ? (
              <>
                <svg
                  style={{
                    width: '18px',
                    height: '18px',
                    animation: 'spin 1s linear infinite',
                  }}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
                <span>Signing In...</span>
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
