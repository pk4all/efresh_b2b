'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  getB2BReceivingSummary,
  getB2BReceivingList,
  getB2BLocationStores,
  ReceivingSummary,
  ReceivingListItem,
} from '@/lib/api';

export default function ReceivingPage() {
  const [summary, setSummary] = useState<ReceivingSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState<boolean>(true);

  const [locations, setLocations] = useState<{ id: string; name: string }[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [receivingItems, setReceivingItems] = useState<ReceivingListItem[]>([]);
  const [loadingList, setLoadingList] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch summary statistics
  const fetchSummary = useCallback(async () => {
    try {
      setLoadingSummary(true);
      const res: any = await getB2BReceivingSummary();
      const data = res?.data || res;
      if (data) {
        setSummary({
          readyToReceive: data.readyToReceive,
          arrivingToday: data.arrivingToday,
          partiallyReceived: data.partiallyReceived,
          receivedToday: data.receivedToday,
        });
      }
    } catch (err: any) {
      console.warn('Failed to load receiving summary:', err);
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

  // Fetch receiving list with active filters
  const fetchReceiving = useCallback(async () => {
    try {
      setLoadingList(true);
      setError(null);

      const params: any = {};
      if (selectedStatus && selectedStatus !== 'all') {
        params.status = selectedStatus;
      }
      if (selectedLocation && selectedLocation !== 'all') {
        params.locationId = selectedLocation;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const res: any = await getB2BReceivingList(params);
      let list: ReceivingListItem[] = [];
      if (Array.isArray(res)) {
        list = res;
      } else if (Array.isArray(res?.data)) {
        list = res.data;
      } else if (Array.isArray(res?.items)) {
        list = res.items;
      }

      // Client-side search fallback
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        list = list.filter(
          (item) =>
            item.poId?.toLowerCase().includes(q) ||
            item.deliveryId?.toLowerCase().includes(q) ||
            item.supplier?.toLowerCase().includes(q) ||
            item.location?.toLowerCase().includes(q) ||
            item.receivingStatus?.toLowerCase().includes(q)
        );
      }

      setReceivingItems(list);
    } catch (err: any) {
      console.error('Failed to load receiving orders:', err);
      setError(err.message || 'Failed to fetch receiving records.');
    } finally {
      setLoadingList(false);
    }
  }, [selectedStatus, selectedLocation, searchQuery]);

  useEffect(() => {
    fetchSummary();
    fetchLocations();
  }, [fetchSummary, fetchLocations]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReceiving();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchReceiving]);

  // Delivery status badge styling
  const getDeliveryStatusBadge = (status?: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('deliver')) {
      return <span className="status s-green">{status || 'Delivered'}</span>;
    }
    if (s.includes('transit') || s.includes('out')) {
      return <span className="status s-violet">{status || 'Out for Delivery'}</span>;
    }
    if (s.includes('pack')) {
      return <span className="status s-blue">{status || 'Packing'}</span>;
    }
    return <span className="status s-grey">{status || 'Scheduled'}</span>;
  };

  // Receiving status badge styling
  const getReceivingStatusBadge = (status?: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('ready')) {
      return <span className="status s-blue">{status || 'Ready to Receive'}</span>;
    }
    if (s.includes('partial') || s.includes('progress')) {
      return <span className="status s-amber">{status || 'Partially Received'}</span>;
    }
    if (s.includes('arriv')) {
      return <span className="status s-violet">{status || 'Arriving Today'}</span>;
    }
    if (s.includes('receiv') || s.includes('complet')) {
      return <span className="status s-green">{status || 'Received'}</span>;
    }
    return <span className="status s-grey">{status || 'Pending'}</span>;
  };

  // Priority badge styling
  const getPriorityBadge = (priority?: string) => {
    const p = (priority || '').toLowerCase();
    if (p.includes('high') || p.includes('urgent')) {
      return <span className="status s-red">{priority || 'High'}</span>;
    }
    if (p.includes('continue')) {
      return <span className="status s-amber">{priority || 'Continue'}</span>;
    }
    if (p.includes('norm')) {
      return <span className="status s-blue">{priority || 'Normal'}</span>;
    }
    return <span className="status s-grey">{priority || 'Standard'}</span>;
  };

  return (
    <div className="page active" id="receiving">
      <div className="page-head">
        <div className="title-wrap">
          <h1>Receive Goods</h1>
          <p>
            Purchase orders and deliveries that are due to be received. Open an order to check each
            product and report any issue.
          </p>
        </div>
        <div className="head-actions">
          <button className="btn">Scan Delivery / PO</button>
          <Link href="/claims" className="btn">
            Receiving Claims
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics">
        <div className="metric amber">
          <div>
            <div className="metric-label">Ready to Receive</div>
            <div className="metric-value">
              {loadingSummary ? '—' : summary?.readyToReceive?.count ?? 0}
            </div>
            <div className="metric-sub">
              {loadingSummary
                ? 'Loading...'
                : summary?.readyToReceive?.description || 'Delivered / awaiting check'}
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

        <div className="metric violet">
          <div>
            <div className="metric-label">Arriving Today</div>
            <div className="metric-value">
              {loadingSummary ? '—' : summary?.arrivingToday?.count ?? 0}
            </div>
            <div className="metric-sub">
              {loadingSummary
                ? 'Loading...'
                : summary?.arrivingToday?.description || 'Can be received on arrival'}
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

        <div className="metric blue">
          <div>
            <div className="metric-label">Partially Received</div>
            <div className="metric-value">
              {loadingSummary ? '—' : summary?.partiallyReceived?.count ?? 0}
            </div>
            <div className="metric-sub">
              {loadingSummary
                ? 'Loading...'
                : summary?.partiallyReceived?.description || 'Continue remaining products'}
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
            <div className="metric-label">Received Today</div>
            <div className="metric-value">
              {loadingSummary ? '—' : summary?.receivedToday?.count ?? 0}
            </div>
            <div className="metric-sub">
              {loadingSummary
                ? 'Loading...'
                : summary?.receivedToday?.claims || 'All receipts verified'}
            </div>
          </div>
          <div className="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m5 12 5 5L20 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Toolbar Filters */}
      <div className="toolbar">
        <input
          className="field-inline search-inline"
          placeholder="Search PO, delivery or location"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Status Select */}
        <select
          className="field-inline"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="all">All Due to Receive</option>
          <option value="ready">Ready to Receive</option>
          <option value="partial">Partially Received</option>
          <option value="arriving">Arriving Today</option>
          <option value="received">Received</option>
        </select>

        {/* Location Select */}
        <select
          className="field-inline"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="all">All Locations</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>
      </div>

      {/* POs Due for Receiving Table */}
      <div className="card">
        <div className="card-head">
          <div>
            <h2>POs Due for Receiving</h2>
            <p>Newest / most urgent deliveries appear first</p>
          </div>
          <span className="status pending">
            {loadingList ? '...' : `${receivingItems.length} orders`}
          </span>
        </div>
        <div className="table-wrap">
          {error && (
            <div
              style={{
                padding: '12px 16px',
                color: '#b91c1c',
                background: '#fef2f2',
                borderBottom: '1px solid #fecaca',
                fontSize: '12px',
              }}
            >
              <strong>Error:</strong> {error}
            </div>
          )}

          <table className="table" style={{ minWidth: '1120px' }}>
            <thead>
              <tr>
                <th>PO / Delivery</th>
                <th>Supplier</th>
                <th>Location</th>
                <th>Due / Delivered</th>
                <th>Products</th>
                <th>Expected Qty</th>
                <th>Delivery Status</th>
                <th>Receiving Status</th>
                <th>Priority</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loadingList ? (
                <tr>
                  <td
                    colSpan={10}
                    style={{ textAlign: 'center', padding: '36px', color: 'var(--muted)' }}
                  >
                    Loading receiving records...
                  </td>
                </tr>
              ) : receivingItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    style={{ textAlign: 'center', padding: '36px', color: 'var(--muted)' }}
                  >
                    No receiving records found matching the selected filters.
                  </td>
                </tr>
              ) : (
                receivingItems.map((item) => {
                  const targetId = item.deliveryId || item.poId;
                  const isReady =
                    (item.receivingStatus || '').toLowerCase().includes('ready') ||
                    (item.receivingStatus || '').toLowerCase().includes('partial');

                  return (
                    <tr key={`${item.poId}-${item.deliveryId || ''}`}>
                      <td className="primary-cell">
                        <Link
                          href={`/purchase-orders/${item.poId}`}
                          style={{ fontWeight: 700, color: 'inherit' }}
                        >
                          {item.poId}
                        </Link>
                        {item.deliveryId && (
                          <span className="subtext">{item.deliveryId}</span>
                        )}
                      </td>
                      <td>
                        <strong>{item.supplier || 'eFresh Wholesale'}</strong>
                      </td>
                      <td>{item.location || '—'}</td>
                      <td>
                        <strong>{item.dueDelivered || '—'}</strong>
                      </td>
                      <td>{item.productCount ? `${item.productCount} products` : '—'}</td>
                      <td>{item.expectedQty || '—'}</td>
                      <td>{getDeliveryStatusBadge(item.deliveryStatus)}</td>
                      <td>{getReceivingStatusBadge(item.receivingStatus)}</td>
                      <td>{getPriorityBadge(item.priority)}</td>
                      <td>
                        <Link
                          href={`/receiving/${targetId}`}
                          className={`btn btn-sm ${isReady ? 'btn-primary' : ''}`}
                        >
                          {isReady ? 'Receive Goods' : 'Open / Prepare'}
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="callout" style={{ marginTop: '14px' }}>
        <strong>Receiving workflow:</strong> select a PO &rarr; review delivery details &rarr; mark
        each product <strong>Received</strong> or <strong>Receive &amp; Report</strong> &rarr;
        complete the GRN.
      </div>
    </div>
  );
}
