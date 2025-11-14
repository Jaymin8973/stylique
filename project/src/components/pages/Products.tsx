import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Filter, Download, Upload, Eye, Edit, Trash2, Package, AlertTriangle, TrendingUp, RefreshCw } from 'lucide-react';
import { type Product } from '../../services/api';
import ProductApi from '../../services/productApi';

const PLACEHOLDER_IMG = 'https://via.placeholder.com/100';

const isSafeImageUrl = (url?: string) => {
  if (!url) return false;
  if (url.startsWith('blob:')) return false;
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

const Products: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Delete state
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const backendData: any[] = await ProductApi.getAllProducts();
      const mapped: Product[] = backendData.map((p: any) => ({
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
    } catch (err: any) {
      setError(err?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = (product.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || (product.category || '').toLowerCase() === selectedCategory;
      // Derive status: low_stock if stock < 10, out_of_stock if 0, else active
      const derivedStatus = product.stock <= 0 ? 'out_of_stock' : (product.stock < product.lowStockAlert ? 'low_stock' : 'active');
      const matchesStatus = selectedStatus === 'all' || derivedStatus === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, selectedCategory, selectedStatus]);

  const totalValue = useMemo(() => {
    return products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0);
  }, [products]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'low_stock': return 'bg-red-100 text-red-800';
      case 'out_of_stock': return 'bg-gray-300 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'low_stock': return 'Low Stock';
      case 'out_of_stock': return 'Out of Stock';
      default: return status;
    }
  };

  const deriveStatus = (stock: number) => (stock <= 0 ? 'out_of_stock' : (stock < 10 ? 'low_stock' : 'active'));

  const deleteProduct = async (id: number) => {
    if (!confirm('Delete this product? This action cannot be undone.')) return;
    setDeletingId(id);
    setDeleteError(null);
    try {
      await ProductApi.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (e: any) {
      setDeleteError(e?.message || 'Failed to delete product');
      alert(`Failed to delete: ${e?.message || 'Unknown error'}`);
    } finally {
      setDeletingId(null);
    }
  };

  const exportCSV = () => {
    const rows = filteredProducts.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      stock: p.stock,
      price: p.price,
      status: deriveStatus(p.stock),
      image_url: p.image_url,
      created_at: p.created_at,
      updated_at: p.updated_at,
    }));
    const headers = Object.keys(rows[0] || {
      id: '', name: '', category: '', stock: '', price: '', status: '', image_url: '', created_at: '', updated_at: ''
    });
    const csv = [headers.join(','), ...rows.map(r => headers.map(h => {
      const val = (r as any)[h] ?? '';
      const s = String(val).replace(/"/g, '""');
      return /[",\n]/.test(s) ? `"${s}"` : s;
    }).join(','))].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'products.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">Manage your product catalog and inventory</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={loadProducts} className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" title="Refresh">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button onClick={exportCSV} className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" title="Export CSV">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" disabled>
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </button>
          <a href="/upload" className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </a>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.filter(p => deriveStatus(p.stock) === 'active').length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">{products.filter(p => deriveStatus(p.stock) === 'low_stock').length}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalValue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
            />
          </div>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
          >
            <option value="all">All Categories</option>
            {/* categories are free text from DB; keep a few quick filters */}
            <option value="electronics">Electronics</option>
            <option value="footwear">Footwear</option>
            <option value="clothing">Clothing</option>
            <option value="accessories">Accessories</option>
          </select>
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading && (
          <div className="p-6 text-sm text-gray-500">Loading products...</div>
        )}
        {error && (
          <div className="p-6 text-sm text-red-600">{error}</div>
        )}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => {
                  const status = deriveStatus(product.stock);
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img 
                            src={isSafeImageUrl(product.image_url) ? product.image_url as string : PLACEHOLDER_IMG}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover mr-3"
                            referrerPolicy="no-referrer"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMG; }}
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              <a href={`/products/${product.id}`} className="hover:underline">{product.name}</a>
                            </div>
                            <div className="text-xs text-gray-500">ID: {product.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.category || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${status === 'low_stock' ? 'text-red-600' : 'text-gray-900'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{(product.price || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
                          {getStatusText(status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-gray-400 hover:text-gray-600" title="View" onClick={() => (window.location.href = `/products/${product.id}`)}>
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600" title="Edit" onClick={() => { window.location.href = `/upload/${product.id}`; }}>
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className={`text-gray-400 hover:text-red-600 ${deletingId === product.id ? 'opacity-50 cursor-not-allowed' : ''}`} title="Delete" onClick={() => deleteProduct(product.id)} disabled={deletingId === product.id}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No products found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Edit Modal removed - editing now redirects to /upload/:id */}

      {deleteError && (
        <p className="text-sm text-red-600">{deleteError}</p>
      )}
    </div>
  );
};

export default Products;