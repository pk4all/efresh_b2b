'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  getB2BAccount,
  getB2BAccountUsers,
  createB2BAccountUser,
  AccountDetail,
  AccountUser,
  CreateAccountUserPayload,
} from '@/lib/api';

export default function AccountPage() {
  const [account, setAccount] = useState<AccountDetail | null>(null);
  const [loadingAccount, setLoadingAccount] = useState<boolean>(true);
  const [accountError, setAccountError] = useState<string | null>(null);

  const [users, setUsers] = useState<AccountUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [usersError, setUsersError] = useState<string | null>(null);

  // Invite / Add user modal state
  const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);
  const [submittingUser, setSubmittingUser] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalSuccess, setModalSuccess] = useState<string | null>(null);

  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    role: 'Buyer',
    location: 'All',
    ordering: 'Full',
    invoices: 'View',
    receiving: 'View',
  });

  // Currency formatter
  const formatCurrency = (val?: number | null) => {
    if (val === undefined || val === null || isNaN(val)) return '$0.00';
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 2,
    }).format(val);
  };

  // Status badge class
  const getPermissionBadge = (perm?: string) => {
    const p = (perm || '').toLowerCase();
    if (p === 'full') {
      return <span style={{ fontWeight: 600, color: 'var(--ink)' }}>Full</span>;
    }
    if (p === 'view') {
      return <span style={{ color: 'var(--muted2)' }}>View</span>;
    }
    if (p === 'none' || p === 'no') {
      return <span style={{ color: 'var(--muted)', opacity: 0.6 }}>None</span>;
    }
    return <span>{perm || '—'}</span>;
  };

  const getUserStatusBadge = (status?: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('active')) {
      return <span className="status complete">Active</span>;
    }
    if (s.includes('invite') || s.includes('pend')) {
      return <span className="status pending">{status || 'Invited'}</span>;
    }
    if (s.includes('inactive') || s.includes('disable')) {
      return <span className="status s-grey">Inactive</span>;
    }
    return <span className="status complete">{status || 'Active'}</span>;
  };

  // Fetch account profile & settings
  const fetchAccount = useCallback(async () => {
    try {
      setLoadingAccount(true);
      setAccountError(null);
      const res: any = await getB2BAccount();
      const data = res?.data || res;
      if (data && (data.id || data.businessName || data.primaryContact)) {
        setAccount(data);
      } else {
        setAccount(null);
      }
    } catch (err: any) {
      console.error('Failed to load account settings:', err);
      setAccountError(err.message || 'Failed to fetch account profile.');
      setAccount(null);
    } finally {
      setLoadingAccount(false);
    }
  }, []);

  // Fetch account users
  const fetchUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      setUsersError(null);
      const res: any = await getB2BAccountUsers();
      let list: AccountUser[] = [];
      if (Array.isArray(res)) {
        list = res;
      } else if (Array.isArray(res?.data)) {
        list = res.data;
      } else if (Array.isArray(res?.users)) {
        list = res.users;
      }
      setUsers(list);
    } catch (err: any) {
      console.error('Failed to load account users:', err);
      setUsersError(err.message || 'Failed to fetch account users.');
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    fetchAccount();
    fetchUsers();
  }, [fetchAccount, fetchUsers]);

  // Handle Role selection preset permissions
  const handleRoleChange = (role: string) => {
    if (role === 'Buyer') {
      setNewUserForm((prev) => ({
        ...prev,
        role,
        location: 'All',
        ordering: 'Full',
        invoices: 'View',
        receiving: 'View',
      }));
    } else if (role === 'Receiver') {
      setNewUserForm((prev) => ({
        ...prev,
        role,
        location: 'Brunswick',
        ordering: 'View',
        invoices: 'None',
        receiving: 'Full',
      }));
    } else if (role === 'Accounts') {
      setNewUserForm((prev) => ({
        ...prev,
        role,
        location: 'All',
        ordering: 'View',
        invoices: 'Full',
        receiving: 'View',
      }));
    } else if (role === 'Admin') {
      setNewUserForm((prev) => ({
        ...prev,
        role,
        location: 'All',
        ordering: 'Full',
        invoices: 'Full',
        receiving: 'Full',
      }));
    } else {
      setNewUserForm((prev) => ({
        ...prev,
        role,
        location: 'All',
        ordering: 'View',
        invoices: 'View',
        receiving: 'View',
      }));
    }
  };

  // Submit invite user
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name.trim() || !newUserForm.email.trim()) {
      setModalError('Please enter both name and email.');
      return;
    }

    try {
      setSubmittingUser(true);
      setModalError(null);
      setModalSuccess(null);

      const payload: CreateAccountUserPayload = {
        name: newUserForm.name.trim(),
        email: newUserForm.email.trim(),
        role: newUserForm.role,
        permissions: {
          location: newUserForm.location,
          ordering: newUserForm.ordering,
          invoices: newUserForm.invoices,
          receiving: newUserForm.receiving,
        },
      };

      const res = await createB2BAccountUser(payload);
      setModalSuccess(`Invitation successfully sent to ${newUserForm.email}!`);

      setTimeout(() => {
        setShowAddUserModal(false);
        setModalSuccess(null);
        setNewUserForm({
          name: '',
          email: '',
          role: 'Buyer',
          location: 'All',
          ordering: 'Full',
          invoices: 'View',
          receiving: 'View',
        });
        fetchUsers();
      }, 1400);
    } catch (err: any) {
      console.error('Failed to create account user:', err);
      setModalError(err.message || 'Failed to send invitation.');
    } finally {
      setSubmittingUser(false);
    }
  };

  // Credit computations
  const creditLimit = account?.creditLimit ?? 0;
  const creditUsed = account?.creditUsed ?? 0;
  const availableCredit = account?.availableCredit ?? Math.max(0, creditLimit - creditUsed);
  const creditPercent = creditLimit > 0 ? Math.min(100, Math.round((creditUsed / creditLimit) * 100)) : 0;

  const locations = account?.locations || [];

  return (
    <div className="page active" id="account">
      <div className="page-head">
        <div className="title-wrap">
          <h1>Account &amp; Users</h1>
          <p>Business profile, credit terms, delivery locations and user permissions.</p>
        </div>
        <div className="head-actions">
          <button className="btn btn-primary" onClick={() => setShowAddUserModal(true)}>
            + Add User
          </button>
        </div>
      </div>

      <div className="detail-grid">
        <div>
          {/* Business Account Details */}
          <div className="card">
            <div className="card-head">
              <div>
                <h2>Business Account</h2>
                <p>{account?.id || (loadingAccount ? 'Loading...' : 'B2B Account')}</p>
              </div>
              {account?.status && (
                <span className="status complete">{account.status}</span>
              )}
            </div>

            {loadingAccount ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--muted)' }}>
                Loading business account details...
              </div>
            ) : accountError ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--red)' }}>
                <p>{accountError}</p>
                <button className="btn btn-sm" onClick={fetchAccount} style={{ marginTop: '8px' }}>
                  Retry
                </button>
              </div>
            ) : (
              <div className="info-list">
                <div className="info-item">
                  <label>Business Name</label>
                  <b>{account?.businessName || '—'}</b>
                </div>
                <div className="info-item">
                  <label>ABN</label>
                  <b>{account?.abn || '—'}</b>
                </div>
                <div className="info-item">
                  <label>Primary Contact</label>
                  <b>{account?.primaryContact || '—'}</b>
                </div>
                <div className="info-item">
                  <label>Accounts Email</label>
                  <b>{account?.accountsEmail || '—'}</b>
                </div>
                <div className="info-item">
                  <label>Payment Terms</label>
                  <b>{account?.paymentTerms || '—'}</b>
                </div>
                <div className="info-item">
                  <label>Credit Limit</label>
                  <b>{formatCurrency(account?.creditLimit)}</b>
                </div>
              </div>
            )}
          </div>

          {/* Users & Permissions Section */}
          <div className="section-head" style={{ marginTop: '20px', marginBottom: '10px' }}>
            <h2>Users &amp; Permissions</h2>
            <small>Every order and receipt records the acting user</small>
          </div>

          <div className="card table-wrap">
            {loadingUsers ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--muted)' }}>
                Loading account users...
              </div>
            ) : usersError ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--red)' }}>
                <p>{usersError}</p>
                <button className="btn btn-sm" onClick={fetchUsers} style={{ marginTop: '8px' }}>
                  Retry
                </button>
              </div>
            ) : users.length === 0 ? (
              <div style={{ padding: '36px', textAlign: 'center', color: 'var(--muted)' }}>
                <p style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>No users found</p>
                <p style={{ fontSize: '11px' }}>Invite team members to access this portal.</p>
              </div>
            ) : (
              <table className="table" style={{ minWidth: '780px' }}>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Location</th>
                    <th>Ordering</th>
                    <th>Invoices</th>
                    <th>Receiving</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id || user.email}>
                      <td className="primary-cell">
                        {user.name}
                        <span className="subtext">{user.email}</span>
                      </td>
                      <td>{user.role || 'Member'}</td>
                      <td>{user.permissions?.location || 'All'}</td>
                      <td>{getPermissionBadge(user.permissions?.ordering)}</td>
                      <td>{getPermissionBadge(user.permissions?.invoices)}</td>
                      <td>{getPermissionBadge(user.permissions?.receiving)}</td>
                      <td>{getUserStatusBadge(user.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Aside Column */}
        <aside>
          {/* Credit & Terms */}
          <div className="card">
            <div className="card-head">
              <h2>Credit &amp; Terms</h2>
            </div>
            <div className="card-body">
              <div style={{ fontSize: '9.5px', color: 'var(--muted)' }}>Credit used</div>
              <div style={{ fontSize: '22px', fontWeight: 760, marginTop: '3px' }}>
                {formatCurrency(creditUsed)} / {formatCurrency(creditLimit)}
              </div>
              <div className="credit-meter">
                <span style={{ width: `${creditPercent}%` }}></span>
              </div>
              <div className="info-list" style={{ gridTemplateColumns: '1fr', marginTop: '10px' }}>
                <div className="info-item">
                  <label>Available Credit</label>
                  <b>{formatCurrency(availableCredit)}</b>
                </div>
                <div className="info-item">
                  <label>Payment Terms</label>
                  <b>{account?.paymentTerms || '—'}</b>
                </div>
                <div className="info-item">
                  <label>Pricing Group</label>
                  <b>{account?.pricingGroup || 'Wholesale'}</b>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Locations */}
          <div className="card" style={{ marginTop: '14px' }}>
            <div className="card-head">
              <h2>Delivery Locations</h2>
            </div>
            <div className="info-list" style={{ gridTemplateColumns: '1fr' }}>
              {locations.length === 0 ? (
                <div style={{ padding: '16px', color: 'var(--muted)', fontSize: '12px' }}>
                  {loadingAccount ? 'Loading locations...' : 'No delivery locations listed.'}
                </div>
              ) : (
                locations.map((loc, idx) => (
                  <div className="info-item" key={loc.id || idx}>
                    <label>{loc.type || (idx === 0 ? 'Primary' : 'Secondary')}</label>
                    <b>{loc.name}</b>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px',
          }}
          onClick={() => !submittingUser && setShowAddUserModal(false)}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: '#fff',
              borderRadius: '8px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-head" style={{ borderBottom: '1px solid #eef2f6' }}>
              <div>
                <h2>Invite New User</h2>
                <p>Add a team member to your B2B account</p>
              </div>
              <button
                className="btn btn-sm"
                onClick={() => setShowAddUserModal(false)}
                disabled={submittingUser}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddUser} style={{ padding: '20px' }}>
              {modalError && (
                <div style={{ color: 'var(--red)', marginBottom: '14px', fontSize: '13px' }}>
                  {modalError}
                </div>
              )}
              {modalSuccess && (
                <div style={{ color: 'var(--green)', marginBottom: '14px', fontSize: '13px' }}>
                  {modalSuccess}
                </div>
              )}

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  className="field-inline"
                  style={{ width: '100%' }}
                  placeholder="e.g. John Doe"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  className="field-inline"
                  style={{ width: '100%' }}
                  placeholder="e.g. john.doe@example.com"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  required
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  Role *
                </label>
                <select
                  className="field-inline"
                  style={{ width: '100%' }}
                  value={newUserForm.role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                >
                  <option value="Buyer">Buyer (Ordering, Viewing Invoices &amp; Receipts)</option>
                  <option value="Receiver">Receiver (Receiving &amp; Claims)</option>
                  <option value="Accounts">Accounts (Invoices &amp; Billing)</option>
                  <option value="Admin">Admin (Full Access)</option>
                  <option value="Viewer">Viewer (Read-Only)</option>
                </select>
              </div>

              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '12px',
                  marginBottom: '18px',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Assigned Permissions
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                  <div><strong>Location:</strong> {newUserForm.location}</div>
                  <div><strong>Ordering:</strong> {newUserForm.ordering}</div>
                  <div><strong>Invoices:</strong> {newUserForm.invoices}</div>
                  <div><strong>Receiving:</strong> {newUserForm.receiving}</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowAddUserModal(false)}
                  disabled={submittingUser}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submittingUser}
                >
                  {submittingUser ? 'Sending Invite...' : 'Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
