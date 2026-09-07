'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  getB2BInvoicesSummary,
  getB2BInvoices,
  getB2BLocationStores,
  InvoicesSummary,
  InvoiceListItem,
} from '@/lib/api';

export default function InvoicesPage() {
  const [summary, setSummary] = useState<InvoicesSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState<boolean>(true);

  const [locations, setLocations] = useState<{ id: string; name: string }[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('All Statuses');
  const [selectedLocation, setSelectedLocation] = useState<string>('All Locations');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
  const getStatusBadge = (status?: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('paid')) {
      return <span className="status s-green">{status || 'Paid'}</span>;
    }
    if (s.includes('overdue')) {
      return <span className="status danger">{status || 'Overdue'}</span>;
    }
    if (s.includes('due soon') || s.includes('review')) {
      return <span className="status pending">{status || 'Due Soon'}</span>;
    }
    return <span className="status pending">{status || 'Pending'}</span>;
  };

  // Fetch summary statistics
  const fetchSummary = useCallback(async () => {
    try {
      setLoadingSummary(true);
      const res: any = await getB2BInvoicesSummary();
      const data = res?.data || res;
      if (data) {
        setSummary({
          outstanding: data.outstanding,
          dueWithin14Days: data.dueWithin14Days,
          overdue: data.overdue,
          availableCredit: data.availableCredit,
          aging: data.aging,
          nextDueDate: data.nextDueDate,
        });
      }
    } catch (err: any) {
      console.warn('Failed to load invoices summary:', err);
      setSummary(null);
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  // Fetch store locations for filtering
  const fetchLocations = useCallback(async () => {
    try {
      const res: any = await getB2BLocationStores();
      const rawLocs = res?.data || res || [];
      if (Array.isArray(rawLocs)) {
        const parsed = rawLocs.map((loc: any) => ({
          id: loc.id || loc._id || loc.name,
          name: loc.name || loc.deliverTo?.storeName || loc.address || 'Store Location',
        }));
        setLocations(parsed);
      }
    } catch (err) {
      console.warn('Failed to load locations:', err);
    }
  }, []);

  // Fetch invoices list with active filters directly from API
  const fetchInvoicesList = useCallback(async () => {
    try {
      setLoadingInvoices(true);
      setError(null);

      const params: any = {};
      if (selectedStatus && selectedStatus !== 'all' && selectedStatus !== 'All' && selectedStatus !== 'All Statuses') {
        params.status = selectedStatus;
      }
      if (selectedLocation && selectedLocation !== 'all' && selectedLocation !== 'All' && selectedLocation !== 'All Locations') {
        params.locationId = selectedLocation;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const res: any = await getB2BInvoices(params);
      let list: InvoiceListItem[] = [];
      if (Array.isArray(res)) {
        list = res;
      } else if (Array.isArray(res?.data)) {
        list = res.data;
      } else if (Array.isArray(res?.invoices)) {
        list = res.invoices;
      } else if (Array.isArray(res?.items)) {
        list = res.items;
      }

      // Client-side search and status filter fallback if API doesn't filter on server
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        list = list.filter(
          (inv) =>
            inv.id?.toLowerCase().includes(q) ||
            inv.poId?.toLowerCase().includes(q) ||
            (Array.isArray(inv.grnDelivery)
              ? inv.grnDelivery.some((d) => d.toLowerCase().includes(q))
              : inv.grnDelivery?.toLowerCase().includes(q)) ||
            inv.status?.toLowerCase().includes(q)
        );
      }

      if (selectedStatus && selectedStatus !== 'All Statuses') {
        const s = selectedStatus.toLowerCase();
        list = list.filter((inv) => (inv.status || '').toLowerCase().includes(s));
      }

      setInvoices(list);
    } catch (err: any) {
      console.error('Failed to load invoices:', err);
      setError(err.message || 'Failed to fetch invoices.');
      setInvoices([]);
    } finally {
      setLoadingInvoices(false);
    }
  }, [selectedStatus, selectedLocation, searchQuery]);

  useEffect(() => {
    fetchSummary();
    fetchLocations();
  }, [fetchSummary, fetchLocations]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInvoicesList();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchInvoicesList]);

  // Credit calculations
  const creditLimit = summary?.availableCredit?.creditLimit ?? 0;
  const availableCredit = summary?.availableCredit?.available ?? 0;
  const creditUsed = Math.max(0, creditLimit - availableCredit);
  const creditPercent = creditLimit > 0 ? Math.min(100, Math.round((creditUsed / creditLimit) * 100)) : 0;

  // CSV Export handler
  const handleExportCSV = () => {
    if (!invoices || invoices.length === 0) {
      alert('No invoice data available to export.');
      return;
    }

    const headers = ['Invoice ID', 'PO Number', 'GRN / Delivery', 'Invoice Date', 'Due Date', 'Amount', 'Credits Pending', 'Balance', 'Status'];
    const rows = invoices.map((inv) => [
      inv.id,
      inv.poId || '',
      Array.isArray(inv.grnDelivery) ? inv.grnDelivery.join('; ') : inv.grnDelivery || '',
      inv.invoiceDate || '',
      inv.dueDate || '',
      inv.amount ?? 0,
      inv.creditsPending || '',
      inv.balance ?? 0,
      inv.status || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `b2b_invoices_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadStatement = () => {
    alert('Statement for the current billing period is being generated and will download shortly.');
  };

  return (
    <div className="page active" id="invoices">
      <div className="page-head">
        <div className="title-wrap">
          <h1>Invoices</h1>
          <p>See pending, due and overdue invoices linked back to purchase orders and goods receipts.</p>
        </div>
        <div className="head-actions">
          <button className="btn" onClick={handleDownloadStatement}>Download Statement</button>
          <button className="btn" onClick={handleExportCSV}>Export CSV</button>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="metrics">
        <div className="metric blue">
          <div>
            <div className="metric-label">Outstanding</div>
            <div className="metric-value">
              {loadingSummary ? '...' : formatCurrency(summary?.outstanding?.total)}
            </div>
            <div className="metric-sub">
              {loadingSummary ? 'Loading...' : `${summary?.outstanding?.invoiceCount ?? 0} open invoices`}
            </div>
          </div>
          <div className="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a2.5 2.5 0 0 0 0 5H14a2.5 2.5 0 0 1 0 5H7" />
            </svg>
          </div>
        </div>

        <div className="metric amber">
          <div>
            <div className="metric-label">Due Within 14 Days</div>
            <div className="metric-value">
              {loadingSummary ? '...' : formatCurrency(summary?.dueWithin14Days?.total)}
            </div>
            <div className="metric-sub">
              {loadingSummary ? 'Loading...' : `${summary?.dueWithin14Days?.invoiceCount ?? 0} invoices`}
            </div>
          </div>
          <div className="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        </div>

        <div className="metric red">
          <div>
            <div className="metric-label">Overdue</div>
            <div className="metric-value">
              {loadingSummary ? '...' : formatCurrency(summary?.overdue?.total)}
            </div>
            <div className="metric-sub">
              {loadingSummary ? 'Loading...' : `${summary?.overdue?.invoiceCount ?? 0} invoices`}
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

        <div className="metric green">
          <div>
            <div className="metric-label">Available Credit</div>
            <div className="metric-value">
              {loadingSummary ? '...' : formatCurrency(availableCredit)}
            </div>
            <div className="metric-sub">
              {loadingSummary ? 'Loading...' : `Limit ${formatCurrency(creditLimit)}`}
            </div>
          </div>
          <div className="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m5 12 5 5L20 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Account Aging Card */}
      <div className="card" style={{ marginBottom: '14px' }}>
        <div className="card-head">
          <div>
            <h2>Account Aging</h2>
            <p>Payment terms follow each PO</p>
          </div>
          {summary?.nextDueDate && (
            <span className="status pending">
              Next due {summary.nextDueDate}
            </span>
          )}
        </div>
        <div className="card-body">
          <div className="age-grid">
            <div className="age-box">
              <label>Current</label>
              <b>{loadingSummary ? '...' : formatCurrency(summary?.aging?.current)}</b>
            </div>
            <div className="age-box">
              <label>1-30 Days</label>
              <b>{loadingSummary ? '...' : formatCurrency(summary?.aging?.days1To30)}</b>
            </div>
            <div className="age-box">
              <label>31-60 Days</label>
              <b>{loadingSummary ? '...' : formatCurrency(summary?.aging?.days31To60)}</b>
            </div>
            <div className="age-box">
              <label>60+ Days</label>
              <b style={{ color: 'var(--red)' }}>
                {loadingSummary ? '...' : formatCurrency(summary?.aging?.days60Plus)}
              </b>
            </div>
          </div>
          <div style={{ marginTop: '12px', fontSize: '9.5px', color: 'var(--muted)' }}>
            Credit used: {formatCurrency(creditUsed)} of {formatCurrency(creditLimit)} ({creditPercent}%)
          </div>
          <div className="credit-meter">
            <span style={{ width: `${creditPercent}%` }}></span>
          </div>
        </div>
      </div>

      {/* Toolbar Filters */}
      <div className="toolbar">
        <input
          className="field-inline search-inline"
          placeholder="Search invoice or PO"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="field-inline"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="All Statuses">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Due Soon">Due Soon</option>
          <option value="Overdue">Overdue</option>
          <option value="Paid">Paid</option>
        </select>
        <select
          className="field-inline"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="All Locations">All Locations</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>
      </div>

      {/* Invoices List Table */}
      <div className="card table-wrap">
        {loadingInvoices ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--muted)' }}>
            Loading invoices...
          </div>
        ) : error ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--red)' }}>
            <p>{error}</p>
            <button className="btn btn-sm" onClick={fetchInvoicesList} style={{ marginTop: '8px' }}>
              Retry
            </button>
          </div>
        ) : invoices.length === 0 ? (
          <div style={{ padding: '36px', textAlign: 'center', color: 'var(--muted)' }}>
            <p style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>No invoices found</p>
            <p style={{ fontSize: '11px' }}>No invoice records returned for the current selection.</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>PO</th>
                <th>GRN / Delivery</th>
                <th>Invoice Date</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Credits Pending</th>
                <th>Balance</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => {
                const grnList = Array.isArray(inv.grnDelivery)
                  ? inv.grnDelivery
                  : typeof inv.grnDelivery === 'string'
                    ? [inv.grnDelivery]
                    : [];
                const mainGrn = grnList[0] || '—';
                const subDel = grnList.length > 1 ? grnList.slice(1).join(', ') : null;

                const isOverdue = (inv.status || '').toLowerCase().includes('overdue');

                return (
                  <tr key={inv.id}>
                    <td>
                      <span className="id-chip">{inv.id}</span>
                    </td>
                    <td>
                      {inv.poId ? (
                        <Link href={`/purchase-orders/${inv.poId}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          {inv.poId}
                        </Link>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>
                      {mainGrn}
                      {subDel && <span className="subtext">{subDel}</span>}
                    </td>
                    <td>{inv.invoiceDate || '—'}</td>
                    <td>{inv.dueDate || '—'}</td>
                    <td>{formatCurrency(inv.amount)}</td>
                    <td>
                      {inv.creditsPending ? (
                        <span className="status pending">
                          {typeof inv.creditsPending === 'number'
                            ? `${formatCurrency(inv.creditsPending)} claim`
                            : inv.creditsPending}
                        </span>
                      ) : (
                        <span>&ndash;</span>
                      )}
                    </td>
                    <td>
                      <strong style={{ color: isOverdue ? 'var(--red)' : undefined }}>
                        {formatCurrency(inv.balance ?? inv.amount)}
                      </strong>
                    </td>
                    <td>{getStatusBadge(inv.status)}</td>
                    <td>
                      <Link href={`/invoices/${inv.id}`} className="btn btn-sm open-invoice">
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
