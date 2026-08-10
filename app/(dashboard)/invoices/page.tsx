'use client';

import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="page active" id="invoices">
      <div className="page-head">
        <div className="title-wrap">
          <h1>Invoices</h1>
          <p>See pending, due and overdue invoices linked back to purchase orders and goods receipts.</p>
        </div>
        <div className="head-actions">
          <button className="btn">Download Statement</button>
          <button className="btn">Export CSV</button>
        </div>
      </div>
      
      <div className="metrics">
        <div className="metric blue">
          <div><div className="metric-label">Outstanding</div><div className="metric-value">$5,440</div><div className="metric-sub">7 open invoices</div></div>
          <div className="metric-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a2.5 2.5 0 0 0 0 5H14a2.5 2.5 0 0 1 0 5H7"/></svg></div>
        </div>
        <div className="metric amber">
          <div><div className="metric-label">Due Within 14 Days</div><div className="metric-value">$4,180</div><div className="metric-sub">4 invoices</div></div>
          <div className="metric-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
        </div>
        <div className="metric red">
          <div><div className="metric-label">Overdue</div><div className="metric-value">$1,260</div><div className="metric-sub">2 invoices</div></div>
          <div className="metric-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
        </div>
        <div className="metric green">
          <div><div className="metric-label">Available Credit</div><div className="metric-value">$9,560</div><div className="metric-sub">Limit $15,000</div></div>
          <div className="metric-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 12 5 5L20 7"/></svg></div>
        </div>
      </div>
      
      <div className="card" style={{marginBottom: '14px'}}>
        <div className="card-head">
          <div><h2>Account Aging</h2><p>Payment terms follow each PO</p></div>
          <span className="status pending">Next due 10 Aug</span>
        </div>
        <div className="card-body">
          <div className="age-grid">
            <div className="age-box"><label>Current</label><b>$2,020</b></div>
            <div className="age-box"><label>1-30 Days</label><b>$2,160</b></div>
            <div className="age-box"><label>31-60 Days</label><b>$900</b></div>
            <div className="age-box"><label>60+ Days</label><b style={{color: 'var(--red)'}}>$360</b></div>
          </div>
          <div style={{marginTop: '12px', fontSize: '9.5px', color: 'var(--muted)'}}>Credit used: $5,440 of $15,000</div>
          <div className="credit-meter"><span></span></div>
        </div>
      </div>
      
      <div className="toolbar">
        <input className="field-inline search-inline" placeholder="Search invoice or PO" />
        <select className="field-inline" defaultValue="All Statuses">
          <option>All Statuses</option>
          <option>Pending</option>
          <option>Due Soon</option>
          <option>Overdue</option>
          <option>Paid</option>
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
            <tr>
              <td><span className="id-chip">INV-98214</span></td>
              <td>PO-10463</td>
              <td>GRN-22041<span className="subtext">DEL-62005</span></td>
              <td>4 Aug</td>
              <td>18 Aug</td>
              <td>$2,134.30</td>
              <td><span className="status pending">$48.60 claim</span></td>
              <td><strong>$2,134.30</strong></td>
              <td><span className="status pending">Pending</span></td>
              <td><Link href="/invoices/INV-98214" className="btn btn-sm open-invoice">View</Link></td>
            </tr>
            <tr>
              <td><span className="id-chip">INV-98172</span></td>
              <td>PO-10421</td>
              <td>GRN-21988</td>
              <td>27 Jul</td>
              <td>10 Aug</td>
              <td>$918.45</td>
              <td>&ndash;</td>
              <td><strong>$918.45</strong></td>
              <td><span className="status pending">Due Soon</span></td>
              <td><Link href="/invoices/INV-98172" className="btn btn-sm open-invoice">View</Link></td>
            </tr>
            <tr>
              <td><span className="id-chip">INV-98088</span></td>
              <td>PO-10391</td>
              <td>GRN-21944</td>
              <td>18 Jul</td>
              <td>1 Aug</td>
              <td>$720.00</td>
              <td>&ndash;</td>
              <td><strong style={{color: 'var(--red)'}}>$720.00</strong></td>
              <td><span className="status danger">Overdue 6d</span></td>
              <td><Link href="/invoices/INV-98088" className="btn btn-sm open-invoice">View</Link></td>
            </tr>
            <tr>
              <td><span className="id-chip">INV-97941</span></td>
              <td>PO-10320</td>
              <td>GRN-21890</td>
              <td>4 Jul</td>
              <td>18 Jul</td>
              <td>$540.00</td>
              <td>&ndash;</td>
              <td><strong style={{color: 'var(--red)'}}>$540.00</strong></td>
              <td><span className="status danger">Overdue 20d</span></td>
              <td><Link href="/invoices/INV-97941" className="btn btn-sm open-invoice">View</Link></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
