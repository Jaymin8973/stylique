import React, { useEffect, useState } from 'react';
import { Plus, Layers3 } from 'lucide-react';
import ProductApi from '../../services/productApi';
import CollectionApi, { type CollectionPayload } from '../../services/collectionApi';
import type { Product } from '../../services/api';

const Collections: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState<'draft' | 'active'>('draft');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [collections, setCollections] = useState<any[]>([]);
  const [loadingCollections, setLoadingCollections] = useState(false);
  const [collectionsError, setCollectionsError] = useState<string | null>(null);
  const [editingCollection, setEditingCollection] = useState<any | null>(null);
  const [editSelectedIds, setEditSelectedIds] = useState<number[]>([]);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

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
      } catch (e: any) {
        console.error(e);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  const loadCollections = async () => {
    setLoadingCollections(true);
    setCollectionsError(null);
    try {
      const data = await CollectionApi.getCollections();
      setCollections(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.error(e);
      setCollectionsError(e?.response?.data?.error || e?.message || 'Failed to load collections');
    } finally {
      setLoadingCollections(false);
    }
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const toggleProduct = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploadError(null);
    setUploadingImage(true);
    try {
      const CLOUD_NAME = 'dzrkqu7l6';
      const UPLOAD_PRESET = 'Stylique Collection Image'; // create unsigned preset in Cloudinary

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
        throw new Error(data?.error?.message || 'Failed to upload image');
      }

      const url = data.secure_url || data.url;
      if (url) {
        setImageUrl(url);
      } else {
        throw new Error('No URL returned from Cloudinary');
      }
    } catch (err: any) {
      const msg = err?.message || 'Image upload failed';
      setImageUploadError(msg);
    } finally {
      setUploadingImage(false);
    }
  };

  const openEditProducts = (col: any) => {
    const currentIds = Array.isArray(col.items)
      ? col.items
          .map((it: any) => Number(it.productId))
          .filter((v: number) => !Number.isNaN(v))
      : [];
    setEditingCollection(col);
    setEditSelectedIds(currentIds);
    setEditError(null);
  };

  const toggleEditProduct = (id: number) => {
    setEditSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSaveEditProducts = async () => {
    if (!editingCollection) return;
    setSavingEdit(true);
    setEditError(null);
    try {
      const updated = await CollectionApi.updateCollection(editingCollection.id, {
        productIds: editSelectedIds,
      });
      setCollections((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      setEditingCollection(null);
      setEditSelectedIds([]);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        'Failed to update collection products';
      setEditError(msg);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleToggleStatus = async (col: any) => {
    const nextStatus = col.status === 'active' ? 'draft' : 'active';
    try {
      const updated = await CollectionApi.updateCollection(col.id, { status: nextStatus });
      setCollections((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    } catch (err: any) {
      const msg =
        err?.response?.data?.error || err?.message || 'Failed to update collection status';
      alert(msg);
    }
  };

  const handleDelete = async (col: any) => {
    if (!window.confirm(`Delete collection "${col.name}"? This cannot be undone.`)) return;
    try {
      await CollectionApi.deleteCollection(col.id);
      setCollections((prev) => prev.filter((c) => c.id !== col.id));
    } catch (err: any) {
      const msg =
        err?.response?.data?.error || err?.message || 'Failed to delete collection';
      alert(msg);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError('Collection name is required');
      return;
    }

    const payload: CollectionPayload = {
      name: name.trim(),
      description: description.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      status,
      productIds: selectedIds,
    };

    setSubmitting(true);
    try {
      await CollectionApi.createCollection(payload);
      setSuccess('Collection created successfully.');
      setName('');
      setDescription('');
      setImageUrl('');
      setStatus('draft');
      setSelectedIds([]);
      loadCollections();
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Failed to create collection';
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
            <Layers3 className="w-6 h-6 text-indigo-600" />
            Collections
          </h1>
          <p className="text-gray-500 mt-1">
            Group products into themed collections for your store front.
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
              Collection name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Summer Essentials"
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
              <option value="active">Active</option>
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
              placeholder="Curated selection of items for the new season."
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hero image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              className="block w-full text-sm text-gray-900 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-600 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-indigo-700"
            />
            {uploadingImage && (
              <p className="text-xs text-gray-500">Uploading image to Cloudinary...</p>
            )}
            {imageUploadError && (
              <p className="text-xs text-red-600">{imageUploadError}</p>
            )}
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Cloudinary URL will appear here after upload, or paste your own URL"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Assign products</span>
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
          <Plus className="w-4 h-4 mr-2" />
          {submitting ? 'Creating...' : 'Create collection'}
        </button>
      </form>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Manage collections</h2>
            <p className="text-sm text-gray-500">View, activate, or remove existing collections.</p>
          </div>
          <button
            type="button"
            onClick={loadCollections}
            className="inline-flex items-center px-3 py-1.5 rounded-md border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>

        {loadingCollections && (
          <p className="text-sm text-gray-500">Loading collections...</p>
        )}

        {collectionsError && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{collectionsError}</div>
        )}

        {!loadingCollections && !collectionsError && collections.length === 0 && (
          <p className="text-sm text-gray-500">No collections created yet.</p>
        )}

        {collections.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Name</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Status</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Products</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Created</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {collections.map((col) => {
                  const productCount = Array.isArray(col.items) ? col.items.length : 0;
                  const created = col.createdAt ? new Date(col.createdAt).toLocaleDateString() : '';
                  const isActive = col.status === 'active';
                  return (
                    <tr key={col.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">
                        <div className="font-medium text-gray-900">{col.name}</div>
                        {col.description && (
                          <div className="text-xs text-gray-500 truncate max-w-xs">{col.description}</div>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                            isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {isActive ? 'Active' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-700">{productCount}</td>
                      <td className="px-4 py-2 text-gray-500 text-xs">{created}</td>
                      <td className="px-4 py-2 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => openEditProducts(col)}
                          className="inline-flex items-center px-2 py-1 rounded-md border border-gray-300 text-xs text-gray-700 hover:bg-gray-50"
                        >
                          Edit products
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(col)}
                          className="inline-flex items-center px-2 py-1 rounded-md border border-gray-300 text-xs text-gray-700 hover:bg-gray-50"
                        >
                          {isActive ? 'Mark as draft' : 'Activate'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(col)}
                          className="inline-flex items-center px-2 py-1 rounded-md border border-red-200 text-xs text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {editingCollection && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Edit products for {editingCollection.name}
            </h3>
            {editError && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {editError}
              </div>
            )}
            <div className="border border-dashed border-gray-300 rounded-lg p-3 max-h-64 overflow-y-auto bg-gray-50">
              {products.map((p) => {
                const selected = editSelectedIds.includes(p.id as number);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleEditProduct(p.id as number)}
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
              {products.length === 0 && (
                <p className="text-sm text-gray-500">
                  No products loaded. Add products first from the Products / Upload Product pages.
                </p>
              )}
            </div>
            <div className="flex justify-end space-x-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setEditingCollection(null);
                  setEditSelectedIds([]);
                  setEditError(null);
                }}
                className="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEditProducts}
                disabled={savingEdit}
                className="px-4 py-1.5 text-sm rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-60"
              >
                {savingEdit ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collections;
