import React, { useEffect, useState } from 'react';
import { Percent, Image as ImageIcon } from 'lucide-react';
import ProductApi from '../../services/productApi';
import SaleApi, { type SalePayload } from '../../services/saleApi';
import type { Product } from '../../services/api';

const Sales: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [discountType] = useState<'percent'>('percent');
  const [discountValue, setDiscountValue] = useState('');
  const [status, setStatus] = useState<'draft' | 'active'>('draft');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [bannerUploadError, setBannerUploadError] = useState<string | null>(null);

  const [sales, setSales] = useState<any[]>([]);
  const [loadingSales, setLoadingSales] = useState(false);
  const [salesError, setSalesError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      setLoadingProducts(true);
      try {
        const backendData: any[] = await ProductApi.getAllProducts();
        const mapped: Product[] = (backendData || []).map((p: any) => ({
          id: p.id,
          name: p.productName ?? '',
          description: p.description ?? '',
          price: Number(p.sellingPrice ?? 0),
          stock: Number(p.totalStock ?? 0),
          lowStockAlert: Number(p.lowStockAlert ?? 0),
          category: p.category ?? '',
          image_url: p.imageUrl ?? '',
          created_at: (p.createdAt as string) ?? '',
          updated_at: (p.updatedAt as string) ?? '',
        }));
        setProducts(mapped);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  const loadSales = async () => {
    setLoadingSales(true);
    setSalesError(null);
    try {
      const data = await SaleApi.getSales();
      setSales(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.error(e);
      setSalesError(e?.response?.data?.error || e?.message || 'Failed to load sales');
    } finally {
      setLoadingSales(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  const toggleProduct = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
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

    setSubmitting(true);
    try {
      await SaleApi.createSale(payload);
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
      loadSales();
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Failed to create sale';
      setError(msg);
    } finally {
      setSubmitting(false);
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

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Apply to products</span>
            {loadingProducts && (
              <span className="text-xs text-gray-400">Loading products...</span>
            )}
          </div>

          <div className="border border-dashed border-gray-300 rounded-lg p-3 max-h-64 overflow-y-auto bg-gray-50">
            {products.length === 0 && !loadingProducts && (
              <p className="text-sm text-gray-500">
                No products loaded yet. Add products first from the Products / Upload Product pages.
              </p>
            )}
            {products.map((p) => {
              const selected = selectedIds.includes(p.id as number);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggleProduct(p.id as number)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm mb-1 transition-colors ${
                    selected
                      ? 'bg-indigo-50 border border-indigo-300 text-indigo-700'
                      : 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <span className="truncate mr-2">{p.name}</span>
                  {selected && (
                    <span className="inline-flex items-center text-[11px] px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                      Selected
                    </span>
                  )}
                </button>
              );
            })}
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
            onClick={loadSales}
            className="inline-flex items-center px-3 py-1.5 rounded-md border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>

        {loadingSales && (
          <p className="text-sm text-gray-500">Loading sales...</p>
        )}

        {salesError && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{salesError}</div>
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
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                            sale.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {sale.status === 'active' ? 'Active' : 'Draft'}
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
