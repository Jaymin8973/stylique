export interface ProductPayload {
  gender: string;
  productName: string;
  brand: string;
  shortDescription: string;
  imageUrl: string;
  mrp: number;
  sellingPrice: number;
  discountPercent: number;
  sku: string;
  hsnCode: string;
  totalStock: number;
  lowStockAlert: number;
  metaTitle: string;
  metaDescription: string;
  tags: string;
  productTypeId: number;
  categoryId: number;
  subcategoryId: number;
}

export interface ProductResponse extends ProductPayload {
  id: number;
  createdAt: string;
  updatedAt: string;
}
