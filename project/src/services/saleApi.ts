import axiosClient from '../api/axiosClient';

export interface SalePayload {
  name: string;
  description?: string;
  bannerUrl?: string;
  discountType: 'percent';
  discountValue: string;
  status?: 'draft' | 'active';
  startAt?: string;
  endAt?: string;
  productIds: number[];
}

const SaleApi = {
  createSale: async (payload: SalePayload) => {
    const res = await axiosClient.post('/api/sales', payload);
    return res.data;
  },
  getSales: async () => {
    const res = await axiosClient.get('/api/sales');
    return res.data as any[];
  },
};

export default SaleApi;
