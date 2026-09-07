'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import {
  getB2BClaimById,
  ClaimDetail,
} from '@/lib/api';

export default function ClaimDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams?.id || '';

  const [claim, setClaim] = useState<ClaimDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Format currency
  const formatCurrency = (val?: number | null) => {
    if (val === undefined || val === null || isNaN(val)) return '$0.00';
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 2,
    }).format(val);
  };

  // Format date helper
  const formatDate = (dateStr?: string) => {
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
  };

  // Status badge class
  const getSupplierResponseBadge = (status?: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('accept') || s.includes('approved')) {
      return <span className="status s-green">{status || 'Accepted'}</span>;
    }
    if (s.includes('reject') || s.includes('declin')) {
      return <span className="status s-red">{status || 'Declined'}</span>;
    }
    if (s.includes('review') || s.includes('pend') || s.includes('progress')) {
      return <span className="status pending">{status || 'Under Review'}</span>;
    }
    return <span className="status s-grey">{status || 'Submitted'}</span>;
  };

  // Fetch claim details directly from API
  const fetchClaim = useCallback(async (claimId: string) => {
    if (!claimId) return;
    try {
      setLoading(true);
      setError(null);
      const res: any = await getB2BClaimById(claimId);
      const data = res?.data || res;
      if (data && (data.id || data.items)) {
        setClaim({
          id: data.id || claimId,
          grnId: data.grnId,
          poId: data.poId,
          invoiceId: data.invoiceId,
          status: data.status || data.supplierResponse || 'Under Review',
          raisedAt: data.raisedAt,
          raisedBy: data.raisedBy,
          claimValue: data.claimValue,
          supplierResponse: data.supplierResponse,
          credit: data.credit,
          items: data.items || [],
          alerts: data.alerts || [],
        });
      } else {
        setError('Claim record not found.');
        setClaim(null);
      }
    } catch (err: any) {
      console.error('Failed to load claim detail:', err);
      setError(err.message || 'Failed to fetch claim details.');
      setClaim(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchClaim(id);
    }
  }, [id, fetchClaim]);

  if (loading) {
    return (
      <div className="page active" id="claim-detail">
        <div className="page-head">
          <Link href="/claims" className="back-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
          <div className="title-wrap">
            <h1>{id || 'Loading Claim...'}</h1>
            <p>Fetching claim record...</p>
          </div>
        </div>
        <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'var(--muted)' }}>
          Loading claim data...
        </div>
      </div>
    );
  }

  if (error || !claim) {
    return (
      <div className="page active" id="claim-detail">
        <div className="page-head">
          <Link href="/claims" className="back-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
          <div className="title-wrap">
            <h1>{id || 'Claim Not Found'}</h1>
            <p style={{ color: 'var(--red)' }}>{error || 'Unable to retrieve this claim.'}</p>
          </div>
          <div className="head-actions">
            <Link href="/claims" className="btn">&larr; Back to Claims</Link>
            <button className="btn" onClick={() => fetchClaim(id)}>Retry</button>
          </div>
        </div>
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
          <p style={{ color: 'var(--muted)', marginBottom: '14px' }}>
            The requested claim was not found on the server.
          </p>
          <Link href="/claims" className="btn btn-primary">
            View All Claims
          </Link>
        </div>
      </div>
    );
  }

  const items = claim.items || [];
  const alerts = claim.alerts || [];
  const totalClaimAmount = items.reduce((sum, it) => sum + (it.claimAmount ?? 0), 0) || claim.claimValue || 0;

  return (
    <div className="page active" id="claim-detail">
      <div className="page-head">
        <Link href="/claims" className="back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Link>
        <div className="title-wrap">
          <h1>{claim.id}</h1>
          <p>
            {claim.grnId ? `Created from GRN ${claim.grnId}` : 'Goods Variance Claim'}
            {claim.poId && ` · Linked to ${claim.poId}`}
            {claim.raisedAt && ` · ${formatDate(claim.raisedAt)}`}
          </p>
        </div>
        <div className="head-actions">
          <Link href="/claims" className="btn">&larr; Claims</Link>
          {claim.poId && (
            <Link href={`/purchase-orders/${claim.poId}`} className="btn">
              View PO
            </Link>
          )}
          {claim.invoiceId && (
            <Link href={`/invoices/${claim.invoiceId}`} className="btn">
              View Invoice
            </Link>
          )}
        </div>
      </div>

      <div className="detail-grid">
        <div>
          {/* Claim Lines Card */}
          <div className="card">
            <div className="card-head">
              <div>
                <h2>Claimed Items</h2>
                <p>Breakdown of products reported for damage, spoilage, or shortage</p>
              </div>
              {getSupplierResponseBadge(claim.status || claim.supplierResponse)}
            </div>
            <div className="table-wrap">
              <table className="table" style={{ minWidth: '700px' }}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Issue</th>
                    <th>Qty</th>
                    <th>Applied Cost</th>
                    <th>Claim Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)' }}>
                        No specific line items recorded for this claim.
                      </td>
                    </tr>
                  ) : (
                    items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="primary-cell">
                          {item.productName || item.productId || 'Product Item'}
                          {item.unit && <span className="subtext">{item.unit}</span>}
                        </td>
                        <td>
                          <span className="issue-badge">{item.issue || item.reason || 'Variance'}</span>
                          {item.description && <span className="subtext">{item.description}</span>}
                        </td>
                        <td>{item.qty || item.quantity || 1}</td>
                        <td>{formatCurrency(item.appliedCost)}</td>
                        <td>
                          <strong>{formatCurrency(item.claimAmount)}</strong>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Aside Summary */}
        <aside>
          <div className="card">
            <div className="card-head">
              <h2>Claim Summary</h2>
            </div>
            <div className="po-totals">
              <div className="sum-row">
                <span>Total Items</span>
                <b>{items.length}</b>
              </div>
              <div className="sum-row">
                <span>Status</span>
                <b>{claim.status || claim.supplierResponse || 'Under Review'}</b>
              </div>
              <div className="sum-row">
                <span>Credit Note</span>
                <b>{claim.credit || 'Pending Review'}</b>
              </div>
              <div className="sum-row total">
                <span>Total Claim Value</span>
                <span>{formatCurrency(totalClaimAmount)}</span>
              </div>
            </div>
          </div>

          {/* Evidence and Alerts */}
          {alerts.length > 0 ? (
            alerts.map((alertItem, aIdx) => (
              <div
                key={aIdx}
                className={`callout ${alertItem.type?.toLowerCase() === 'warning' ? 'warn' : ''}`}
                style={{ marginTop: '14px' }}
              >
                {alertItem.type && <strong>{alertItem.type}: </strong>}
                {alertItem.message}
              </div>
            ))
          ) : (
            <>
              <div className="callout" style={{ marginTop: '14px' }}>
                <strong>Evidence:</strong> Receiver notes and inspection counts have been attached and dispatched to the supplier.
              </div>
              <div className="callout warn" style={{ marginTop: '10px' }}>
                Invoice payable balance will only reduce after the supplier issues an approved credit note.
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
