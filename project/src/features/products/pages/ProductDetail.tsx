import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductApi from '../services/productApi';

// Small helper to render a label/value pair
const Detail: React.FC<{ label: string; value: any }> = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-sm font-medium text-gray-900">{value ?? '—'}</p>
  </div>
);

// Grid wrapper to ensure perfect alignment across sections
const DetailGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">{children}</div>
);

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const productId = Number(id);
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setError('Invalid product ID');
      return;
    }
    let isMounted = true;
    setLoading(true);
    setError(null);
    ProductApi.getProductById(productId)
      .then((p: any) => { if (isMounted) setProduct(p); })
      .catch((err) => { if (isMounted) setError(err?.message || 'Failed to load product'); })
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, [productId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Product Detail</h1>
        <p className="text-gray-500 mt-1">Read-only overview</p>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading product...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && product && (
        <div className="space-y-6">
          {/* 1. Product Summary */}
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <img
                  src={((product.images || product.productimage)?.find((i: any) => i.isPrimary)?.url) || product.imageUrl || 'https://via.placeholder.com/240'}
                  alt={product.productName}
                  className="w-full h-48 object-cover rounded-md border"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/240'; }}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <h2 className="text-xl font-semibold text-gray-900">{product.productName}</h2>
                <DetailGrid>
                  <Detail label="Brand" value={product.brand} />
                  <Detail label="Category" value={product.category} />
                  <Detail label="Type" value={product.productType} />
                  <Detail label="Gender" value={product.gender} />
                  <Detail label="Status" value={product.status} />
                  <Detail label="SKU / HSN" value={`${product.sku || '—'}${product.hsnCode ? ` / ${product.hsnCode}` : ''}`} />
                  <Detail label="MRP" value={`₹${product.mrp}`} />
                  <Detail label="Selling Price" value={`₹${product.sellingPrice}`} />
                </DetailGrid>
              </div>
            </div>
          </div>

          {/* 2. Descriptions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1 bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Short Description</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{product.shortDescription || '—'}</p>
            </div>
            <div className="lg:col-span-2 bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Detailed Description</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{product.description || '—'}</p>
            </div>
          </div>

          {/* 3. SEO Info */}
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">SEO Information</h3>
            <DetailGrid>
              <Detail label="Meta Title" value={product.metaTitle} />
              <Detail label="Meta Description" value={product.metaDescription} />
              <Detail label="Tags" value={product.tags} />
            </DetailGrid>
          </div>

          {/* 4. Additional Details */}
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Additional Details</h3>
            <DetailGrid>
              <Detail label="Total Stock" value={product.totalStock ?? 0} />
              <Detail label="Low Stock Alert" value={product.lowStockAlert ?? '—'} />
              <Detail label="Created" value={product.createdAt ? new Date(product.createdAt).toLocaleString() : '—'} />
              <Detail label="Updated" value={product.updatedAt ? new Date(product.updatedAt).toLocaleString() : '—'} />
              <Detail label="Shipping Weight" value={product.shippingWeight || '—'} />
              <Detail label="Package Dimensions" value={product.packageDimensions || '—'} />
              <Detail label="Return Policy" value={product.returnPolicy || '—'} />
            </DetailGrid>
          </div>

          {/* 5. Variants */}
          {Array.isArray(product.variants || product.variant) && (product.variants || product.variant).length > 0 && (
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Variants</h3>
                <p className="text-xs text-gray-500">{(product.variants || product.variant).length} variants</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {(product.variants || product.variant).map((v: any) => (
                      <tr key={v.id}>
                        <td className="px-3 py-2 text-sm text-gray-900">{v.size || '—'}</td>
                        <td className="px-3 py-2 text-sm text-gray-900">{v.color || '—'}</td>
                        <td className="px-3 py-2 text-sm text-gray-900">{v.sku || '—'}</td>
                        <td className="px-3 py-2 text-sm text-gray-900">{v.price ? `₹${v.price}` : '—'}</td>
                        <td className="px-3 py-2 text-sm text-gray-900">{typeof v.stock === 'number' ? v.stock : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. Specifications Section */}
          {(product.clothingDetail || product.footwearDetail || product.accessoryDetail) && (
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">Specifications</h3>
              {product.clothingDetail && (
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Clothing</p>
                  <DetailGrid>
                    <Detail label="Material" value={product.clothingDetail.material} />
                    <Detail label="Fabric" value={product.clothingDetail.fabric} />
                    <Detail label="Pattern" value={product.clothingDetail.pattern} />
                    <Detail label="Collar Type" value={product.clothingDetail.collarType} />
                    <Detail label="Sleeve Type" value={product.clothingDetail.sleeveType} />
                    <Detail label="Fit" value={product.clothingDetail.fit} />
                    <Detail label="Occasion" value={product.clothingDetail.occasion} />
                    <Detail label="Season" value={product.clothingDetail.season} />
                    <Detail label="Care Instructions" value={product.clothingDetail.careInstructions} />
                  </DetailGrid>
                </div>
              )}
              {product.footwearDetail && (
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Footwear</p>
                  <DetailGrid>
                    <Detail label="Type" value={product.footwearDetail.footwearType} />
                    <Detail label="Heel Height" value={product.footwearDetail.heelHeight} />
                    <Detail label="Sole Material" value={product.footwearDetail.soleMaterial} />
                    <Detail label="Upper Material" value={product.footwearDetail.upperMaterial} />
                    <Detail label="Closure" value={product.footwearDetail.closure} />
                  </DetailGrid>
                </div>
              )}
              {product.accessoryDetail && (
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Accessories</p>
                  <DetailGrid>
                    <Detail label="Type" value={product.accessoryDetail.accessoryType} />
                    <Detail label="Dimensions" value={product.accessoryDetail.dimensions} />
                    <Detail label="Weight" value={product.accessoryDetail.weight} />
                  </DetailGrid>
                </div>
              )}
            </div>
          )}

          {/* 6. Attachments (images as files) */}
          {Array.isArray(product.images || product.productimage) && (product.images || product.productimage).length > 0 && (
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Attachments</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                {(product.images || product.productimage).map((img: any) => {
                  let filename = img.url;
                  try { const u = new URL(img.url); filename = u.pathname.split('/').pop() || img.url; } catch { }
                  const ext = (filename?.split('.').pop() || '').toLowerCase();
                  const type = ext === 'pdf' ? 'PDF' : 'Image';
                  return (
                    <div key={img.id} className="rounded-md border border-gray-200 bg-white shadow-sm p-2">
                      <div className="h-24 w-full overflow-hidden rounded">
                        {type === 'Image' ? (
                          <img src={img.url} alt={filename} className="h-24 w-full object-cover" />
                        ) : (
                          <div className="h-24 w-full flex items-center justify-center bg-gray-50 text-xs text-gray-500">{type}</div>
                        )}
                      </div>
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-900 truncate" title={filename}>{filename}</p>
                        <p className="text-[10px] text-gray-500">{type}{img.isPrimary ? ' • Primary' : ''}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
