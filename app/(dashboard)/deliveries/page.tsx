'use client';

import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="page active" id="deliveries">
      <div className="page-head">
        <div className="title-wrap">
          <h1>Deliveries</h1>
          <p>Track scheduled, in-transit, delivered and received orders across your locations.</p>
        </div>
        <div className="head-actions">
          <Link href="/receiving" className="btn">Receive Goods</Link>
        </div>
      </div>
      
      <div className="metrics">
        <div className="metric violet">
          <div><div className="metric-label">Arriving Today</div><div className="metric-value">1</div><div className="metric-sub">ETA 2:00-4:00 PM</div></div>
          <div className="metric-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z"/><circle cx="7" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></svg></div>
        </div>
        <div className="metric blue">
          <div><div className="metric-label">Scheduled</div><div className="metric-value">3</div><div className="metric-sub">Next 7 days</div></div>
          <div className="metric-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
        </div>
        <div className="metric amber">
          <div><div className="metric-label">Needs Receiving</div><div className="metric-value">1</div><div className="metric-sub">Delivered but not checked</div></div>
          <div className="metric-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
        </div>
        <div className="metric green">
          <div><div className="metric-label">Received This Week</div><div className="metric-value">5</div><div className="metric-sub">2 with variance</div></div>
          <div className="metric-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 12 5 5L20 7"/></svg></div>
        </div>
      </div>
      
      <div className="toolbar">
        <input className="field-inline search-inline" placeholder="Search delivery or PO" />
        <select className="field-inline" defaultValue="All Statuses">
          <option>All Statuses</option>
          <option>Scheduled</option>
          <option>In Transit</option>
          <option>Delivered</option>
          <option>Received</option>
        </select>
        <select className="field-inline" defaultValue="All Locations">
          <option>All Locations</option>
          <option>Brunswick Store</option>
          <option>Richmond Store</option>
        </select>
      </div>
      
      <div className="card table-wrap">
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
            <tr>
              <td><span className="id-chip">DEL-62018</span></td>
              <td>PO-10476</td>
              <td>Brunswick Store</td>
              <td><strong>Today 2:00-4:00 PM</strong></td>
              <td>9 &middot; 31 cartons</td>
              <td>Marcus<span className="subtext">Run R-408</span></td>
              <td><span className="status delivery">In Transit</span></td>
              <td><span className="status pending">Awaiting</span></td>
              <td><Link href="/deliveries/DEL-62018" className="btn btn-sm btn-primary">Track</Link></td>
            </tr>
            <tr>
              <td><span className="id-chip">DEL-62026</span></td>
              <td>PO-10482</td>
              <td>Brunswick Store</td>
              <td>8 Aug 8:00-10:00</td>
              <td>14 &middot; 48 cartons</td>
              <td>&ndash;</td>
              <td><span className="status packing">Packing</span></td>
              <td>&ndash;</td>
              <td><Link href="/deliveries/DEL-62026" className="btn btn-sm">View</Link></td>
            </tr>
            <tr>
              <td><span className="id-chip">DEL-62005</span></td>
              <td>PO-10463</td>
              <td>Brunswick Store</td>
              <td>4 Aug 10:42 AM</td>
              <td>22 &middot; 64 cartons</td>
              <td>Luca<span className="subtext">Run R-401</span></td>
              <td><span className="status complete">Delivered</span></td>
              <td><span className="status pending">Variance Claim</span></td>
              <td><Link href="/deliveries/DEL-62005" className="btn btn-sm">Open</Link></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
