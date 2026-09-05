'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import ProductRow from '@/components/ProductRow';
import { getB2BProducts, getB2BCategories } from '@/lib/api';
import { useCartStore, getTierPrice } from '@/store/cartStore';
import { B2BProduct, ProductCategory, ProductsPagination } from '@/types';

export default function ProductsPage() {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<B2BProduct[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [pagination, setPagination] = useState<ProductsPagination | null>(null);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Cart store
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal);
  const tax = useCartStore((state) => state.tax);
  const total = useCartStore((state) => state.total);
  const itemCount = useCartStore((state) => state.itemCount);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initial cart load
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      setLoadingCategories(true);
      try {
        const res = await getB2BCategories();
        if (Array.isArray(res)) {
          setCategories(res);
        } else if (res?.data && Array.isArray(res.data)) {
          setCategories(res.data);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.warn('Failed to load categories:', err);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    }

    loadCategories();
  }, []);

  // Load products
  const loadProducts = useCallback(
    async (searchTerm: string, cat: string, sortVal: string, pageNum: number) => {
      setLoading(true);
      try {
        const res = await getB2BProducts({
          search: searchTerm.trim() || undefined,
          category: cat && cat !== 'All' ? cat : undefined,
          sort: sortVal || undefined,
          page: pageNum,
          limit: 20,
        });

        if (res?.data && Array.isArray(res.data)) {
          setProducts(res.data);
          if (res.pagination) {
            setPagination(res.pagination);
          } else {
            setPagination({
              total: res.data.length,
              page: pageNum,
              limit: 20,
              totalPages: 1,
            });
          }
        } else if (Array.isArray(res)) {
          setProducts(res);
          setPagination({
            total: res.length,
            page: pageNum,
            limit: 20,
            totalPages: 1,
          });
        } else {
          setProducts([]);
          setPagination(null);
        }
      } catch (err) {
        console.error('Failed to load products from API:', err);
        setProducts([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Debounced search handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    setPage(1);

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = setTimeout(() => {
      loadProducts(val, selectedCategory, sort, 1);
    }, 300);
  };

  // Category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cat = e.target.value;
    setSelectedCategory(cat);
    setPage(1);
    loadProducts(search, cat, sort, 1);
  };

  // Sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortVal = e.target.value;
    setSort(sortVal);
    setPage(1);
    loadProducts(search, selectedCategory, sortVal, 1);
  };

  // Page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    loadProducts(search, selectedCategory, sort, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Initial load
  useEffect(() => {
    loadProducts('', '', '', 1);
  }, [loadProducts]);

  return (
    <div className="page active" id="products">
      {/* Page Header */}
      <div className="page-head">
        <div className="title-wrap">
          <h1>Order Products</h1>
          <p>
            Browse your approved B2B catalogue. Slab pricing applies automatically based on quantity.
          </p>
        </div>
        <div className="head-actions">
          <Link href="/cart" className="btn btn-primary">
            View Cart <span className="nav-count" style={{ marginLeft: '4px' }}>{mounted ? itemCount : 0}</span>
          </Link>
        </div>
      </div>

      {/* Toolbar / Search & Filters */}
      <div className="toolbar" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          className="field-inline search-inline"
          placeholder="Search products or SKU..."
          style={{ minWidth: '240px', flex: '1 1 200px' }}
        />

        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="field-inline"
        >
          <option value="">
            {loadingCategories ? 'Loading categories...' : 'All Categories'}
          </option>
          {categories.map((c) => {
            const catName = typeof c === 'string' ? c : c.name;
            const catId = typeof c === 'string' ? c : c.id?.toString() || c.name;
            const countStr = typeof c !== 'string' && c.count !== undefined ? ` (${c.count})` : '';
            return (
              <option key={catId} value={catName}>
                {catName}
                {countStr}
              </option>
            );
          })}
        </select>

        <select value={sort} onChange={handleSortChange} className="field-inline">
          <option value="">Sort: Featured</option>
          <option value="name_asc">Name: A to Z</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="popular">Popular</option>
        </select>
      </div>

      {/* Main Order Grid */}
      <div className="order-grid">
        {/* Product Catalogue Card */}
        <div className="card catalog-card">
          <div className="card-head">
            <div>
              <h2>Product Catalogue</h2>
              <p>
                <span>{pagination?.total ?? products.length}</span> products available for this account
              </p>
            </div>
            <span className="status alloc">Contract Pricing Active</span>
          </div>

          <div id="catalogRows" style={{ minHeight: '300px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
                <svg
                  style={{
                    width: '28px',
                    height: '28px',
                    margin: '0 auto 12px',
                    animation: 'spin 1s linear infinite',
                  }}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
                <div>Loading products catalogue...</div>
              </div>
            ) : products.length > 0 ? (
              products.map((product) => (
                <ProductRow key={product.id} product={product} />
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
                <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px' }}>
                  No products found
                </div>
                <div style={{ fontSize: '13px' }}>
                  {search
                    ? `No products match "${search}". Try adjusting your search term or category filter.`
                    : 'No products are currently available in this category.'}
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                borderTop: '1px solid var(--line)',
              }}
            >
              <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
                Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total items)
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1 || loading}
                  className="btn"
                  style={{ padding: '6px 12px', fontSize: '13px' }}
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= pagination.totalPages || loading}
                  className="btn"
                  style={{ padding: '6px 12px', fontSize: '13px' }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Live Cart Sidebar */}
        <aside className="card sticky">
          <div className="card-head">
            <div>
              <h2>Current Cart</h2>
              <p>Live slab pricing</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {mounted && items.length > 0 && (
                <button
                  type="button"
                  className="cart-head-delete-btn"
                  title="Delete Cart"
                  aria-label="Delete Cart"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete all items from your cart?')) {
                      clearCart();
                    }
                  }}
                >
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                  </svg>
                  <span>Clear</span>
                </button>
              )}
              <span className="cart-count-pill">
                <span className="dot"></span>
                {mounted ? itemCount : 0} item{(mounted ? itemCount : 0) === 1 ? '' : 's'}
              </span>
            </div>
          </div>

          <div className="cart-items-list" style={{ maxHeight: '420px', overflowY: 'auto' }}>
            {items.length === 0 ? (
              <div className="cart-empty">
                Your cart is empty.
                <br />
                Add products from the catalogue to see applied slab pricing here.
              </div>
            ) : (
              items.map((item) => {
                const unitLabel =
                  item.unitType ||
                  item.unit_type_name ||
                  item.product?.unitType ||
                  item.product?.unit_type_name ||
                  item.product?.unit ||
                  'unit';
                const allTiers = item.product?.priceTiers || item.product?.tiers || [];
                const tiers =
                  unitLabel && allTiers.some((t) => Boolean(t.unitType))
                    ? allTiers.filter((t) => !t.unitType || t.unitType.toLowerCase() === unitLabel.toLowerCase())
                    : allTiers;
                const basePrice =
                  tiers.length > 0
                    ? Number(tiers[0].price)
                    : Number(item.product?.startingCost ?? item.product?.price ?? item.unitPrice ?? 0);
                const appliedCost = getTierPrice(item.quantity, tiers, basePrice);
                const savings = (basePrice - appliedCost) * item.quantity;
                const lineTotal = item.total || appliedCost * item.quantity;

                return (
                  <div key={item.cartItemId || `${item.productId}_${unitLabel}`} className="ci-item">
                    <div className="ci-header">
                      <strong className="ci-prod-name">{item.name || item.product?.name || item.productId}</strong>
                      <div className="ci-header-right">
                        <strong>${lineTotal.toFixed(2)}</strong>
                        <button
                          type="button"
                          className="ci-delete-btn"
                          title="Remove item from cart"
                          aria-label="Remove item from cart"
                          onClick={() => removeItem(item.cartItemId || item.id || '', item.productId, unitLabel)}
                        >
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="ci-meta">
                      {item.quantity} &times; <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{unitLabel}</span>
                    </div>

                    <div className="ci-pricing-boxes">
                      <div className="cip-box standard">
                        <small>STANDARD / {unitLabel}</small>
                        <b>${basePrice.toFixed(2)}</b>
                      </div>
                      <div className="cip-box applied">
                        <small>APPLIED / {unitLabel}</small>
                        <b>${appliedCost.toFixed(2)}</b>
                      </div>
                    </div>

                    {savings > 0 && (
                      <div className="ci-savings">
                        Best slab price applied &middot; saving <strong>${savings.toFixed(2)}</strong> on this line
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="cart-summary">
            <div className="sum-row">
              <span>Subtotal</span>
              <b>${subtotal.toFixed(2)}</b>
            </div>
            <div className="sum-row">
              <span>GST (10%)</span>
              <b>${tax.toFixed(2)}</b>
            </div>
            <div className="sum-row total">
              <span>Order Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Link
              href="/cart"
              className={`btn btn-primary btn-block ${items.length === 0 ? 'disabled' : ''}`}
              style={{
                pointerEvents: items.length === 0 ? 'none' : 'auto',
                opacity: items.length === 0 ? 0.6 : 1,
              }}
            >
              Review Cart &amp; Create PO
            </Link>
            <div className="cart-note">
              <strong>Applied Cost Price</strong> is the tier rate your business pays once the qualifying slab is calculated.
            </div>
          </div>
        </aside>
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
