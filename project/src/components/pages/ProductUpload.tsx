// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Upload, Plus, Trash2, Eye, Camera } from 'lucide-react';
import ProductApi from '../../services/productApi';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';

interface ProductImage {
  id: string;
  file: File | null;
  url: string;
  isPrimary: boolean;
}

interface ProductVariant {
  id: string;
  size: string;
  color: string;
  stock: number;
  price: number;
  sku: string;
}

interface ProductFormData {
  // Basic Info
  productName: string;
  brand: string;
  description: string;
  shortDescription: string;

  // Pricing
  mrp: string;
  sellingPrice: string;
  discount: string;
  tax: string;

  // SEO & Tags
  metaTitle: string;
  metaDescription: string;
  tags: string;

  // Clothing Specific
  material: string;
  fabric: string;
  pattern: string;
  collarType: string;
  sleeveType: string;
  fit: string;
  occasion: string;
  season: string;
  careInstructions: string;

  // Footwear Specific
  footwearType: string;
  heelHeight: string;
  soleMaterial: string;
  upperMaterial: string;
  closure: string;

  // Accessories Specific
  accessoryType: string;
  dimensions: string;
  weight: string;

  // Shipping & Returns
  shippingWeight: string;
  packageDimensions: string;
  returnPolicy: string;
  shippingClass: string;

  // Inventory
  sku: string;
  hsn: string;
  totalStock: string;
  lowStockAlert: string;

  // Media
  imageUrl: string;

  // Status
  status: string;
}

const ProductUpload: React.FC = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [productType, setProductType] = useState('clothing');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [gender, setGender] = useState('men');
  const [images, setImages] = useState<ProductImage[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      productName: '',
      brand: '',
      description: '',
      shortDescription: '',
      mrp: '',
      sellingPrice: '',
      discount: '',
      tax: '',
      metaTitle: '',
      metaDescription: '',
      tags: '',
      material: '',
      fabric: '',
      pattern: '',
      collarType: '',
      sleeveType: '',
      fit: '',
      occasion: '',
      season: '',
      careInstructions: '',
      footwearType: '',
      heelHeight: '',
      soleMaterial: '',
      upperMaterial: '',
      closure: '',
      accessoryType: '',
      dimensions: '',
      weight: '',
      shippingWeight: '',
      packageDimensions: '',
      returnPolicy: '',
      shippingClass: '',
      sku: '',
      hsn: '',
      totalStock: '',
      lowStockAlert: '',
      imageUrl: '',
      status: 'draft',
    },
  });

  // Watch form values for auto-calculation
  const mrpValue = watch('mrp');
  const discountValue = watch('discount');
  const taxValue = watch('tax');
  const sellingPrice = watch('sellingPrice');

  // Auto-calculate selling price when MRP, discount, or tax changes
  // Formula: (MRP - discount%) + tax% = Selling Price
  useEffect(() => {
    const mrp = parseFloat(mrpValue) || 0;
    const discount = parseFloat(discountValue) || 0;
    const tax = parseFloat(taxValue) || 0;
    if (mrp > 0) {
      // First apply discount
      const priceAfterDiscount = mrp - (mrp * discount / 100);
      // Then add tax on discounted price
      const calculatedPrice = priceAfterDiscount + (priceAfterDiscount * tax / 100);
      setValue('sellingPrice', calculatedPrice.toFixed(2));
    }
  }, [mrpValue, discountValue, taxValue, setValue]);

  const clothingCategories = {
    men: {
      'topwear': ['T-Shirts', 'Shirts', 'Polo T-Shirts', 'Hoodies & Sweatshirts', 'Jackets', 'Blazers', 'Sweaters', 'Tank Tops'],
      'bottomwear': ['Jeans', 'Trousers', 'Shorts', 'Track Pants', 'Joggers', 'Chinos'],
      'innerwear': ['Briefs', 'Boxers', 'Vests', 'Thermals'],
      'ethnicwear': ['Kurtas', 'Sherwanis', 'Nehru Jackets', 'Dhotis', 'Lungis'],
      'activewear': ['Sports T-Shirts', 'Track Suits', 'Gym Wear', 'Running Shorts'],
      'winterwear': ['Jackets', 'Coats', 'Sweaters', 'Hoodies', 'Thermals']
    },
    women: {
      'topwear': ['T-Shirts', 'Tops', 'Shirts', 'Blouses', 'Crop Tops', 'Tank Tops', 'Tunics'],
      'bottomwear': ['Jeans', 'Trousers', 'Shorts', 'Skirts', 'Palazzos', 'Leggings'],
      'dresses': ['Casual Dresses', 'Party Dresses', 'Maxi Dresses', 'Mini Dresses', 'Midi Dresses'],
      'ethnicwear': ['Sarees', 'Kurtas & Kurtis', 'Lehenga Choli', 'Salwar Suits', 'Ethnic Dresses'],
      'innerwear': ['Bras', 'Panties', 'Camisoles', 'Shapewear', 'Nightwear'],
      'activewear': ['Sports Bras', 'Yoga Pants', 'Track Suits', 'Gym Wear'],
      'winterwear': ['Jackets', 'Coats', 'Sweaters', 'Cardigans', 'Shawls']
    },
    unisex: {
      'topwear': ['T-Shirts', 'Tops', 'Shirts', 'Blouses', 'Crop Tops', 'Tank Tops', 'Tunics'],
      'bottomwear': ['Jeans', 'Trousers', 'Shorts', 'Skirts', 'Palazzos', 'Leggings'],
      'dresses': ['Casual Dresses', 'Party Dresses', 'Maxi Dresses', 'Mini Dresses', 'Midi Dresses'],
      'ethnicwear': ['Sarees', 'Kurtas & Kurtis', 'Lehenga Choli', 'Salwar Suits', 'Ethnic Dresses'],
      'innerwear': ['Bras', 'Panties', 'Camisoles', 'Shapewear', 'Nightwear'],
      'activewear': ['Sports Bras', 'Yoga Pants', 'Track Suits', 'Gym Wear'],
      'winterwear': ['Jackets', 'Coats', 'Sweaters', 'Cardigans', 'Shawls']
    }
  };

  const footwearCategories = {
    men: ['Casual Shoes', 'Formal Shoes', 'Sports Shoes', 'Sneakers', 'Sandals', 'Flip Flops', 'Boots', 'Loafers'],
    women: ['Heels', 'Flats', 'Sneakers', 'Sandals', 'Boots', 'Wedges', 'Sports Shoes', 'Ethnic Footwear'],
  };

  const accessoryCategories = {
    men: ['Watches', 'Belts', 'Wallets', 'Sunglasses', 'Bags', 'Ties', 'Cufflinks', 'Caps & Hats'],
    women: ['Jewellery', 'Watches', 'Handbags', 'Sunglasses', 'Belts', 'Scarves', 'Hair Accessories', 'Makeup'],
    unisex: ['Watches', 'Belts', 'Wallets', 'Sunglasses', 'Bags', 'Ties', 'Cufflinks', 'Caps & Hats'],
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const newImage: ProductImage = {
          id: Date.now().toString() + Math.random(),
          file,
          url: URL.createObjectURL(file),
          isPrimary: images.length === 0
        };
        setImages(prev => [...prev, newImage]);
      });
    }
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const setPrimaryImage = (id: string) => {
    setImages(prev => prev.map(img => ({ ...img, isPrimary: img.id === id })));
  };

  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: Date.now().toString(),
      size: '',
      color: '',
      stock: 0,
      price: parseFloat(sellingPrice) || 0,
      sku: ''
    };
    setVariants(prev => [...prev, newVariant]);
  };

  const updateVariant = (id: string, field: string, value: string | number) => {
    setVariants(prev => prev.map(variant =>
      variant.id === id ? { ...variant, [field]: value } : variant
    ));
  };

  const removeVariant = (id: string) => {
    setVariants(prev => prev.filter(variant => variant.id !== id));
  };

  const resetForm = () => {
    reset();
    setImages([]);
    setVariants([]);
    setCategory('');
    setSubCategory('');
    setGender('men');
    setProductType('clothing');
  };

  const onFormSubmit = async (data: ProductFormData, status: 'draft' | 'active') => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      // Basic client-side validation to avoid 400s from backend
      if (!data.sku || !String(data.sku).trim()) {
        const toast = (await import('react-hot-toast')).toast;
        toast.error('SKU is required.');
        setIsSubmitting(false);
        return;
      }

      const resolvedSubcategory = subCategory || category || 'General';

      const payload: any = {
        productName: data.productName || 'Untitled Product',
        brand: data.brand || '',
        productType: productType || '',
        gender: gender || '',
        category: category || 'General',
        subcategory: resolvedSubcategory,
        mrp: String(data.mrp || ''),
        sellingPrice: String(data.sellingPrice || ''),
        discountPercent: String(data.discount || ''),
        taxPercent: String(data.tax || ''),
        sku: data.sku || '',
        hsnCode: data.hsn || '',
        totalStock: String(data.totalStock || '0'),
        shortDescription: data.shortDescription || '',
        description: data.description || '',
        lowStockAlert: String(data.lowStockAlert || ''),
        metaTitle: data.metaTitle || '',
        metaDescription: data.metaDescription || '',
        tags: data.tags || '',
        imageUrl: data.imageUrl || '',
        status: status,

        // Clothing
        material: data.material || '',
        fabric: data.fabric || '',
        pattern: data.pattern || '',
        collarType: data.collarType || '',
        sleeveType: data.sleeveType || '',
        fit: data.fit || '',
        occasion: data.occasion || '',
        season: data.season || '',
        careInstructions: data.careInstructions || '',

        // Footwear
        footwearType: data.footwearType || '',
        heelHeight: data.heelHeight || '',
        soleMaterial: data.soleMaterial || '',
        upperMaterial: data.upperMaterial || '',
        closure: data.closure || '',

        // Accessories
        accessoryType: data.accessoryType || '',
        dimensions: data.dimensions || '',
        weight: data.weight || '',

        // Shipping & returns
        shippingWeight: data.shippingWeight || '',
        packageDimensions: data.packageDimensions || '',
        returnPolicy: data.returnPolicy || '',
        shippingClass: data.shippingClass || '',

        // Nested
        images: images.map(i => ({ url: i.url, isPrimary: !!i.isPrimary })),
        variants: variants.map(v => ({
          size: v.size || undefined,
          color: v.color || undefined,
          stock: Number(v.stock || 0),
          price: String(v.price || 0),
          sku: v.sku || undefined,
        })),
      };

      const toast = (await import('react-hot-toast')).toast;
      if (isEdit) {
        const updated = await ProductApi.updateProduct(Number(id), payload);
        toast.success(`Product updated successfully! (ID: ${updated.id})`);
      } else {
        const created = await ProductApi.addProduct(payload);
        toast.success(`Product ${status === 'draft' ? 'saved' : 'published'} successfully! (ID: ${created.id})`);
      }
      resetForm();
      navigate('/products');
    } catch (err: any) {
      const apiMsg = err?.response?.data?.error || err?.response?.data?.details || err?.message;
      setSubmitError(apiMsg || 'Failed to save product');
      const toast = (await import('react-hot-toast')).toast;
      toast.error(`Failed to save product: ${apiMsg || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prefill for edit mode
  useEffect(() => {
    const fetchAndFill = async () => {
      if (!isEdit) return;
      try {
        const p = await ProductApi.getProductById(Number(id));
        // Core
        console.log(p)
        setProductType(p.productType || 'clothing');
        setGender(p.gender || 'men');
        setCategory(p.category || '');
        setSubCategory(p.subcategory || '');

        // Reset form with fetched data
        reset({
          productName: p.productName || '',
          brand: p.brand || '',
          description: p.description || '',
          shortDescription: p.shortDescription || '',
          mrp: p.mrp || '',
          sellingPrice: p.sellingPrice || '',
          discount: p.discountPercent || '',
          tax: p.taxPercent || '',
          metaTitle: p.metaTitle || '',
          metaDescription: p.metaDescription || '',
          tags: p.tags || '',
          imageUrl: (p.images?.find((i: any) => i.isPrimary)?.url) || p.imageUrl || '',
          sku: p.sku || '',
          hsn: p.hsnCode || '',
          totalStock: p.totalStock || '',
          lowStockAlert: p.lowStockAlert || '',
          // Clothing
          material: p.clothingdetail?.material || '',
          fabric: p.clothingdetail?.fabric || '',
          pattern: p.clothingdetail?.pattern || '',
          collarType: p.clothingdetail?.collarType || '',
          sleeveType: p.clothingdetail?.sleeveType || '',
          fit: p.clothingdetail?.fit || '',
          occasion: p.clothingdetail?.occasion || '',
          season: p.clothingdetail?.season || '',
          careInstructions: p.clothingdetail?.careInstructions || '',
          // Footwear
          footwearType: p.footwearDetail?.footwearType || '',
          heelHeight: p.footwearDetail?.heelHeight || '',
          soleMaterial: p.footwearDetail?.soleMaterial || '',
          upperMaterial: p.footwearDetail?.upperMaterial || '',
          closure: p.footwearDetail?.closure || '',
          // Accessories
          accessoryType: p.accessoryDetail?.accessoryType || '',
          dimensions: p.accessoryDetail?.dimensions || '',
          weight: p.accessoryDetail?.weight || '',
          // Shipping
          shippingWeight: p.shippingWeight || '',
          packageDimensions: p.packageDimensions || '',
          returnPolicy: p.returnPolicy || '',
          shippingClass: p.shippingClass || '',
          // Status
          status: p.status || 'draft',
        });

        // Images
        if (Array.isArray(p.images)) {
          setImages(p.images.map((img: any) => ({
            id: String(img.id),
            file: null,
            url: img.url,
            isPrimary: !!img.isPrimary,
          })));
        }

        // Variants
        if (Array.isArray(p.variant)) {
          setVariants(p.variant.map((v: any) => ({
            id: String(v.id),
            size: v.size || '',
            color: v.color || '',
            stock: Number(v.stock ?? 0),
            price: Number(v.price ?? 0),
            sku: v.sku || '',
          })));
        }
      } catch (e) {
        // ignore for now
      }
    };
    fetchAndFill();
  }, [isEdit, id, reset]);

  const getCurrentCategories = () => {
    if (productType === 'clothing') return clothingCategories[gender as keyof typeof clothingCategories];
    if (productType === 'footwear') return footwearCategories[gender as keyof typeof footwearCategories];
    if (productType === 'accessories') return accessoryCategories[gender as keyof typeof accessoryCategories];
    return {};
  };

  // Helper to render category options for both object (clothing) and array (others)
  const renderCategoryOptions = () => {
    try {
      const current = getCurrentCategories();
      console.log(current)
      if (Array.isArray(current)) {
        return current.map((cat: string) => (
          <option key={cat} value={cat}>{cat}</option>
        ));
      }
      return Object.keys(current).map((cat) => (
        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
      ));
    } catch (error) {
      console.log(error.message)
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
        <p className="text-gray-600">{isEdit ? 'Update product details' : 'Create a new product listing for your marketplace'}</p>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit((data) => onFormSubmit(data, 'active'))}>
        {/* Product Type Selection */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Product Type & Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Type *</label>
              <select
                value={productType}
                onChange={(e) => {
                  setProductType(e.target.value);
                  setCategory('');
                  setSubCategory('');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="clothing">Clothing</option>
                <option value="footwear">Footwear</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
              <select
                value={gender}
                onChange={(e) => {
                  setGender(e.target.value);
                  setCategory('');
                  setSubCategory('');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="men">Men</option>
                <option value="women">Women</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSubCategory('');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Category</option>
                {renderCategoryOptions()}
              </select>
            </div>
          </div>

          {category && productType === 'clothing' && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sub Category *</label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Sub Category</option>
                {getCurrentCategories()[category]?.map((subCat: string) => (
                  <option key={subCat} value={subCat}>{subCat}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Basic Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
              <input
                type="text"
                {...register('productName', { required: 'Product name is required' })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.productName ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter product name"
              />
              {errors.productName && <p className="text-red-500 text-sm mt-1">{errors.productName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
              <input
                type="text"
                {...register('brand', { required: 'Brand is required' })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.brand ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter brand name"
              />
              {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
              <input
                type="text"
                {...register('shortDescription')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief product description (max 160 characters)"
                maxLength={160}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description *</label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Detailed product description"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
              <input
                type="url"
                {...register('imageUrl')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Product Images</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Camera className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB each)</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt="Product"
                      className={`w-full h-32 object-cover rounded-lg border-2 ${image.isPrimary ? 'border-blue-500' : 'border-gray-200'
                        }`}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setPrimaryImage(image.id)}
                        className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        title="Set as primary"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {image.isPrimary && (
                      <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        Primary
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">MRP (₹) *</label>
              <input
                type="number"
                {...register('mrp', { required: 'MRP is required' })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.mrp ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="0"
              />
              {errors.mrp && <p className="text-red-500 text-sm mt-1">{errors.mrp.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
              <input
                type="number"
                {...register('discount')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                min={0}
                max={100}
              />
            </div>



            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tax / GST (%)</label>
              <input
                type="number"
                {...register('tax')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 5, 12, 18"
                min={0}
                max={100}
              />
            </div>



            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price (₹) *</label>
              <input
                type="number"
                {...register('sellingPrice', { required: 'Selling price is required' })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 ${errors.sellingPrice ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Auto-calculated"
                readOnly
              />
              {errors.sellingPrice && <p className="text-red-500 text-sm mt-1">{errors.sellingPrice.message}</p>}

            </div>
          </div>
        </div>

        {/* Product Specific Fields */}
        {productType === 'clothing' && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Clothing Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
                <input
                  type="text"
                  {...register('material')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Cotton, Polyester"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fabric</label>
                <input
                  type="text"
                  {...register('fabric')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Denim, Silk"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pattern</label>
                <select
                  {...register('pattern')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Pattern</option>
                  <option value="solid">Solid</option>
                  <option value="striped">Striped</option>
                  <option value="checked">Checked</option>
                  <option value="printed">Printed</option>
                  <option value="floral">Floral</option>
                  <option value="geometric">Geometric</option>
                </select>
              </div>

              {(category === 'topwear' || subCategory?.includes('Shirt')) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Collar Type</label>
                  <select
                    {...register('collarType')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Collar</option>
                    <option value="round">Round Neck</option>
                    <option value="v-neck">V-Neck</option>
                    <option value="collar">Collar</option>
                    <option value="mandarin">Mandarin Collar</option>
                    <option value="henley">Henley</option>
                    <option value="boat">Boat Neck</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sleeve Type</label>
                <select
                  {...register('sleeveType')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Sleeve</option>
                  <option value="full">Full Sleeve</option>
                  <option value="half">Half Sleeve</option>
                  <option value="sleeveless">Sleeveless</option>
                  <option value="3/4">3/4 Sleeve</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fit</label>
                <select
                  {...register('fit')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Fit</option>
                  <option value="regular">Regular Fit</option>
                  <option value="slim">Slim Fit</option>
                  <option value="loose">Loose Fit</option>
                  <option value="oversized">Oversized</option>
                  <option value="skinny">Skinny Fit</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Occasion</label>
                <select
                  {...register('occasion')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Occasion</option>
                  <option value="casual">Casual</option>
                  <option value="formal">Formal</option>
                  <option value="party">Party</option>
                  <option value="sports">Sports</option>
                  <option value="ethnic">Ethnic</option>
                  <option value="work">Work</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Season</label>
                <select
                  {...register('season')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Season</option>
                  <option value="summer">Summer</option>
                  <option value="winter">Winter</option>
                  <option value="monsoon">Monsoon</option>
                  <option value="all-season">All Season</option>
                </select>
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Care Instructions</label>
                <textarea
                  {...register('careInstructions')}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Machine wash cold, Do not bleach"
                />
              </div>
            </div>
          </div>
        )}

        {/* Footwear Details */}
        {productType === 'footwear' && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Footwear Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heel Height</label>
                <select
                  {...register('heelHeight')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Height</option>
                  <option value="flat">Flat (0-1 inch)</option>
                  <option value="low">Low (1-2 inches)</option>
                  <option value="medium">Medium (2-3 inches)</option>
                  <option value="high">High (3-4 inches)</option>
                  <option value="very-high">Very High (4+ inches)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sole Material</label>
                <input
                  type="text"
                  {...register('soleMaterial')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Rubber, Leather"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upper Material</label>
                <input
                  type="text"
                  {...register('upperMaterial')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Leather, Canvas"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Closure</label>
                <select
                  {...register('closure')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Closure</option>
                  <option value="lace-up">Lace-up</option>
                  <option value="slip-on">Slip-on</option>
                  <option value="buckle">Buckle</option>
                  <option value="velcro">Velcro</option>
                  <option value="zipper">Zipper</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Accessories Details */}
        {productType === 'accessories' && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Accessory Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Accessory Type</label>
                <select
                  {...register('accessoryType')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Type</option>
                  {getCurrentCategories().map((type: string) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions</label>
                <input
                  type="text"
                  {...register('dimensions')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 10cm x 5cm x 2cm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (grams)</label>
                <input
                  type="number"
                  {...register('weight')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        )}

        {/* Product Variants */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Product Variants</h2>
            <button
              type="button"
              onClick={addVariant}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Variant</span>
            </button>
          </div>

          {variants.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No variants added. Click "Add Variant" to create size/color combinations.</p>
          ) : (
            <div className="space-y-4">
              {variants.map((variant) => (
                <div key={variant.id} className="bg-white p-4 rounded-lg border">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                      <input
                        type="text"
                        value={variant.size}
                        onChange={(e) => updateVariant(variant.id, 'size', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="S, M, L, XL"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                      <input
                        type="text"
                        value={variant.color}
                        onChange={(e) => updateVariant(variant.id, 'color', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Red, Blue, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                      <input
                        type="number"
                        value={variant.stock}
                        onChange={(e) => updateVariant(variant.id, 'stock', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                      <input
                        type="number"
                        value={variant.price}
                        onChange={(e) => updateVariant(variant.id, 'price', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeVariant(variant.id)}
                        className="w-full px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inventory & SKU */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Inventory & SKU</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SKU *</label>
              <input
                type="text"
                {...register('sku', { required: 'SKU is required' })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.sku ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Product SKU"
              />
              {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">HSN Code</label>
              <input
                type="text"
                {...register('hsn')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="HSN Code"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Low Stock Alert</label>
              <input
                type="number"
                {...register('lowStockAlert')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Stock</label>
              <input
                type="number"
                {...register('totalStock')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10"
              />
            </div>
          </div>
        </div>

        {/* SEO & Tags */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">SEO & Tags</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
              <input
                type="text"
                {...register('metaTitle')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="SEO title for search engines"
                maxLength={60}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
              <textarea
                {...register('metaDescription')}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="SEO description for search engines"
                maxLength={160}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <input
                type="text"
                {...register('tags')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Comma-separated tags (e.g., casual, cotton, summer)"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={handleSubmit((data) => onFormSubmit(data, 'draft'))}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              {isSubmitting ? (isEdit ? 'Saving...' : 'Saving...') : (isEdit ? 'Save Changes' : 'Save as Draft')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>{isSubmitting ? (isEdit ? 'Updating...' : 'Publishing...') : (isEdit ? 'Update Product' : 'Publish Product')}</span>
            </button>
          </div>
          <button
            type="button"
            className="px-4 py-2 text-gray-500 hover:text-gray-700"
            onClick={resetForm}
          >
            Cancel
          </button>
        </div>

        {submitError && (
          <p className="text-sm text-red-600">{submitError}</p>
        )}
      </form>
    </div>
  );
};

export default ProductUpload;
