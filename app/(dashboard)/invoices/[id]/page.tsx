'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import {
  getB2BInvoiceById,
  InvoiceDetail,
} from '@/lib/api';

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams?.id || '';

  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Format currency
  const formatCurrency = (val?: number | null) => {
    if (val === undefined || val === null || isNaN(val)) return '$0.00';
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 2,
    }).format(val);
  };

  // Format display date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Fetch invoice details directly from API
  const fetchInvoice = useCallback(async (invoiceId: string) => {
    if (!invoiceId) return;
    try {
      setLoading(true);
      setError(null);
      const res: any = await getB2BInvoiceById(invoiceId);
      const data = res?.data || res;
      if (data && (data.id || data.lines || data.summary)) {
        setInvoice({
          id: data.id || invoiceId,
          issueDate: data.issueDate || data.invoiceDate,
          dueDate: data.dueDate,
          poId: data.poId,
          status: data.status || data.statusText || 'Pending',
          lines: data.lines || [],
          relatedDocuments: data.relatedDocuments || [],
          summary: data.summary || {
            subtotal: data.subtotal,
            gst: data.gst,
            invoiceTotal: data.amount || data.invoiceTotal,
            paid: data.paid || 0,
            creditPending: data.creditPending,
            currentBalance: data.balance || data.currentBalance || data.amount,
          },
          alerts: data.alerts || [],
        });
      } else {
        setError('Invoice not found.');
        setInvoice(null);
      }
    } catch (err: any) {
      console.error('Failed to load invoice details:', err);
      setError(err.message || 'Failed to fetch invoice details.');
      setInvoice(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchInvoice(id);
    }
  }, [id, fetchInvoice]);

  const handleDownloadPdf = () => {
    alert(`Downloading PDF for invoice ${id || invoice?.id}...`);
  };

  const handlePayRemittance = () => {
    alert(`Opening payment and remittance options for ${id || invoice?.id}...`);
  };

  if (loading) {
    return (
      <div className="page active" id="invoice-detail">
        <div className="page-head">
          <div className="title-wrap">
            <h1>{id || 'Loading Invoice...'}</h1>
            <p>Fetching invoice details...</p>
          </div>
          <div className="head-actions">
            <Link href="/invoices" className="btn">&larr; Invoices</Link>
          </div>
        </div>
        <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'var(--muted)' }}>
          Loading invoice data...
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="page active" id="invoice-detail">
        <div className="page-head">
          <div className="title-wrap">
            <h1>{id || 'Invoice Not Found'}</h1>
            <p style={{ color: 'var(--red)' }}>{error || 'Unable to load this invoice.'}</p>
          </div>
          <div className="head-actions">
            <Link href="/invoices" className="btn">&larr; Back to Invoices</Link>
            <button className="btn" onClick={() => fetchInvoice(id)}>Retry</button>
          </div>
        </div>
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
          <p style={{ color: 'var(--muted)', marginBottom: '12px' }}>
            The requested invoice record could not be retrieved from the server.
          </p>
          <Link href="/invoices" className="btn btn-primary">
            View All Invoices
          </Link>
        </div>
      </div>
    );
  }

  const lines = invoice.lines || [];
  const relatedDocs = invoice.relatedDocuments || [];
  const summary = invoice.summary || {};
  const alerts = invoice.alerts || [];

  return (
    <div className="page active" id="invoice-detail">
      <div className="page-head">
        <div className="title-wrap">
          <h1>{invoice.id}</h1>
          <p>
            Issued {formatDate(invoice.issueDate)} &middot; Due {formatDate(invoice.dueDate)}
            {invoice.poId && ` · Linked to ${invoice.poId}`}
          </p>
        </div>
        <div className="head-actions">
          <Link href="/invoices" className="btn">&larr; Invoices</Link>
          <button className="btn" onClick={handleDownloadPdf}>Download PDF</button>
          <button className="btn btn-primary" onClick={handlePayRemittance}>Pay / Remittance</button>
        </div>
      </div>

      <div className="detail-grid">
        <div>
          {/* Invoice Lines */}
          <div className="card">
            <div className="card-head">
              <div>
                <h2>Invoice Lines</h2>
                <p>Matched against PO pricing and received quantities</p>
              </div>
              <span className="status pending">{invoice.status || 'Pending'}</span>
            </div>
            <div className="table-wrap">
              <table className="table" style={{ minWidth: '880px' }}>
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
                  {lines.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)' }}>
                        No line items found for this invoice.
                      </td>
                    </tr>
                  ) : (
                    lines.map((line, index) => {
                      const prod = line.product || { name: 'Product Item' };
                      const subtext = [prod.unit, prod.sku].filter(Boolean).join(' · ');

                      return (
                        <tr key={index}>
                          <td className="primary-cell">
                            {prod.name}
                            {subtext && <span className="subtext">{subtext}</span>}
                          </td>
                          <td>{line.received ?? '—'}</td>
                          <td>{formatCurrency(line.poAppliedCost)}</td>
                          <td>{formatCurrency(line.invoicePrice)}</td>
                          <td>{formatCurrency(line.lineValue)}</td>
                          <td>
                            {line.receiptIssue ? (
                              <span className="issue-badge">{line.receiptIssue}</span>
                            ) : (
                              <span>&ndash;</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Related Documents */}
          <div className="card" style={{ marginTop: '14px' }}>
            <div className="card-head">
              <div>
                <h2>Related Documents</h2>
                <p>Commercial chain for this invoice</p>
              </div>
            </div>
            <div className="table-wrap">
              <table className="table" style={{ minWidth: '680px' }}>
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
                  {relatedDocs.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '20px', color: 'var(--muted)' }}>
                        No related documents linked.
                      </td>
                    </tr>
                  ) : (
                    relatedDocs.map((doc, idx) => {
                      const docLink =
                        doc.link ||
                        (doc.type?.toLowerCase().includes('purchase') || doc.id.startsWith('PO-')
                          ? `/purchase-orders/${doc.id}`
                          : doc.type?.toLowerCase().includes('delivery') || doc.id.startsWith('DEL-')
                          ? '/deliveries'
                          : doc.type?.toLowerCase().includes('receipt') || doc.id.startsWith('GRN-')
                          ? '/receiving'
                          : doc.type?.toLowerCase().includes('claim') || doc.id.startsWith('CLM-')
                          ? '/claims'
                          : '#');

                      const statusClass =
                        (doc.status || '').toLowerCase().includes('complete') || (doc.status || '').toLowerCase().includes('deliver')
                          ? 'complete'
                          : 'pending';

                      return (
                        <tr key={idx}>
                          <td>{doc.type}</td>
                          <td>{doc.id}</td>
                          <td>{formatDate(doc.date)}</td>
                          <td>
                            <span className={`status ${statusClass}`}>{doc.status || 'Active'}</span>
                          </td>
                          <td>
                            {docLink && docLink !== '#' ? (
                              <Link href={docLink} className="link-btn">
                                Open
                              </Link>
                            ) : (
                              <button className="link-btn">Open</button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Aside Summary */}
        <aside>
          <div className="card">
            <div className="card-head">
              <h2>Invoice Summary</h2>
            </div>
            <div className="po-totals">
              <div className="sum-row">
                <span>Subtotal</span>
                <b>{formatCurrency(summary.subtotal)}</b>
              </div>
              <div className="sum-row">
                <span>GST</span>
                <b>{formatCurrency(summary.gst)}</b>
              </div>
              <div className="sum-row">
                <span>Invoice Total</span>
                <b>{formatCurrency(summary.invoiceTotal)}</b>
              </div>
              <div className="sum-row">
                <span>Paid</span>
                <b>{formatCurrency(summary.paid)}</b>
              </div>
              {summary.creditPending !== undefined && summary.creditPending > 0 && (
                <div className="sum-row">
                  <span>Credit pending</span>
                  <b className="saving">&minus;{formatCurrency(summary.creditPending)}</b>
                </div>
              )}
              <div className="sum-row total">
                <span>Current Balance</span>
                <span>{formatCurrency(summary.currentBalance ?? summary.invoiceTotal)}</span>
              </div>
            </div>
          </div>

          {/* Alerts / Callouts */}
          {alerts.length > 0 ? (
            alerts.map((alertItem, aIdx) => (
              <div key={aIdx} className="callout warn" style={{ marginTop: '14px' }}>
                {alertItem.type && <strong>{alertItem.type}: </strong>}
                {alertItem.message}
              </div>
            ))
          ) : (
            <div className="callout warn" style={{ marginTop: '14px' }}>
              <strong>Important:</strong> Any open damaged/spoiled goods claims linked to this invoice will not reduce the payable balance until the credit is approved.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
