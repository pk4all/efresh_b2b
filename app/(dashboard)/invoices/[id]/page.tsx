'use client';

import React, { use } from 'react';
import Link from 'next/link';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="page active" id="invoice-detail">
      <div className="page-head">
        <div className="title-wrap">
          <h1>{id}</h1>
          <p>Issued 4 Aug 2026 &middot; Due 18 Aug 2026 &middot; Linked to PO-10463</p>
        </div>
        <div className="head-actions">
          <Link href="/invoices" className="btn">&larr; Invoices</Link>
          <button className="btn">Download PDF</button>
          <button className="btn btn-primary">Pay / Remittance</button>
        </div>
      </div>
      
      <div className="detail-grid">
        <div>
          <div className="card">
            <div className="card-head">
              <div>
                <h2>Invoice Lines</h2>
                <p>Matched against PO pricing and received quantities</p>
              </div>
              <span className="status pending">Credit Review</span>
            </div>
            <div className="table-wrap">
              <table className="table" style={{minWidth: '880px'}}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Received</th>
                    <th>PO Applied Cost</th>
                    <th>Invoice Price</th>
                    <th>Line Value</th>
                    <th>Receipt Issue</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="primary-cell">Avocado Hass<span className="subtext">Tray 20 &middot; AVH20</span></td>
                    <td>5</td>
                    <td>$27.20</td>
                    <td>$27.20</td>
                    <td>$136.00</td>
                    <td>&ndash;</td>
                  </tr>
                  <tr>
                    <td className="primary-cell">Strawberries 250g<span className="subtext">12 punnet tray &middot; STR12</span></td>
                    <td>10 good + 2 issue</td>
                    <td>$23.50</td>
                    <td>$23.50</td>
                    <td>$282.00</td>
                    <td><span className="issue-badge">1 damaged &middot; 1 spoiled</span></td>
                  </tr>
                  <tr>
                    <td className="primary-cell">Baby Spinach<span className="subtext">1kg bag &middot; SPI01</span></td>
                    <td>8</td>
                    <td>$11.90</td>
                    <td>$11.90</td>
                    <td>$95.20</td>
                    <td>&ndash;</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="card" style={{marginTop: '14px'}}>
            <div className="card-head">
              <div>
                <h2>Related Documents</h2>
                <p>Commercial chain for this invoice</p>
              </div>
            </div>
            <div className="table-wrap">
              <table className="table" style={{minWidth: '680px'}}>
                <thead>
                  <tr>
                    <th>Document</th>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Purchase Order</td>
                    <td>PO-10463</td>
                    <td>1 Aug</td>
                    <td><span className="status complete">Completed</span></td>
                    <td><Link href="/purchase-orders/PO-10463" className="link-btn open-po">Open</Link></td>
                  </tr>
                  <tr>
                    <td>Delivery</td>
                    <td>DEL-62005</td>
                    <td>4 Aug</td>
                    <td><span className="status complete">Delivered</span></td>
                    <td><button className="link-btn">Open</button></td>
                  </tr>
                  <tr>
                    <td>Goods Receipt</td>
                    <td>GRN-22041</td>
                    <td>4 Aug</td>
                    <td><span className="status pending">Variance</span></td>
                    <td><button className="link-btn">Open</button></td>
                  </tr>
                  <tr>
                    <td>Claim</td>
                    <td>CLM-3102</td>
                    <td>4 Aug</td>
                    <td><span className="status pending">Under Review</span></td>
                    <td><button className="link-btn">Open</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <aside>
          <div className="card">
            <div className="card-head">
              <h2>Invoice Summary</h2>
            </div>
            <div className="po-totals">
              <div className="sum-row"><span>Subtotal</span><b>$1,940.27</b></div>
              <div className="sum-row"><span>GST</span><b>$194.03</b></div>
              <div className="sum-row"><span>Invoice Total</span><b>$2,134.30</b></div>
              <div className="sum-row"><span>Paid</span><b>$0.00</b></div>
              <div className="sum-row"><span>Credit pending</span><b className="saving">&minus;$48.60</b></div>
              <div className="sum-row total"><span>Current Balance</span><span>$2,134.30</span></div>
            </div>
          </div>
          <div className="callout warn" style={{marginTop: '14px'}}>
            <strong>Important:</strong> the $48.60 damaged/spoiled goods claim is visible here but does not reduce the payable balance until the supplier approves the credit.
          </div>
        </aside>
      </div>
    </div>
  );
}
