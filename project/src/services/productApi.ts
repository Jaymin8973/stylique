import axiosClient from "../api/axiosClient";
import { ProductFormValues } from "../schemas/productSchema";

const ProductApi = {
  addProduct: async (data: ProductFormValues) => {
    const res = await axiosClient.post("/api/products", data);
    return res.data;
  },

  getAllProducts: async () => {
    try {
      const res = await axiosClient.get("/api/products");
      return res.data;
      
    } catch (error) {
      console.log(error)
    }
  },

  getProductById: async (id: number) => {
    const res = await axiosClient.get(`/api/products/${id}`);
    return res.data;
  },

  deleteProduct: async (id: number) => {
    const res = await axiosClient.delete(`/api/products/${id}`);
    return res.data;
  },

  updateProduct: async (id: number, data: ProductFormValues) => {
    const res = await axiosClient.put(`/api/products/${id}`, data);
    return res.data;
  },

  bulkImportProducts: async (_file: File) => {
    return { imported: 0 };
  },
};

export default ProductApi;
