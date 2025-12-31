import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState, useMemo } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { THEME } from '@constants/Theme';
import * as SecureStore from 'expo-secure-store';
import { useProducts } from '@hooks/useProducts';
import { useWishlist } from '@hooks/useWishlist';
import ProductCard from '@components/ProductCard';

const AlllProducts = () => {
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('name');

    const router = useRouter();
    const [userId, setUserId] = useState(null);

    // Clothing-only store categories
    const categories = ['All', 'Topwear', 'Bottomwear', 'Dresses', 'Ethnicwear', 'Winterwear'];
    const params = useLocalSearchParams()
    const subcategory = params.subcategory

    // Query Hooks
    const { products: allProducts, isLoading: allLoading, useSubCategoryProducts } = useProducts();
    const { data: subCatProducts, isLoading: subLoading } = useSubCategoryProducts(subcategory);

    const data = subcategory ? (subCatProducts || []) : allProducts;
    const loading = subcategory ? subLoading : allLoading;

    // Filter Logic
    const filteredData = useMemo(() => {
        if (!data) return [];
        let filtered = [...data];

        // Filter by search text
        if (searchText) {
            filtered = filtered.filter(item =>
                item.productName.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        // Filter by category
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(item =>
                item.category.toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        // Sort products
        switch (sortBy) {
            case 'name':
                filtered.sort((a, b) => a.productName.localeCompare(b.productName));
                break;
            case 'price-low':
                filtered.sort((a, b) => Number(a.sellingPrice) - Number(b.sellingPrice));
                break;
            case 'price-high':
                filtered.sort((a, b) => Number(b.sellingPrice) - Number(a.sellingPrice));
                break;
        }
        return filtered;
    }, [data, searchText, selectedCategory, sortBy]);

    const { useUserWishlist, toggleWishlist } = useWishlist(userId);
    const { data: wishlistItemsData = [] } = useUserWishlist();

    // Map objects to IDs if hook returns objects, or just use IDs.
    // Looking at useWishlist.js: `return res.data || []`. 
    // Usually backend returns list of objects like { productId: 123, ... }.
    // Let's assume we need to extract IDs if the hook returns full objects.
    // In `Wishlist.jsx`, we just used `wishlistItems`.
    // In `AlllProducts.jsx`, previous code mapped: `response.data.map(item => item.productId)`.
    // So we should do the same here.
    const wishlistItems = useMemo(() => {
        return Array.isArray(wishlistItemsData) ? wishlistItemsData.map(item => item.productId || item.id) : [];
    }, [wishlistItemsData]);


    /* Removed fetchUserWishlist and toggleWishlist manual functions 
       and replaced toggleWishlist usage below with hook's toggleWishlist wrapper */

    const handleToggleWishlist = async (productId) => {
        try {
            // Wrapper to match signature expected by ProductCard if needed, 
            // or just pass `toggleWishlist` directly if ProductCard handles object args?
            // ProductCard likely expects `toggleWishlist(id)`.
            // My hook `toggleWishlist` expects `{ productId, isInWishlist }`.
            const isInWishlist = wishlistItems.includes(productId);
            await toggleWishlist({ productId, isInWishlist });
        } catch (e) {
            console.error(e);
        }
    };




    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color={THEME.colors.primary} />
                <Text className="mt-4 text-gray-600">Loading products...</Text>
            </View>
        );
    }


    return (
        <View className="flex-1 bg-white">
            {/* Fixed Header Section - Absolutely Positioned */}
            <View className="absolute top-0 left-0 right-0 bg-white z-10 shadow-sm">
                {/* Search Bar */}
                <View className="px-5 pt-4 pb-3">
                    <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
                        <Ionicons name="search" size={20} color="#343434" />
                        <TextInput
                            className="flex-1 ml-3 text-gray-700"
                            placeholder="Search products..."
                            value={searchText}
                            onChangeText={setSearchText}
                            placeholderTextColor="#999"
                        />
                        {searchText.length > 0 && (
                            <Pressable onPress={() => setSearchText('')}>
                                <Ionicons name="close-circle" size={20} color="#666" />
                            </Pressable>
                        )}
                    </View>
                </View>

                {/* Category Filters */}
                <View className="px-5 pb-3 bg-white border-b border-gray-100">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View className="flex-row gap-3">
                            {categories.map((category) => (
                                <Pressable
                                    key={category}
                                    onPress={() => setSelectedCategory(category)}
                                    className={`px-5 py-2 rounded-full ${selectedCategory === category
                                        ? 'bg-[#343434]'
                                        : 'bg-gray-100'
                                        }`}
                                >
                                    <Text
                                        className={`font-medium ${selectedCategory === category
                                            ? 'text-white'
                                            : 'text-gray-700'
                                            }`}
                                    >
                                        {category}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </View>

            {/* Scrollable Products Section - With Top Padding */}
            <View className="flex-1 px-5 pt-32">
                {filteredData.length === 0 ? (
                    <View className="flex-1 justify-center items-center">
                        <Ionicons name="search-outline" size={48} color="#ccc" />
                        <Text className="mt-4 text-gray-400 text-center">
                            {searchText || selectedCategory !== 'All'
                                ? 'No products found'
                                : 'No products available'}
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredData}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) =>
                            item?.productId?.toString() || item?.id?.toString() || index.toString()
                        }

                        numColumns={2}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        renderItem={({ item, index }) => {
                            const productId = item?.productId || item?.id || index;
                            return (
                                <ProductCard
                                    item={item}
                                    wishlistItems={wishlistItems}
                                    toggleWishlist={handleToggleWishlist}
                                />
                            );
                        }}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    productCard: {
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    productImage: {
        width: '100%',
        height: 200,
        contentFit: 'cover',
    },
});

export default AlllProducts