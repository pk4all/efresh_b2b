'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  getB2BClaimsSummary,
  getB2BClaims,
  getB2BClaimById,
  createB2BClaim,
  ClaimsSummary,
  ClaimListItem,
  ClaimDetail,
  CreateClaimPayload,
} from '@/lib/api';

export default function ClaimsPage() {
  const [summary, setSummary] = useState<ClaimsSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState<boolean>(true);

  const [claims, setClaims] = useState<ClaimListItem[]>([]);
  const [loadingClaims, setLoadingClaims] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All Statuses');

  // Selected claim detail preview
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [claimDetail, setClaimDetail] = useState<ClaimDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);

  // Modal for creating a new claim
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [submittingClaim, setSubmittingClaim] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [newClaimForm, setNewClaimForm] = useState({
    poId: '',
    grnId: '',
    productId: '',
    productName: '',
    reason: 'Damaged',
    quantity: 1,
    description: '',
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

  // Format date helper
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'short',
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

  // Fetch summary
  const fetchSummary = useCallback(async () => {
    try {
      setLoadingSummary(true);
      const res: any = await getB2BClaimsSummary();
      const data = res?.data || res;
      if (data) {
        setSummary({
          openClaims: data.openClaims,
          underReview: data.underReview,
          creditsApprovedThisMonth: data.creditsApprovedThisMonth,
          averageResolutionDays: data.averageResolutionDays,
        });
      }
    } catch (err: any) {
      console.warn('Failed to load claims summary:', err);
      setSummary(null);
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  // Fetch claims list
  const fetchClaimsList = useCallback(async () => {
    try {
      setLoadingClaims(true);
      setError(null);

      const params: any = {};
      if (selectedStatus && selectedStatus !== 'All Statuses' && selectedStatus !== 'all') {
        params.status = selectedStatus;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const res: any = await getB2BClaims(params);
      let list: ClaimListItem[] = [];
      if (Array.isArray(res)) {
        list = res;
      } else if (Array.isArray(res?.data)) {
        list = res.data;
      } else if (Array.isArray(res?.claims)) {
        list = res.claims;
      } else if (Array.isArray(res?.items)) {
        list = res.items;
      }

      // Client-side search & status filtering fallback
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        list = list.filter(
          (c) =>
            c.id?.toLowerCase().includes(q) ||
            c.grnId?.toLowerCase().includes(q) ||
            c.poId?.toLowerCase().includes(q) ||
            c.invoiceId?.toLowerCase().includes(q) ||
            c.productSummary?.toLowerCase().includes(q) ||
            c.issueSummary?.toLowerCase().includes(q) ||
            c.supplierResponse?.toLowerCase().includes(q)
        );
      }

      if (selectedStatus && selectedStatus !== 'All Statuses') {
        const s = selectedStatus.toLowerCase();
        list = list.filter(
          (c) =>
            (c.supplierResponse || '').toLowerCase().includes(s) ||
            (c.status || '').toLowerCase().includes(s)
        );
      }

      setClaims(list);

      // Select first claim by default if available and not currently selected
      if (list.length > 0 && !selectedClaimId) {
        setSelectedClaimId(list[0].id);
      }
    } catch (err: any) {
      console.error('Failed to load claims:', err);
      setError(err.message || 'Failed to fetch claims list.');
      setClaims([]);
    } finally {
      setLoadingClaims(false);
    }
  }, [selectedStatus, searchQuery, selectedClaimId]);

  // Fetch detail for selected claim
  const fetchClaimDetail = useCallback(async (id: string) => {
    if (!id) return;
    try {
      setLoadingDetail(true);
      const res: any = await getB2BClaimById(id);
      const data = res?.data || res;
      if (data && (data.id || data.items)) {
        setClaimDetail(data);
      } else {
        setClaimDetail(null);
      }
    } catch (err: any) {
      console.warn('Failed to load claim detail:', err);
      setClaimDetail(null);
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchClaimsList();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchClaimsList]);

  useEffect(() => {
    if (selectedClaimId) {
      fetchClaimDetail(selectedClaimId);
    } else {
      setClaimDetail(null);
    }
  }, [selectedClaimId, fetchClaimDetail]);

  // Export CSV handler
  const handleExportCSV = () => {
    if (!claims || claims.length === 0) {
      alert('No claim records available to export.');
      return;
    }

    const headers = ['Claim ID', 'GRN ID', 'PO Number', 'Invoice ID', 'Raised Date', 'Raised By', 'Issue', 'Product', 'Claim Value', 'Supplier Response', 'Credit Note'];
    const rows = claims.map((c) => [
      c.id,
      c.grnId || '',
      c.poId || '',
      c.invoiceId || '',
      c.raisedAt || '',
      c.raisedBy || '',
      c.issueSummary || '',
      c.productSummary || '',
      c.claimValue ?? 0,
      c.supplierResponse || '',
      c.credit || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `b2b_claims_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Submit new claim handler
  const handleCreateClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClaimForm.poId.trim() || !newClaimForm.grnId.trim()) {
      setCreateError('Please provide both PO Number and GRN Number.');
      return;
    }
    if (!newClaimForm.productId.trim() && !newClaimForm.productName.trim()) {
      setCreateError('Please specify a Product ID or Name.');
      return;
    }

    try {
      setSubmittingClaim(true);
      setCreateError(null);
      setCreateSuccess(null);

      const payload: CreateClaimPayload = {
        poId: newClaimForm.poId.trim(),
        grnId: newClaimForm.grnId.trim(),
        items: [
          {
            productId: newClaimForm.productId.trim() || newClaimForm.productName.trim(),
            reason: newClaimForm.reason,
            quantity: Number(newClaimForm.quantity) || 1,
            description: newClaimForm.description.trim() || undefined,
          },
        ],
      };

      const res = await createB2BClaim(payload);
      const newId = res?.id || res?.claimId || 'Submitted';
      setCreateSuccess(`Claim successfully registered! (Reference: ${newId})`);

      // Reset form & reload lists
      setTimeout(() => {
        setShowCreateModal(false);
        setCreateSuccess(null);
        setNewClaimForm({
          poId: '',
          grnId: '',
          productId: '',
          productName: '',
          reason: 'Damaged',
          quantity: 1,
          description: '',
        });
        fetchSummary();
        fetchClaimsList();
      }, 1500);
    } catch (err: any) {
      console.error('Failed to create claim:', err);
      setCreateError(err.message || 'Failed to submit claim. Please check your inputs.');
    } finally {
      setSubmittingClaim(false);
    }
  };

  return (
    <div className="page active" id="claims">
      <div className="page-head">
        <div className="title-wrap">
          <h1>Claims &amp; Credits</h1>
          <p>Damage, spoilage and shortage claims generated from goods receiving, with credit status against invoices.</p>
        </div>
        <div className="head-actions">
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            + Raise Claim
          </button>
          <button className="btn" onClick={handleExportCSV}>Export Claims</button>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="metrics">
        <div className="metric amber">
          <div>
            <div className="metric-label">Open Claims</div>
            <div className="metric-value">
              {loadingSummary ? '...' : (summary?.openClaims?.count ?? 0)}
            </div>
            <div className="metric-sub">
              {loadingSummary
                ? 'Loading...'
                : `${formatCurrency(summary?.openClaims?.requestedAmount)} requested`}
            </div>
          </div>
          <div className="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
        </div>

        <div className="metric blue">
          <div>
            <div className="metric-label">Under Review</div>
            <div className="metric-value">
              {loadingSummary ? '...' : (summary?.underReview?.count ?? 0)}
            </div>
            <div className="metric-sub">
              {loadingSummary
                ? 'Loading...'
                : formatCurrency(summary?.underReview?.amount)}
            </div>
          </div>
          <div className="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        </div>

        <div className="metric green">
          <div>
            <div className="metric-label">Credits Approved</div>
            <div className="metric-value">
              {loadingSummary
                ? '...'
                : formatCurrency(summary?.creditsApprovedThisMonth)}
            </div>
            <div className="metric-sub">This month</div>
          </div>
          <div className="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
        </div>

        <div className="metric violet">
          <div>
            <div className="metric-label">Average Resolution</div>
            <div className="metric-value">
              {loadingSummary
                ? '...'
                : summary?.averageResolutionDays !== undefined
                ? `${summary.averageResolutionDays}d`
                : '—'}
            </div>
            <div className="metric-sub">Last 30 days</div>
          </div>
          <div className="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m5 12 5 5L20 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <input
          className="field-inline search-inline"
          placeholder="Search claim, PO, GRN or product"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="field-inline"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="All Statuses">All Statuses</option>
          <option value="Under Review">Under Review</option>
          <option value="Accepted">Accepted</option>
          <option value="Declined">Declined</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* Claims Table */}
      <div className="card table-wrap">
        {loadingClaims ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--muted)' }}>
            Loading claims records...
          </div>
        ) : error ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--red)' }}>
            <p>{error}</p>
            <button className="btn btn-sm" onClick={fetchClaimsList} style={{ marginTop: '8px' }}>
              Retry
            </button>
          </div>
        ) : claims.length === 0 ? (
          <div style={{ padding: '36px', textAlign: 'center', color: 'var(--muted)' }}>
            <p style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>No claims found</p>
            <p style={{ fontSize: '11px' }}>No damage or shortage claims match the current criteria.</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Claim</th>
                <th>GRN</th>
                <th>PO / Invoice</th>
                <th>Raised</th>
                <th>Issue</th>
                <th>Claim Value</th>
                <th>Supplier Response</th>
                <th>Credit</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {claims.map((claim) => {
                const isSelected = claim.id === selectedClaimId;
                const poRef = claim.poId;
                const invRef = claim.invoiceId;
                const raisedDateStr = formatDate(claim.raisedAt);
                const raisedByStr = claim.raisedBy || '';

                return (
                  <tr
                    key={claim.id}
                    style={{
                      background: isSelected ? 'var(--blue-soft, rgba(0, 102, 204, 0.04))' : undefined,
                      cursor: 'pointer',
                    }}
                    onClick={() => setSelectedClaimId(claim.id)}
                  >
                    <td>
                      <span className="id-chip">{claim.id}</span>
                    </td>
                    <td>{claim.grnId || '—'}</td>
                    <td>
                      {poRef ? (
                        <div>
                          <Link
                            href={`/purchase-orders/${poRef}`}
                            style={{ color: 'inherit', textDecoration: 'none' }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {poRef}
                          </Link>
                          {invRef && (
                            <span className="subtext">
                              <Link
                                href={`/invoices/${invRef}`}
                                style={{ color: 'inherit', textDecoration: 'none' }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {invRef}
                              </Link>
                            </span>
                          )}
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>
                      {raisedDateStr}
                      {raisedByStr && <span className="subtext">{raisedByStr}</span>}
                    </td>
                    <td>
                      {claim.issueSummary && (
                        <span className="issue-badge" style={{ display: 'inline-block', marginBottom: '2px' }}>
                          {claim.issueSummary}
                        </span>
                      )}
                      {claim.productSummary && (
                        <span className="subtext">{claim.productSummary}</span>
                      )}
                    </td>
                    <td>
                      <strong>{formatCurrency(claim.claimValue)}</strong>
                    </td>
                    <td>{getSupplierResponseBadge(claim.supplierResponse || claim.status)}</td>
                    <td>
                      {claim.credit ? (
                        claim.credit.toLowerCase() === 'pending' ? (
                          <span className="status pending">Pending</span>
                        ) : (
                          <span className="status complete">{claim.credit}</span>
                        )
                      ) : (
                        <span>&ndash;</span>
                      )}
                    </td>
                    <td>
                      <Link
                        href={`/claims/${claim.id}`}
                        className="btn btn-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Inline Detail Card for Selected Claim */}
      {selectedClaimId && (
        <div className="card" style={{ marginTop: '14px' }}>
          <div className="card-head">
            <div>
              <h2>{selectedClaimId} &middot; Claim Detail</h2>
              <p>
                {claimDetail?.grnId
                  ? `Created from goods receipt ${claimDetail.grnId}`
                  : 'Claim lines & supplier feedback'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {getSupplierResponseBadge(claimDetail?.status || claimDetail?.supplierResponse)}
              <Link href={`/claims/${selectedClaimId}`} className="btn btn-sm">
                Full Page &rarr;
              </Link>
            </div>
          </div>

          <div className="detail-grid" style={{ padding: '14px' }}>
            <div>
              {loadingDetail ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--muted)' }}>
                  Loading claim line items...
                </div>
              ) : !claimDetail?.items || claimDetail.items.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--muted)' }}>
                  No item breakdown available for this claim.
                </div>
              ) : (
                <div className="table-wrap">
                  <table className="table" style={{ minWidth: '650px' }}>
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
                      {claimDetail.items.map((item, iIdx) => (
                        <tr key={iIdx}>
                          <td className="primary-cell">
                            {item.productName || item.productId || 'Claim Item'}
                            {item.unit && <span className="subtext">{item.unit}</span>}
                          </td>
                          <td>{item.issue || item.reason || '—'}</td>
                          <td>{item.qty || item.quantity || 1}</td>
                          <td>{formatCurrency(item.appliedCost)}</td>
                          <td>{formatCurrency(item.claimAmount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <aside>
              {claimDetail?.alerts && claimDetail.alerts.length > 0 ? (
                claimDetail.alerts.map((alertItem, aIdx) => (
                  <div
                    key={aIdx}
                    className={`callout ${alertItem.type?.toLowerCase() === 'warning' ? 'warn' : ''}`}
                    style={{ marginTop: aIdx > 0 ? '10px' : '0' }}
                  >
                    {alertItem.type && <strong>{alertItem.type}: </strong>}
                    {alertItem.message}
                  </div>
                ))
              ) : (
                <>
                  <div className="callout">
                    <strong>Evidence &amp; Notes:</strong> Receiver inspection log attached. The supplier will review and verify against delivery weights.
                  </div>
                  <div className="callout warn" style={{ marginTop: '10px' }}>
                    Invoice balance remains unchanged until the credit note is approved and issued.
                  </div>
                </>
              )}
            </aside>
          </div>
        </div>
      )}

      {/* Modal for Raising a New Claim */}
      {showCreateModal && (
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
          onClick={() => !submittingClaim && setShowCreateModal(false)}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: '520px',
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
                <h2>Raise New Claim</h2>
                <p>Submit a variance claim for damaged, spoiled, or missing goods</p>
              </div>
              <button
                className="btn btn-sm"
                onClick={() => setShowCreateModal(false)}
                disabled={submittingClaim}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateClaim} style={{ padding: '20px' }}>
              {createError && (
                <div style={{ color: 'var(--red)', marginBottom: '14px', fontSize: '13px' }}>
                  {createError}
                </div>
              )}
              {createSuccess && (
                <div style={{ color: 'var(--green)', marginBottom: '14px', fontSize: '13px' }}>
                  {createSuccess}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                    PO Number *
                  </label>
                  <input
                    type="text"
                    className="field-inline"
                    style={{ width: '100%' }}
                    placeholder="e.g. PO-10463"
                    value={newClaimForm.poId}
                    onChange={(e) => setNewClaimForm({ ...newClaimForm, poId: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                    GRN Number *
                  </label>
                  <input
                    type="text"
                    className="field-inline"
                    style={{ width: '100%' }}
                    placeholder="e.g. GRN-22041"
                    value={newClaimForm.grnId}
                    onChange={(e) => setNewClaimForm({ ...newClaimForm, grnId: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  Product Name / ID *
                </label>
                <input
                  type="text"
                  className="field-inline"
                  style={{ width: '100%' }}
                  placeholder="e.g. Strawberries 250g or PRD-1029"
                  value={newClaimForm.productName}
                  onChange={(e) => setNewClaimForm({ ...newClaimForm, productName: e.target.value, productId: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                    Reason *
                  </label>
                  <select
                    className="field-inline"
                    style={{ width: '100%' }}
                    value={newClaimForm.reason}
                    onChange={(e) => setNewClaimForm({ ...newClaimForm, reason: e.target.value })}
                  >
                    <option value="Damaged">Damaged</option>
                    <option value="Spoiled">Spoiled</option>
                    <option value="Missing">Missing / Shortage</option>
                    <option value="Quality Issue">Quality Issue</option>
                    <option value="Incorrect Item">Incorrect Item</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                    Quantity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="field-inline"
                    style={{ width: '100%' }}
                    value={newClaimForm.quantity}
                    onChange={(e) => setNewClaimForm({ ...newClaimForm, quantity: parseInt(e.target.value) || 1 })}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  Description / Inspection Notes
                </label>
                <textarea
                  className="field-inline"
                  style={{ width: '100%', height: '70px', padding: '8px' }}
                  placeholder="Details regarding damaged condition, batch code, or variance..."
                  value={newClaimForm.description}
                  onChange={(e) => setNewClaimForm({ ...newClaimForm, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowCreateModal(false)}
                  disabled={submittingClaim}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submittingClaim}
                >
                  {submittingClaim ? 'Submitting...' : 'Submit Claim'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
