'use client';

import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="page active" id="dashboard">
      
      <div className="page-head">
        <div className="title-wrap"><h1>Dashboard</h1><p>Customer purchasing, accounts and delivery overview for Melbourne Fresh Foods.</p></div>
        <div className="head-actions"><Link href="/products" className="btn btn-primary" >+ Start New Order</Link><Link href="/receiving" className="btn" >Receive Delivery</Link></div>
      </div>
      <div className="metrics">
        <div className="metric blue"><div><div className="metric-label">Open Purchase Orders</div><div className="metric-value">6</div><div className="metric-sub">$8,420 currently open</div></div><div className="metric-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 3h9l3 3v15H6z"/><path d="M9 10h6M9 14h6"/></svg></div></div>
        <div className="metric amber"><div><div className="metric-label">Invoices Due</div><div className="metric-value">$4,180</div><div className="metric-sub">4 invoices within 14 days</div></div><div className="metric-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 3h14v18l-3-2-3 2-3-2-3 2-2-1z"/><path d="M8 9h8"/></svg></div></div>
        <div className="metric red"><div><div className="metric-label">Overdue</div><div className="metric-value">$1,260</div><div className="metric-sub">2 invoices require attention</div></div><div className="metric-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 17h.01"/></svg></div></div>
        <div className="metric violet"><div><div className="metric-label">Deliveries This Week</div><div className="metric-value">4</div><div className="metric-sub">Next today · 2:00–4:00 PM</div></div><div className="metric-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z"/></svg></div></div>
      </div>
      <div className="two-col">
        <div className="card">
          <div className="card-head"><div><h2>Recent Purchase Orders</h2><p>Latest order activity</p></div><Link href="/purchase-orders" className="link-btn" >View all →</Link></div>
          <div className="table-wrap"><table className="table" style={{ minWidth: "720px" }}><thead><tr><th>PO</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th>Delivery</th><th></th></tr></thead><tbody>
            <tr><td><span className="id-chip">PO-10482</span></td><td>7 Aug 2026</td><td>14</td><td><strong>$1,482.60</strong></td><td><span className="status alloc">Confirmed</span></td><td>Today</td><td><Link href="/purchase-orders/PO-10482" className="link-btn open-po">View</Link></td></tr>
            <tr><td><span className="id-chip">PO-10476</span></td><td>5 Aug 2026</td><td>9</td><td><strong>$786.10</strong></td><td><span className="status delivery">In Transit</span></td><td>Today</td><td><Link href="/deliveries/DEL-62018" className="link-btn" >Track</Link></td></tr>
            <tr><td><span className="id-chip">PO-10463</span></td><td>1 Aug 2026</td><td>22</td><td><strong>$2,134.30</strong></td><td><span className="status complete">Completed</span></td><td>4 Aug</td><td><Link href="/purchase-orders/PO-10482" className="link-btn open-po">View</Link></td></tr>
          </tbody></table></div>
        </div>
        <div className="card">
          <div className="card-head"><div><h2>Accounts Snapshot</h2><p>Current balance and aging</p></div><Link href="/invoices" className="link-btn" >Invoices →</Link></div>
          <div className="card-body">
            <div style={{ fontSize: "9.5px", color: "var(--muted)" }}>Total outstanding</div><div style={{ fontSize: "26px", fontWeight: 760, margin: "4px 0 13px" }}>$5,440.00</div>
            <div className="age-grid"><div className="age-box"><label>Current</label><b>$2,020</b></div><div className="age-box"><label>1–30 days</label><b>$2,160</b></div><div className="age-box"><label>31–60</label><b>$900</b></div><div className="age-box"><label>60+</label><b style={{ color: "var(--red)" }}>$360</b></div></div>
            <div className="callout warn" style={{ marginTop: "10px" }}><strong>2 overdue invoices.</strong> Oldest invoice is 20 days overdue.</div>
          </div>
        </div>
      </div>
      <div className="section-head"><h2>Upcoming Deliveries</h2><small>Receiving status updates automatically</small></div>
      <div className="card table-wrap"><table className="table"><thead><tr><th>Delivery</th><th>PO</th><th>ETA</th><th>Products</th><th>Location</th><th>Status</th><th>Receiving</th><th></th></tr></thead><tbody>
        <tr><td><span className="id-chip">DEL-62018</span></td><td>PO-10476</td><td><strong>Today 2:00–4:00 PM</strong></td><td>9 · 31 cartons</td><td>Brunswick Store</td><td><span className="status delivery">In Transit</span></td><td><span className="status pending">Awaiting</span></td><td><Link href="/deliveries/DEL-62018" className="btn btn-sm" >Track</Link></td></tr>
        <tr><td><span className="id-chip">DEL-62026</span></td><td>PO-10482</td><td>8 Aug 8:00–10:00 AM</td><td>14 · 48 cartons</td><td>Brunswick Store</td><td><span className="status packing">Packing</span></td><td>—</td><td><Link href="/deliveries/DEL-62018" className="btn btn-sm" >View</Link></td></tr>
      </tbody></table></div>
    
    </div>
  );
}
