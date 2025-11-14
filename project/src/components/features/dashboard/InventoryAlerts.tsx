import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Package } from 'lucide-react';
import { apiService, type Product } from '../../../services/api';

const InventoryAlerts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    apiService.getProducts()
      .then(data => { if (isMounted) setProducts(data); })
      .catch(err => { if (isMounted) setError(err?.message || 'Failed to load inventory'); })
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, []);

  const lowStock = useMemo(
    () => products.filter(p => (p.totalStock ?? 0) < 10).slice(0, 5),
    [products]
  );

  return (
    <div className="bg-white/85 backdrop-blur-sm p-6 rounded-2xl shadow-md shadow-[#C8D3FF]/40">
      <div className="flex items-center space-x-3 mb-5">
        <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
        <h2 className="text-xl font-semibold text-[#1A2A4F]">Inventory Alerts</h2>
        <a href="/products" className="ml-auto text-sm font-medium text-[#1A2A4F] hover:underline">View all</a>
      </div>
      {loading && <p className="text-sm text-[#70798B]">Loading low-stock products...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {!loading && !error && (
        <div className="space-y-4">
          {lowStock.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-4 bg-[#FEF6EC] rounded-xl shadow-sm shadow-[#FAD7A1]/30">
              <div className="flex items-center space-x-3">
                <Package className="w-4 h-4 text-[#F59E0B]" />
                <div>
                  <p className="font-medium text-[#1A2A4F]">{p.productName}</p>
                  <p className="text-sm text-[#70798B]">Category: {p.Category?.name ?? '-'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-[#F59E0B]">{p.totalStock ?? 0} left</p>
                <p className="text-xs text-[#9AA4B5]">Min: 10</p>
              </div>
            </div>
          ))}
          {lowStock.length === 0 && (
            <p className="text-sm text-[#70798B]">All good! No low-stock items.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default InventoryAlerts;