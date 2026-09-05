'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  getDashboardSummary,
  getAccountsSnapshot,
  getRecentActivity,
} from '@/lib/api';
import {
  DashboardSummaryResponse,
  AccountsSnapshotResponse,
  RecentActivityResponse,
  RecentOrder,
  UpcomingDelivery,
  B2BUser,
} from '@/types';
import { getStoredUser } from '@/lib/auth';

function formatCurrency(amount?: number | string | null): string {
  if (amount === undefined || amount === null || isNaN(Number(amount))) return '$0.00';
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function getStatusClass(status?: string): string {
  if (!status) return 'status alloc';
  const s = status.toLowerCase();
  if (s.includes('confirm') || s.includes('alloc') || s.includes('new') || s.includes('open')) {
    return 'status alloc';
  }
  if (s.includes('transit') || s.includes('deliver') || s.includes('shipping')) {
    return 'status delivery';
  }
  if (s.includes('complet') || s.includes('paid') || s.includes('received') || s.includes('success')) {
    return 'status complete';
  }
  if (s.includes('pack') || s.includes('process')) {
    return 'status packing';
  }
  if (s.includes('pend') || s.includes('await') || s.includes('hold')) {
    return 'status pending';
  }
  if (s.includes('overdue') || s.includes('cancel') || s.includes('reject')) {
    return 'status red';
  }
  return 'status alloc';
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [accounts, setAccounts] = useState<AccountsSnapshotResponse | null>(null);
  const [activity, setActivity] = useState<RecentActivityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<B2BUser | null>(null);
  const hasLoadedRef = useRef(false);

  const loadDashboardData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const storedUser = getStoredUser();
      if (storedUser) {
        setUser(storedUser);
      }

      const [summaryRes, accountsRes, activityRes] = await Promise.allSettled([
        getDashboardSummary(),
        getAccountsSnapshot(),
        getRecentActivity(),
      ]);

      if (summaryRes.status === 'fulfilled') {
        setSummary(summaryRes.value);
      } else {
        console.warn('Dashboard summary error:', summaryRes.reason);
        setSummary(null);
      }

      if (accountsRes.status === 'fulfilled') {
        setAccounts(accountsRes.value);
      } else {
        console.warn('Accounts snapshot error:', accountsRes.reason);
        setAccounts(null);
      }

      if (activityRes.status === 'fulfilled') {
        setActivity(activityRes.value);
      } else {
        console.warn('Recent activity error:', activityRes.reason);
        setActivity(null);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    loadDashboardData();
  }, [loadDashboardData]);

  const metrics = summary?.metrics || summary?.data?.metrics || null;
  const recentOrders: RecentOrder[] = activity?.recentOrders || activity?.data?.recentOrders || [];
  const upcomingDeliveries: UpcomingDelivery[] = activity?.upcomingDeliveries || activity?.data?.upcomingDeliveries || [];

  const accountDisplayName = user?.accountName || user?.name || 'your account';

  return (
    <div className="page active" id="dashboard">
      {/* Page Header */}
      <div className="page-head">
        <div className="title-wrap">
          <h1>Dashboard</h1>
          <p>Customer purchasing, accounts and delivery overview for {accountDisplayName}.</p>
        </div>
        <div className="head-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => loadDashboardData(true)}
            className="btn"
            disabled={refreshing || loading}
            title="Refresh dashboard data"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: refreshing ? 'wait' : 'pointer',
            }}
          >
            <svg
              style={{
                width: '14px',
                height: '14px',
                animation: refreshing ? 'spin 1s linear infinite' : 'none',
              }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
            <span>{refreshing ? 'Syncing...' : 'Sync'}</span>
          </button>
          <Link href="/products" className="btn btn-primary">
            + Start New Order
          </Link>
          <Link href="/receiving" className="btn">
            Receive Delivery
          </Link>
        </div>
      </div>

      {/* Top 4 Metrics strictly from /api/v1/b2b/dashboard/summary */}
      <div className="metrics">
        {/* Metric 1: Active Orders */}
        <div className="metric blue">
          <div>
            <div className="metric-label">Active Orders</div>
            <div className="metric-value">
              {loading && !metrics ? '...' : (metrics?.activeOrders ?? 0)}
            </div>
            <div className="metric-sub">
              {metrics?.activeOrders !== undefined
                ? `${metrics.activeOrders} active purchase order${metrics.activeOrders === 1 ? '' : 's'}`
                : 'Purchase orders in progress'}
            </div>
          </div>
          <div className="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 3h9l3 3v15H6z" />
              <path d="M9 10h6M9 14h6" />
            </svg>
          </div>
        </div>

        {/* Metric 2: In-Transit Deliveries */}
        <div className="metric violet">
          <div>
            <div className="metric-label">In-Transit Deliveries</div>
            <div className="metric-value">
              {loading && !metrics ? '...' : (metrics?.inTransitDeliveries ?? 0)}
            </div>
            <div className="metric-sub">
              {metrics?.inTransitDeliveries !== undefined
                ? `${metrics.inTransitDeliveries} shipment${metrics.inTransitDeliveries === 1 ? '' : 's'} on the way`
                : 'Shipments in transit'}
            </div>
          </div>
          <div className="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z" />
              <circle cx="7" cy="19" r="2" />
              <circle cx="18" cy="19" r="2" />
            </svg>
          </div>
        </div>

        {/* Metric 3: Overdue Invoices */}
        <div className="metric red">
          <div>
            <div className="metric-label">Overdue Invoices</div>
            <div className="metric-value">
              {loading && !metrics ? '...' : (metrics?.overdueInvoices ?? 0)}
            </div>
            <div className="metric-sub">
              {metrics?.overdueInvoices !== undefined
                ? `${metrics.overdueInvoices} invoice${metrics.overdueInvoices === 1 ? '' : 's'} require attention`
                : 'Outstanding overdue'}
            </div>
          </div>
          <div className="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v6M12 17h.01" />
            </svg>
          </div>
        </div>

        {/* Metric 4: Open Claims */}
        <div className="metric amber">
          <div>
            <div className="metric-label">Open Claims</div>
            <div className="metric-value">
              {loading && !metrics ? '...' : (metrics?.openClaims ?? 0)}
            </div>
            <div className="metric-sub">
              {metrics?.openClaims !== undefined
                ? `${metrics.openClaims} claim${metrics.openClaims === 1 ? '' : 's'} under review`
                : 'Claims and credit requests'}
            </div>
          </div>
          <div className="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Recent Orders & Accounts Snapshot */}
      <div className="two-col">
        {/* Recent Purchase Orders from /dashboard/recent-activity */}
        <div className="card">
          <div className="card-head">
            <div>
              <h2>Recent Purchase Orders</h2>
              <p>Latest order activity</p>
            </div>
            <Link href="/purchase-orders" className="link-btn">
              View all →
            </Link>
          </div>
          <div className="table-wrap">
            <table className="table" style={{ minWidth: '720px' }}>
              <thead>
                <tr>
                  <th>PO</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Delivery</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order, idx) => (
                    <tr key={order.poId || idx}>
                      <td>
                        <span className="id-chip">{order.poId}</span>
                      </td>
                      <td>{formatDate(order.date)}</td>
                      <td>{order.items ?? 0}</td>
                      <td>
                        <strong>{formatCurrency(order.total)}</strong>
                      </td>
                      <td>
                        <span className={getStatusClass(order.status)}>{order.status}</span>
                      </td>
                      <td>{order.delivery || '—'}</td>
                      <td>
                        <Link
                          href={`/purchase-orders/${order.poId}`}
                          className="link-btn open-po"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--muted)' }}>
                      {loading ? 'Loading recent orders...' : 'No recent purchase orders found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Accounts Snapshot from /dashboard/accounts-snapshot */}
        <div className="card">
          <div className="card-head">
            <div>
              <h2>Accounts Snapshot</h2>
              <p>Current balance and aging</p>
            </div>
            <Link href="/invoices" className="link-btn">
              Invoices →
            </Link>
          </div>
          <div className="card-body">
            <div style={{ fontSize: '9.5px', color: 'var(--muted)' }}>Total outstanding</div>
            <div style={{ fontSize: '26px', fontWeight: 760, margin: '4px 0 13px' }}>
              {loading && !accounts ? '...' : formatCurrency(accounts?.totalOutstanding)}
            </div>
            <div className="age-grid">
              <div className="age-box">
                <label>Current</label>
                <b>{formatCurrency(accounts?.aging?.current)}</b>
              </div>
              <div className="age-box">
                <label>1–30 days</label>
                <b>{formatCurrency(accounts?.aging?.days_1_30)}</b>
              </div>
              <div className="age-box">
                <label>31–60</label>
                <b>{formatCurrency(accounts?.aging?.days_31_60)}</b>
              </div>
              <div className="age-box">
                <label>60+</label>
                <b style={{ color: (accounts?.aging?.days_60_plus ?? 0) > 0 ? 'var(--red)' : 'inherit' }}>
                  {formatCurrency(accounts?.aging?.days_60_plus)}
                </b>
              </div>
            </div>
            {accounts?.warnings?.message ? (
              <div className="callout warn" style={{ marginTop: '10px' }}>
                <strong>
                  {(accounts.warnings.overdueCount ?? 0) > 0
                    ? `${accounts.warnings.overdueCount} overdue invoice${accounts.warnings.overdueCount === 1 ? '' : 's'}. `
                    : ''}
                </strong>
                {accounts.warnings.message}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Upcoming Deliveries from /dashboard/recent-activity */}
      <div className="section-head" style={{ marginTop: '20px' }}>
        <h2>Upcoming Deliveries</h2>
        <small>Receiving status updates automatically</small>
      </div>
      <div className="card table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Delivery</th>
              <th>PO</th>
              <th>ETA</th>
              <th>Products</th>
              <th>Location</th>
              <th>Status</th>
              <th>Receiving</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {upcomingDeliveries.length > 0 ? (
              upcomingDeliveries.map((delivery, idx) => (
                <tr key={delivery.deliveryId || idx}>
                  <td>
                    <span className="id-chip">{delivery.deliveryId}</span>
                  </td>
                  <td>{delivery.poId}</td>
                  <td>
                    <strong>{delivery.eta}</strong>
                  </td>
                  <td>{delivery.products}</td>
                  <td>{delivery.location}</td>
                  <td>
                    <span className={getStatusClass(delivery.status)}>{delivery.status}</span>
                  </td>
                  <td>
                    {delivery.receiving ? (
                      <span className={getStatusClass(delivery.receiving)}>
                        {delivery.receiving}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>
                    <Link href={`/deliveries/${delivery.deliveryId}`} className="btn btn-sm">
                      {delivery.status?.toLowerCase().includes('transit') ? 'Track' : 'View'}
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: 'var(--muted)' }}>
                  {loading ? 'Loading upcoming deliveries...' : 'No upcoming deliveries scheduled.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
