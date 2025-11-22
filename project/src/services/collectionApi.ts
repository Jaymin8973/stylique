import axiosClient from '../api/axiosClient';

export interface CollectionPayload {
  name: string;
  description?: string;
  imageUrl?: string;
  status?: 'draft' | 'active';
  productIds?: number[];
}

const CollectionApi = {
  createCollection: async (payload: CollectionPayload) => {
    const res = await axiosClient.post('/api/collections', payload);
    return res.data;
  },
  getCollections: async () => {
    const res = await axiosClient.get('/api/collections');
    return res.data as any[];
  },
  updateCollection: async (id: number, payload: Partial<CollectionPayload>) => {
    const res = await axiosClient.put(`/api/collections/${id}`, payload);
    return res.data;
  },
  deleteCollection: async (id: number) => {
    const res = await axiosClient.delete(`/api/collections/${id}`);
    return res.data;
  },
};

export default CollectionApi;
