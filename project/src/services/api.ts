// API service for communicating with the backend
// Converted to frontend-only: use in-memory data instead of HTTP calls

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  lowStockAlert:number;
}

export interface Order {
  id: number;
  customer_name: string;
  customer_email: string;
  product_id: number;
  product_name?: string;
  quantity: number;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  lowStockProducts: number;
}

class ApiService {
  private base = (import.meta as any).env?.VITE_API_BASE || (window as any).VITE_API_BASE || 'http://localhost:5001';

  private mapFromServer(p: any): Product {
    const imgs = p?.images || p?.productimage || [];
    const primary = Array.isArray(imgs) ? (imgs.find((i: any) => i.isPrimary) || imgs[0]) : undefined;
    return {
      id: p.id,
      name: p.productName ?? '',
      description: p.description ?? '',
      price: p.sellingPrice ? Number(p.sellingPrice) : 0,
      stock: p.totalStock ? Number(p.totalStock) : 0,
      lowStockAlert: p.lowStockAlert ? Number(p.lowStockAlert) : 0,
      category: p.category ?? '',
      image_url: primary?.url ?? '',
      created_at: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
      updated_at: p.updatedAt ? new Date(p.updatedAt).toISOString() : new Date().toISOString(),
    };
  }

  private mapToServer(payload: Partial<Product>): any {
    const body: any = {};
    if (payload.name !== undefined) body.productName = payload.name;
    if (payload.description !== undefined) body.description = payload.description;
    if (payload.price !== undefined) body.sellingPrice = String(payload.price);
    if (payload.stock !== undefined) body.totalStock = String(payload.stock);
    if (payload.category !== undefined) body.category = payload.category;
    if (payload.image_url !== undefined) {
      body.images = payload.image_url ? [{ url: payload.image_url, isPrimary: true }] : [];
    }
    return body;
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    const res = await fetch(`${this.base}/api/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    return (Array.isArray(data) ? data : []).map((p) => this.mapFromServer(p));
  }

  async getProduct(id: number): Promise<Product> {
    const res = await fetch(`${this.base}/api/products/${id}`);
    if (res.status === 404) throw new Error('Product not found');
    if (!res.ok) throw new Error('Failed to fetch product');
    const data = await res.json();
    return this.mapFromServer(data);
  }

  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const res = await fetch(`${this.base}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.mapToServer(product)),
    });
    if (!res.ok) throw new Error('Failed to create product');
    const data = await res.json();
    return this.mapFromServer(data);
  }

  async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
    const res = await fetch(`${this.base}/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.mapToServer(product)),
    });
    if (res.status === 404) throw new Error('Product not found');
    if (!res.ok) throw new Error('Failed to update product');
    const data = await res.json();
    return this.mapFromServer(data);
  }

  async deleteProduct(id: number): Promise<void> {
    const res = await fetch(`${this.base}/api/products/${id}`, { method: 'DELETE' });
    if (res.status === 404) throw new Error('Product not found');
    if (!res.ok) throw new Error('Failed to delete product');
    return;
  }

  // Order methods
  async getOrders(): Promise<Order[]> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${this.base}/api/orders/admin`, {
      headers,
    });

    if (res.status === 401 || res.status === 403) {
      throw new Error('Unauthorized');
    }
    if (!res.ok) {
      throw new Error('Failed to fetch orders');
    }

    const data = await res.json();
    return Array.isArray(data) ? (data as Order[]) : [];
  }

  // Dashboard methods
  async getDashboardStats(): Promise<DashboardStats> {
    const [all, orders] = await Promise.all([
      this.getProducts(),
      this.getOrders().catch(() => [] as Order[]),
    ]);

    const totalProducts = all.length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const lowStockProducts = all.filter((p) => p.stock < 10).length;

    return { totalProducts, totalOrders, totalRevenue, lowStockProducts };
  }
}

export const apiService = new ApiService();
