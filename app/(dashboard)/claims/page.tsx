'use client';

import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="page active" id="claims">
      <div className="page-head">
        <div className="title-wrap">
          <h1>Claims &amp; Credits</h1>
          <p>Damage, spoilage and shortage claims generated from goods receiving, with credit status against invoices.</p>
        </div>
        <div className="head-actions">
          <button className="btn">Export Claims</button>
        </div>
      </div>
      
      <div className="metrics">
        <div className="metric amber">
          <div><div className="metric-label">Open Claims</div><div className="metric-value">2</div><div className="metric-sub">$87.40 requested</div></div>
          <div className="metric-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
        </div>
        <div className="metric blue">
          <div><div className="metric-label">Under Review</div><div className="metric-value">1</div><div className="metric-sub">$48.60</div></div>
          <div className="metric-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
        </div>
        <div className="metric green">
          <div><div className="metric-label">Credits Approved</div><div className="metric-value">$326</div><div className="metric-sub">This month</div></div>
          <div className="metric-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
        </div>
        <div className="metric violet">
          <div><div className="metric-label">Average Resolution</div><div className="metric-value">1.4d</div><div className="metric-sub">Last 30 days</div></div>
          <div className="metric-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 12 5 5L20 7"/></svg></div>
        </div>
      </div>
      
      <div className="card table-wrap">
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
            <tr>
              <td><span className="id-chip">CLM-3102</span></td>
              <td>GRN-22041</td>
              <td>PO-10463<span className="subtext">INV-98214</span></td>
              <td>4 Aug &middot; Jordan Mills</td>
              <td><span className="issue-badge">1 damaged &middot; 1 spoiled</span><span className="subtext">Strawberries 250g</span></td>
              <td><strong>$48.60</strong></td>
              <td><span className="status pending">Under Review</span></td>
              <td>Pending</td>
              <td><button className="btn btn-sm" id="openClaimBtn">Open</button></td>
            </tr>
            <tr>
              <td><span className="id-chip">CLM-3088</span></td>
              <td>GRN-21976</td>
              <td>PO-10410<span className="subtext">INV-98122</span></td>
              <td>28 Jul &middot; Jordan Mills</td>
              <td><span className="issue-badge">2 missing</span><span className="subtext">Blueberries 125g</span></td>
              <td><strong>$38.80</strong></td>
              <td><span className="status alloc">Accepted</span></td>
              <td><span className="status complete">CR-8821</span></td>
              <td><button className="btn btn-sm">View Credit</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="card" style={{marginTop: '14px'}}>
        <div className="card-head">
          <div>
            <h2>CLM-3102 &middot; Claim Detail</h2>
            <p>Created automatically from GRN-22041</p>
          </div>
          <span className="status pending">Under Review</span>
        </div>
        <div className="detail-grid" style={{padding: '14px'}}>
          <div>
            <div className="table-wrap">
              <table className="table" style={{minWidth: '650px'}}>
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
                  <tr>
                    <td className="primary-cell">Strawberries 250g<span className="subtext">12 punnet tray</span></td>
                    <td>Damaged</td>
                    <td>1</td>
                    <td>$24.30</td>
                    <td>$24.30</td>
                  </tr>
                  <tr>
                    <td className="primary-cell">Strawberries 250g</td>
                    <td>Spoiled</td>
                    <td>1</td>
                    <td>$24.30</td>
                    <td>$24.30</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <aside>
            <div className="callout">
              <strong>Evidence attached:</strong> 2 photos + receiver note. Supplier has until 8 Aug 5:00 PM to respond.
            </div>
            <div className="callout warn" style={{marginTop: '10px'}}>
              Invoice balance remains unchanged until the credit note is approved and issued.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
