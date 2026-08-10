'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@efresh.example');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@efresh.example' && password === 'password123') {
      // Set dummy cookie
      document.cookie = "auth-token=dummy-token; path=/; max-age=86400";
      router.push('/');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-color)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '30px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div className="brand-mark" style={{ width: '48px', height: '48px', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '12px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '28px', height: '28px' }}>
              <path d="M4 13c4-8 12-9 16-7-1 7-5 12-12 13-2-1-3-3-4-6Z" />
              <path d="M8 16c2-4 5-7 10-9" />
            </svg>
          </div>
          <h1 style={{ fontSize: '24px', color: 'var(--text-color)', marginBottom: '8px' }}>eFresh B2B Portal</h1>
          <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin}>
          {error && (
            <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px' }}>
              {error}
            </div>
          )}
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field-inline search-inline" 
              style={{ width: '100%', boxSizing: 'border-box' }}
              required 
            />
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field-inline search-inline" 
              style={{ width: '100%', boxSizing: 'border-box' }}
              required 
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '15px' }}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
