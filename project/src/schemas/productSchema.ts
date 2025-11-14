import { z } from "zod";


export const ProductFormSchema = z.object({
    productName: z.string().min(1, "Required"),
    brand: z.string().min(1, "Required"),
    productType: z.string().min(1, "Required"),
    gender: z.string().min(1, "Required"),
    category: z.string().min(1, "Required"),
    subcategory: z.string().min(1, "Required"),
    mrp: z.string().min(1, "Required"),
    sellingPrice: z.string().min(1, "Required"),
    discountPercent: z.string().optional(),
    sku: z.string().min(1, "Required"),
    hsnCode: z.string().optional(),
    totalStock: z.string().min(1, "Required"),
    shortDescription: z.string().min(1, "Required"),
    description: z.string().min(1, "Required"),
    lowStockAlert: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    tags: z.string().optional(),
    imageUrl: z.string().optional(),
    // Variants
    variants: z.array(
        z.object({
            size: z.string().optional(),
            color: z.string().optional(),
            stock: z.string().min(1),
            price: z.string().min(1),
        })
    ),
    // Product-type-specific details
    clothing: z.any().optional(),
    footwear: z.any().optional(),
    accessory: z.any().optional(),
});


export type ProductFormValues = z.infer<typeof ProductFormSchema>;