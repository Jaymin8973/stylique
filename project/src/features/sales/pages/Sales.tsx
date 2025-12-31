import React, { useState, useMemo } from 'react';
import { Percent, Image as ImageIcon, Search, X, Check, Filter } from 'lucide-react';
import { useProducts } from '../../products/hooks/useProducts';
import { useSales } from '../hooks/useSales';
import { SalePayload } from '../../../services/api';

const Sales: React.FC = () => {
  /* Custom Hooks */
  const { products, isLoading: loadingProducts } = useProducts();
  const { sales, isLoading: loadingSales, error: salesError, createSale, isCreating: submitting, refetch: loadSales } = useSales();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [discountType] = useState<'percent'>('percent');
  const [discountValue, setDiscountValue] = useState('');
  const [status, setStatus] = useState<'draft' | 'active'>('draft');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Product selection enhancements
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [bannerUploadError, setBannerUploadError] = useState<string | null>(null);

  // Get unique categories from products
  const categories = useMemo(() => {
    const cats = products.map((p) => p.category).filter((c) => c && c.trim() !== '');
    return ['all', ...Array.from(new Set(cats))];
  }, [products]);

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = productSearch.trim() === '' ||
        p.name.toLowerCase().includes(productSearch.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, productSearch, categoryFilter]);

  const toggleProduct = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Select all visible (filtered) products
  const selectAllVisible = () => {
    const visibleIds = filteredProducts.map((p) => p.id as number);
    setSelectedIds((prev) => {
      const combined = new Set([...prev, ...visibleIds]);
      return Array.from(combined);
    });
  };

  // Deselect all visible (filtered) products
  const deselectAllVisible = () => {
    const visibleIds = new Set(filteredProducts.map((p) => p.id as number));
    setSelectedIds((prev) => prev.filter((id) => !visibleIds.has(id)));
  };

  const handleBannerFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBannerUploadError(null);
    setUploadingBanner(true);
    try {
      const CLOUD_NAME = 'dzrkqu7l6';
      const UPLOAD_PRESET = 'Stylique Collection Image';

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        },
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error?.message || 'Failed to upload banner');
      }

      const url = data.secure_url || data.url;
      if (url) {
        setBannerUrl(url);
      } else {
        throw new Error('No URL returned from Cloudinary');
      }
    } catch (err: any) {
      const msg = err?.message || 'Banner upload failed';
      setBannerUploadError(msg);
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError('Sale name is required');
      return;
    }

    if (!discountValue.trim()) {
      setError('Discount value is required');
      return;
    }

    if (!selectedIds.length) {
      setError('Select at least one product for the sale');
      return;
    }

    const payload: SalePayload = {
      name: name.trim(),
      description: description.trim() || undefined,
      bannerUrl: bannerUrl.trim() || undefined,
      discountType,
      discountValue: discountValue.trim(),
      status,
      startAt: startAt || undefined,
      endAt: endAt || undefined,
      productIds: selectedIds,
    };

    try {
      await createSale(payload);
      setSuccess(
        status === 'active'
          ? 'Sale created and discount applied to selected products.'
          : 'Sale created as draft.'
      );
      setName('');
      setDescription('');
      setBannerUrl('');
      setDiscountValue('');
      setStatus('draft');
      setStartAt('');
      setEndAt('');
      setSelectedIds([]);
      // Sales refresh is automatic via react-query invalidation
    } catch (err: any) {
      const msg = err?.message || 'Failed to create sale';
      setError(msg);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Percent className="w-6 h-6 text-indigo-600" />
            Create Sale
          </h1>
          <p className="text-gray-500 mt-1">
            Configure a sale, automatically applying discounts to selected products.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg border border-gray-200 p-6 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sale name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Weekend Flash Sale"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'draft' | 'active')}
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="draft">Draft</option>
              <option value="active">Active (apply now)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Short description of this sale."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start date & time
            </label>
            <input
              type="datetime-local"
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End date & time
            </label>
            <input
              type="datetime-local"
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount type
            </label>
            <input
              type="text"
              value="Percentage"
              disabled
              className="mt-1 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount (% off)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="10"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <ImageIcon className="w-4 h-4" />
              Sale banner
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerFileChange}
              className="block w-full text-sm text-gray-900 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-600 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-indigo-700"
            />
            {uploadingBanner && (
              <p className="text-xs text-gray-500">Uploading banner to Cloudinary...</p>
            )}
            {bannerUploadError && (
              <p className="text-xs text-red-600">{bannerUploadError}</p>
            )}
            <input
              type="text"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Cloudinary URL will appear here after upload, or paste your own URL"
            />
          </div>
        </div>

        <div className="space-y-4">
          {/* Header with title and selected count */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Select Products</span>
              {selectedIds.length > 0 && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                  {selectedIds.length} selected
                </span>
              )}
            </div>
            {loadingProducts && (
              <span className="text-xs text-gray-400">Loading products...</span>
            )}
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search products by name..."
                className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {productSearch && (
                <button
                  type="button"
                  onClick={() => setProductSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-10 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white min-w-[150px]"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={selectAllVisible}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <Check className="h-3.5 w-3.5" />
              Select All ({filteredProducts.length})
            </button>
            <button
              type="button"
              onClick={deselectAllVisible}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Deselect All
            </button>
            {productSearch || categoryFilter !== 'all' ? (
              <span className="text-xs text-gray-500">
                Showing {filteredProducts.length} of {products.length} products
              </span>
            ) : null}
          </div>

          {/* Product Grid */}
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
            <div className="max-h-80 overflow-y-auto p-3">
              {products.length === 0 && !loadingProducts && (
                <div className="text-center py-8">
                  <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">
                    No products loaded yet. Add products first from the Products page.
                  </p>
                </div>
              )}

              {filteredProducts.length === 0 && products.length > 0 && (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">
                    No products match your search or filter.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredProducts.map((p) => {
                  const selected = selectedIds.includes(p.id as number);
                  const originalPrice = Number(p.price) || 0;
                  const discountNum = parseFloat(discountValue) || 0;
                  const discountedPrice = discountNum > 0
                    ? (originalPrice - (originalPrice * discountNum / 100)).toFixed(0)
                    : originalPrice.toFixed(0);
                  const hasDiscount = discountNum > 0 && selected;

                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => toggleProduct(p.id as number)}
                      className={`relative flex items-start gap-3 p-3 rounded-xl text-left transition-all duration-200 ${selected
                        ? 'bg-white ring-2 ring-indigo-500 shadow-md'
                        : 'bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-sm'
                        }`}
                    >
                      {/* Selection indicator */}
                      <div
                        className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center transition-all ${selected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 text-transparent'
                          }`}
                      >
                        <Check className="h-3 w-3" />
                      </div>

                      {/* Product Image */}
                      <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-gray-100">
                        {p.image_url ? (
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-gray-300" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate pr-6">
                          {p.name}
                        </h4>
                        {p.category && (
                          <span className="inline-block text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded mt-1">
                            {p.category}
                          </span>
                        )}
                        <div className="mt-1.5 flex items-center gap-2">
                          {hasDiscount ? (
                            <>
                              <span className="text-xs line-through text-gray-400">
                                ₹{originalPrice.toFixed(0)}
                              </span>
                              <span className="text-sm font-semibold text-green-600">
                                ₹{discountedPrice}
                              </span>
                              <span className="text-[9px] font-medium text-white bg-green-500 px-1.5 py-0.5 rounded-full">
                                {discountNum}% OFF
                              </span>
                            </>
                          ) : (
                            <span className="text-sm font-medium text-gray-700">
                              ₹{originalPrice.toFixed(0)}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        )}
        {success && (
          <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{success}</div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60"
        >
          {submitting ? 'Creating sale...' : 'Create sale'}
        </button>
      </form>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Existing sales</h2>
            <p className="text-sm text-gray-500">Review previously created sales.</p>
          </div>
          <button
            type="button"
            onClick={() => loadSales()}
            className="inline-flex items-center px-3 py-1.5 rounded-md border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>

        {loadingSales && (
          <p className="text-sm text-gray-500">Loading sales...</p>
        )}

        {salesError && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{(salesError as Error)?.message || 'Failed to load sales'}</div>
        )}

        {!loadingSales && !salesError && sales.length === 0 && (
          <p className="text-sm text-gray-500">No sales created yet.</p>
        )}

        {sales.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Name</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Status</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Discount</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Products</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {sales.map((sale) => {
                  const productCount = Array.isArray(sale.items) ? sale.items.length : 0;
                  const created = sale.createdAt
                    ? new Date(sale.createdAt).toLocaleDateString()
                    : '';

                  // Compute actual status based on dates
                  const now = new Date();
                  let statusColor = 'bg-gray-100 text-gray-700';
                  let statusLabel = 'Draft';

                  if (sale.status === 'active') {
                    const endAt = sale.endAt ? new Date(sale.endAt) : null;
                    const startAt = sale.startAt ? new Date(sale.startAt) : null;

                    if (endAt && endAt < now) {
                      statusColor = 'bg-red-100 text-red-800';
                      statusLabel = 'Ended';
                    } else if (startAt && startAt > now) {
                      statusColor = 'bg-blue-100 text-blue-800';
                      statusLabel = 'Upcoming';
                    } else {
                      statusColor = 'bg-green-100 text-green-800';
                      statusLabel = 'Active';
                    }
                  }

                  return (
                    <tr key={sale.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">
                        <div className="font-medium text-gray-900">{sale.name}</div>
                        {sale.description && (
                          <div className="text-xs text-gray-500 truncate max-w-xs">{sale.description}</div>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${statusColor}`}
                        >
                          {statusLabel}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-700">
                        {sale.discountType === 'percent'
                          ? `${sale.discountValue || 0}%`
                          : sale.discountValue}
                      </td>
                      <td className="px-4 py-2 text-gray-700">{productCount}</td>
                      <td className="px-4 py-2 text-gray-500 text-xs">{created}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sales;
