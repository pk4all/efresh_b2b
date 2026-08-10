'use client';

import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="page active" id="developer">
      
  <div className="page-head"><Link href="/" className="back-btn"  data-bound="1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m15 18-6-6 6-6"></path></svg></Link><div className="title-wrap"><h1>Developer Notes</h1><p>Mobile UX and backend rules for implementation.</p></div></div>
  <details className="card accordion" open><summary>1. Mobile navigation &amp; state</summary><div className="inside"><ul><li>Primary bottom navigation: Home, Order, Purchase Orders, Deliveries and More. Secondary modules live under More to reduce visual load.</li><li>Nested details use a visible back button and preserve the user’s last list/filter state.</li><li>Cart state must persist while moving between pages. Mobile back/navigation must not lose quantities, delivery details or payment selections.</li></ul></div></details>
  <details className="card accordion"><summary>2. Ordering &amp; slab pricing</summary><div className="inside"><ul><li>Product cards show unit, standard cost, current Applied Cost Price, active slab and the next slab opportunity.</li><li>Server re-prices all lines before PO submission and stores immutable standard-cost + applied-cost + slab snapshots.</li><li>Do not expose internal supplier/eFresh acquisition cost; “Applied Cost Price” means the B2B customer’s payable purchase cost.</li></ul></div></details>
  <details className="card accordion"><summary>3. Payment &amp; split payment</summary><div className="inside"><ul><li>Payment-term choices shown at checkout: 7 Day · Direct Debit, or On Order.</li><li>On Order supports a single payment method or Split Payment. Split rows contain method + allocated amount and must sum exactly to PO total before submission.</li><li>7 Day Direct Debit stores the chosen account/payment-term snapshot on the PO; actual collection is governed by invoice balance and approved credits at due date.</li></ul></div></details>
  <details className="card accordion"><summary>4. Receiving queue → detail</summary><div className="inside"><ul><li>Receive Goods first lists all PO/deliveries due for receiving: Ready, Partially Received and Arriving Today.</li><li>Opening a record loads the selected delivery/PO receiving detail. Each line has only two primary actions: Received, or Receive &amp; Report.</li><li>Received accepts full dispatched quantity as good. Receive &amp; Report expands the issue editor for damaged, spoiled and missing quantities, reason, notes and evidence.</li><li>GRN cannot complete until every dispatched product line has been handled. Variances generate claims automatically.</li></ul></div></details>
  <details className="card accordion"><summary>5. Mobile API / performance</summary><div className="inside"><ul><li>Use paged list APIs and compact mobile payloads. Do not load full PO/invoice history on app start.</li><li>Prefetch likely next detail only when network conditions allow. Product search should debounce; cart quantity updates should be optimistic but server-validated.</li><li>Maintain idempotency keys on PO submit, payment initiation and GRN completion because mobile networks can retry requests.</li></ul></div></details>

    </div>
  );
}
