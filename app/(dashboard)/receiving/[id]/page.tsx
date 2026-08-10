'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Page() {
  const [reportingRow, setReportingRow] = useState<string | null>('PRD-1');

  return (
    <div className="page active" id="receiving-detail">
      <div className="page-head">
        <div className="title-wrap">
          <h1>Receive PO-10476</h1>
          <p>DEL-62018 &middot; Brunswick Store &middot; Delivered today &middot; 3:06 PM</p>
        </div>
        <div className="head-actions">
          <Link href="/receiving" className="btn">&larr; Receiving Queue</Link>
          <button className="btn">View PO</button>
          <button className="btn btn-primary">Complete Receipt</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '14px' }}>
        <div className="card-head">
          <div>
            <h2>DEL-62018 &middot; PO-10476</h2>
            <p>Brunswick Store &middot; expected 31 cartons / packs</p>
          </div>
          <span className="status s-amber">Ready to Receive</span>
        </div>
        
        <div className="info-list">
          <div className="info-item"><label>Delivered / Due</label><b>Delivered today &middot; 3:06 PM</b></div>
          <div className="info-item"><label>Delivered By</label><b>Marcus &middot; Van 12</b></div>
          <div className="info-item"><label>Receiver</label><b>Jordan Mills &middot; Receiver</b></div>
          <div className="info-item"><label>Delivery Docket</label><b>DCK-88402</b></div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '14px' }}>
        <div className="card-head">
          <div>
            <h2>Receive Products</h2>
            <p>For each product choose Received, or Receive &amp; Report if there is any issue</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>4 of 4 products checked</span>
            <button className="btn btn-sm">Receive All as Good</button>
          </div>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Ordered</th>
                <th>Dispatched</th>
                <th>Status</th>
                <th>Receiving Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="primary-cell">Avocado Hass<span className="subtext">Tray 20</span></td>
                <td>5</td>
                <td>5</td>
                <td><span className={reportingRow === 'PRD-1' ? 'status pending' : 'status s-green'}>{reportingRow === 'PRD-1' ? 'Pending' : 'Received'}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="btn btn-sm" style={reportingRow === 'PRD-1' ? {} : { color: '#059669', backgroundColor: '#ecfdf5', borderColor: '#d1fae5' }} onClick={() => setReportingRow(null)}>&#10003; Received</button>
                    {reportingRow === 'PRD-1' ? null : <button className="btn btn-sm">Undo</button>}
                    <button className="btn btn-sm" style={{ color: '#b45309', backgroundColor: '#fffbeb', borderColor: '#fef3c7' }} onClick={() => setReportingRow('PRD-1')}>{reportingRow === 'PRD-1' ? 'Receive & Report' : 'Report Issue'}</button>
                  </div>
                </td>
              </tr>
              {reportingRow === 'PRD-1' && (
                <tr>
                  <td colSpan={5} style={{ padding: 0 }}>
                    <div style={{ backgroundColor: '#fffbeb', borderTop: '1px solid #fef3c7', borderBottom: '1px solid #fef3c7', padding: '16px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '16px' }}>
                        <div className="form-field" style={{ marginBottom: 0 }}>
                          <label style={{ color: '#92400e' }}>Damaged Qty</label>
                          <input type="number" defaultValue="0" />
                        </div>
                        <div className="form-field" style={{ marginBottom: 0 }}>
                          <label style={{ color: '#92400e' }}>Spoiled Qty</label>
                          <input type="number" defaultValue="0" />
                        </div>
                        <div className="form-field" style={{ marginBottom: 0 }}>
                          <label style={{ color: '#92400e' }}>Missing Qty</label>
                          <input type="number" defaultValue="0" />
                        </div>
                        <div className="form-field" style={{ marginBottom: 0 }}>
                          <label style={{ color: '#92400e' }}>Accepted Good</label>
                          <input type="number" defaultValue="5" />
                        </div>
                        <div className="form-field" style={{ marginBottom: 0 }}>
                          <label style={{ color: '#92400e' }}>Reason</label>
                          <select>
                            <option>Select reason</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="form-field" style={{ marginBottom: '16px' }}>
                        <label style={{ color: '#92400e' }}>What happened?</label>
                        <textarea placeholder="Describe the damage, spoilage, shortage or quality issue..." style={{ minHeight: '50px' }}></textarea>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <span style={{ fontSize: '11px', color: '#92400e' }}>Good quantity is calculated as dispatched minus reported issue quantities. Add photo evidence if required.</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn" onClick={() => setReportingRow(null)}>+ Photo</button>
                          <button className="btn" onClick={() => setReportingRow(null)}>Cancel</button>
                          <button className="btn btn-primary" onClick={() => setReportingRow(null)}>Save Report</button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
              <tr>
                <td className="primary-cell">Strawberries 250g<span className="subtext">12 punnet tray</span></td>
                <td>12</td>
                <td>12</td>
                <td><span className="status s-green">Received</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="btn btn-sm" style={{ color: '#059669', backgroundColor: '#ecfdf5', borderColor: '#d1fae5' }}>&#10003; Received</button>
                    <button className="btn btn-sm">Undo</button>
                    <button className="btn btn-sm" style={{ color: '#b45309', backgroundColor: '#fffbeb', borderColor: '#fef3c7' }}>Report Issue</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="primary-cell">Baby Spinach<span className="subtext">1kg bag</span></td>
                <td>8</td>
                <td>8</td>
                <td><span className="status s-green">Received</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="btn btn-sm" style={{ color: '#059669', backgroundColor: '#ecfdf5', borderColor: '#d1fae5' }}>&#10003; Received</button>
                    <button className="btn btn-sm">Undo</button>
                    <button className="btn btn-sm" style={{ color: '#b45309', backgroundColor: '#fffbeb', borderColor: '#fef3c7' }}>Report Issue</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="primary-cell">Cos Lettuce<span className="subtext">Carton 12</span></td>
                <td>6</td>
                <td>6</td>
                <td><span className="status s-green">Received</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="btn btn-sm" style={{ color: '#059669', backgroundColor: '#ecfdf5', borderColor: '#d1fae5' }}>&#10003; Received</button>
                    <button className="btn btn-sm">Undo</button>
                    <button className="btn btn-sm" style={{ color: '#b45309', backgroundColor: '#fffbeb', borderColor: '#fef3c7' }}>Report Issue</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="detail-grid">
        <div className="card">
          <div className="card-head">
            <h2>Receiving Notes &amp; Evidence</h2>
          </div>
          
          <div className="detail-body">
            <div className="form-field">
              <label>General Receiving Notes</label>
              <textarea placeholder="Add general delivery notes if required..."></textarea>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-field">
                <label>Photos / Documents</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px', border: '1px solid var(--line2)', borderRadius: '8px' }}>
                  <button className="btn btn-sm">Browse...</button>
                  <span style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: 600 }}>No files selected.</span>
                </div>
              </div>
              <div className="form-field">
                <label>Receiver</label>
                <input type="text" defaultValue="Jordan Mills &middot; Receiver" readOnly style={{ backgroundColor: '#f8fafc' }} />
              </div>
            </div>
          </div>
        </div>
        
        <aside>
          <div className="card">
            <div className="card-head">
              <h2>Receipt Summary</h2>
            </div>
            
            <div className="po-totals">
              <div className="sum-row"><span>Products Checked</span><b>4 / 4</b></div>
              <div className="sum-row"><span>Expected</span><b>31</b></div>
              <div className="sum-row"><span>Accepted Good</span><b>31</b></div>
              <div className="sum-row"><span>Damaged</span><b>0</b></div>
              <div className="sum-row"><span>Spoiled</span><b>0</b></div>
              <div className="sum-row"><span>Missing</span><b>0</b></div>
              <div className="sum-row total"><span>Variance</span><span>0 units</span></div>
            </div>
            
            <div className="detail-body" style={{paddingTop: 0}}>
              <div className="callout" style={{ backgroundColor: '#fffbeb', borderColor: '#fef3c7', color: '#92400e', marginBottom: '14px' }}>
                If any product is reported damaged, spoiled or missing, completing the receipt will automatically create the related claim.
              </div>
              
              <button className="btn btn-primary" style={{ width: '100%' }}>Complete Receipt</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
