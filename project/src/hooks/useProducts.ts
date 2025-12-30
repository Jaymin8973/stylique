import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product } from '../services/api';
import ProductApi from '../services/productApi';
import toast from 'react-hot-toast';

export const useProducts = () => {
    const queryClient = useQueryClient();

    const productsQuery = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const backendData: any[] = await ProductApi.getAllProducts();
            return backendData.map((p: any) => ({
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
            })) as Product[];
        },
    });

    const createProductMutation = useMutation({
        mutationFn: (newProduct: any) =>
            ProductApi.addProduct(newProduct),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product created successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create product');
        }
    });

    const updateProductMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) =>
            ProductApi.updateProduct(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update product');
        }
    });

    const deleteProductMutation = useMutation({
        mutationFn: (id: number) => ProductApi.deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete product');
        }
    });

    return {
        products: productsQuery.data || [],
        isLoading: productsQuery.isLoading,
        isError: productsQuery.isError,
        error: productsQuery.error,
        createProduct: createProductMutation.mutateAsync,
        updateProduct: updateProductMutation.mutateAsync,
        deleteProduct: deleteProductMutation.mutateAsync,
        isCreating: createProductMutation.isPending,
        isUpdating: updateProductMutation.isPending,
        isDeleting: deleteProductMutation.isPending,
        refetch: productsQuery.refetch,
    };
};

export const useProduct = (id: number) => {
    return useQuery({
        queryKey: ['product', id],
        queryFn: () => ProductApi.getProductById(id),
        enabled: !!id,
    });
};
