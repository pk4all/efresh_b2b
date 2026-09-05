'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  getB2BDeliveriesSummary,
  getB2BDeliveries,
  getB2BLocationStores,
  DeliveriesSummary,
  DeliveryListItem,
} from '@/lib/api';

export default function DeliveriesPage() {
  const [summary, setSummary] = useState<DeliveriesSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState<boolean>(true);

  const [locations, setLocations] = useState<{ id: string; name: string }[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [deliveries, setDeliveries] = useState<DeliveryListItem[]>([]);
  const [loadingDeliveries, setLoadingDeliveries] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch summary metrics
  const fetchSummary = useCallback(async () => {
    try {
      setLoadingSummary(true);
      const res: any = await getB2BDeliveriesSummary();
      const data = res?.data || res;
      if (data) {
        setSummary({
          arrivingToday: data.arrivingToday,
          scheduled: data.scheduled,
          needsReceiving: data.needsReceiving,
          receivedThisWeek: data.receivedThisWeek,
        });
      }
    } catch (err: any) {
      console.warn('Failed to load deliveries summary:', err);
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  // Fetch store locations for filter dropdown
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

  // Fetch deliveries list with filters
  const fetchDeliveriesList = useCallback(async () => {
    try {
      setLoadingDeliveries(true);
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

      const res: any = await getB2BDeliveries(params);
      let list: DeliveryListItem[] = [];
      if (Array.isArray(res)) {
        list = res;
      } else if (Array.isArray(res?.data)) {
        list = res.data;
      } else if (Array.isArray(res?.deliveries)) {
        list = res.deliveries;
      }

      // Client-side fallback filter for search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        list = list.filter(
          (d) =>
            d.id?.toLowerCase().includes(q) ||
            d.poId?.toLowerCase().includes(q) ||
            d.locationName?.toLowerCase().includes(q) ||
            d.driverRun?.toLowerCase().includes(q) ||
            d.deliveryStatus?.toLowerCase().includes(q)
        );
      }

      setDeliveries(list);
    } catch (err: any) {
      console.error('Failed to load deliveries:', err);
      setError(err.message || 'Failed to fetch delivery records.');
    } finally {
      setLoadingDeliveries(false);
    }
  }, [selectedStatus, selectedLocation, searchQuery]);

  useEffect(() => {
    fetchSummary();
    fetchLocations();
  }, [fetchSummary, fetchLocations]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDeliveriesList();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchDeliveriesList]);

  // Delivery status badge styling
  const getDeliveryStatusBadge = (status?: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('transit')) {
      return <span className="status s-violet">{status || 'In Transit'}</span>;
    }
    if (s.includes('pack')) {
      return <span className="status s-blue">{status || 'Packing'}</span>;
    }
    if (s.includes('deliver') || s.includes('receiv') || s.includes('complet')) {
      return <span className="status s-green">{status || 'Delivered'}</span>;
    }
    if (s.includes('sched')) {
      return <span className="status s-amber">{status || 'Scheduled'}</span>;
    }
    if (s.includes('cancel')) {
      return <span className="status s-red">{status || 'Cancelled'}</span>;
    }
    return <span className="status s-grey">{status || 'Pending'}</span>;
  };

  // Receiving status badge styling
  const getReceivingStatusBadge = (status?: string | null) => {
    if (!status) return <span>&ndash;</span>;
    const s = status.toLowerCase();
    if (s.includes('variance') || s.includes('claim') || s.includes('issue')) {
      return <span className="status s-amber">{status}</span>;
    }
    if (s.includes('await') || s.includes('pend')) {
      return <span className="status s-blue">{status}</span>;
    }
    if (s.includes('check') || s.includes('receiv') || s.includes('verif') || s.includes('done')) {
      return <span className="status s-green">{status}</span>;
    }
    return <span className="status s-grey">{status}</span>;
  };

  return (
    <div className="page active" id="deliveries">
      <div className="page-head">
        <div className="title-wrap">
          <h1>Deliveries</h1>
          <p>Track scheduled, in-transit, delivered and received orders across your locations.</p>
        </div>
        <div className="head-actions">
          <Link href="/receiving" className="btn">
            Receive Goods
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics">
        <div className="metric violet">
          <div>
            <div className="metric-label">Arriving Today</div>
            <div className="metric-value">
              {loadingSummary ? '—' : summary?.arrivingToday?.count ?? 0}
            </div>
            <div className="metric-sub">
              {loadingSummary ? 'Loading...' : summary?.arrivingToday?.eta || 'None scheduled today'}
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
            <div className="metric-label">Scheduled</div>
            <div className="metric-value">
              {loadingSummary ? '—' : summary?.scheduled?.count ?? 0}
            </div>
            <div className="metric-sub">
              {loadingSummary ? 'Loading...' : summary?.scheduled?.timeframe || 'Next 7 days'}
            </div>
          </div>
          <div className="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        </div>

        <div className="metric amber">
          <div>
            <div className="metric-label">Needs Receiving</div>
            <div className="metric-value">
              {loadingSummary ? '—' : summary?.needsReceiving?.count ?? 0}
            </div>
            <div className="metric-sub">
              {loadingSummary
                ? 'Loading...'
                : summary?.needsReceiving?.description || 'Delivered but not checked'}
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
            <div className="metric-label">Received This Week</div>
            <div className="metric-value">
              {loadingSummary ? '—' : summary?.receivedThisWeek?.count ?? 0}
            </div>
            <div className="metric-sub">
              {loadingSummary
                ? 'Loading...'
                : `${summary?.receivedThisWeek?.withVariance ?? 0} with variance`}
            </div>
          </div>
          <div className="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m5 12 5 5L20 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Toolbar Filter */}
      <div className="toolbar">
        <input
          className="field-inline search-inline"
          placeholder="Search delivery or PO"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        {/* Status Select */}
        <select
          className="field-inline"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="packing">Packing</option>
          <option value="in_transit">In Transit</option>
          <option value="delivered">Delivered</option>
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

      {/* Deliveries Table */}
      <div className="card table-wrap">
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

        <table className="table">
          <thead>
            <tr>
              <th>Delivery</th>
              <th>PO</th>
              <th>Location</th>
              <th>Scheduled / ETA</th>
              <th>Products</th>
              <th>Driver / Run</th>
              <th>Delivery Status</th>
              <th>Receiving</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loadingDeliveries ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '36px', color: 'var(--muted)' }}>
                  Loading delivery records...
                </td>
              </tr>
            ) : deliveries.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '36px', color: 'var(--muted)' }}>
                  No delivery records found matching the selected filters.
                </td>
              </tr>
            ) : (
              deliveries.map((del) => {
                const driverLines = (del.driverRun || '').split('\n');
                const driverName = driverLines[0] || '—';
                const runInfo = driverLines.slice(1).join(' ') || '';

                return (
                  <tr key={del.id}>
                    <td>
                      <span className="id-chip">{del.id}</span>
                    </td>
                    <td>
                      {del.poId ? (
                        <Link
                          href={`/purchase-orders/${del.poId}`}
                          style={{ color: 'var(--blue)', fontWeight: 600 }}
                        >
                          {del.poId}
                        </Link>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>{del.locationName || '—'}</td>
                    <td>
                      <strong>{del.scheduledEta || '—'}</strong>
                    </td>
                    <td>{del.productSummary || '—'}</td>
                    <td>
                      {driverName}
                      {runInfo && <span className="subtext">{runInfo}</span>}
                    </td>
                    <td>{getDeliveryStatusBadge(del.deliveryStatus)}</td>
                    <td>{getReceivingStatusBadge(del.receivingStatus)}</td>
                    <td>
                      <Link
                        href={`/deliveries/${del.id}`}
                        className={`btn btn-sm ${
                          (del.deliveryStatus || '').toLowerCase().includes('transit')
                            ? 'btn-primary'
                            : ''
                        }`}
                      >
                        {(del.deliveryStatus || '').toLowerCase().includes('transit')
                          ? 'Track'
                          : 'Open'}
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
  );
}
