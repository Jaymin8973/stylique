import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import API from '../../Api';
import { THEME } from '../../constants/Theme';
import * as SecureStore from 'expo-secure-store';

const AlllProducts = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('name');
    const [wishlistItems, setWishlistItems] = useState([]);
    const [ratings, setRatings] = useState({});
    const router = useRouter();
    const [userId, setUserId] = useState(null);
    const categories = ['All', "clothing", "footwear", "accessories", "Sports"];
    const params = useLocalSearchParams()
    const subcategory = params.subcategory


    useEffect(() => {
        if (subcategory) {

            fetchsubCatProducts();
        } else {

            fetchProducts();
        }
    }, [subcategory]);


    useEffect(() => {
        const loadUserId = async () => {
            try {
                const id = await SecureStore.getItemAsync('userId');
                if (id) setUserId(Number(id));
            } catch (e) {
                console.log(e);
            }
        };
        loadUserId();
    }, []);



    useEffect(() => {
        if (userId) fetchUserWishlist();
    }, [userId]);

    useEffect(() => {
        filterAndSortProducts();
    }, [data, searchText, selectedCategory, sortBy]);

    useEffect(() => {
        if (!filteredData || !filteredData.length) return;
        const ids = filteredData
            .map((item) => item?.productId || item?.id)
            .filter(Boolean);
        ids.forEach((pid) => {
            if (!ratings[pid]) {
                fetchRatingForProduct(pid);
            }
        });
    }, [filteredData, ratings]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await API.get('api/products/all');
            setData(response.data);
            setFilteredData(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            // Handle error gracefully
        } finally {
            setLoading(false);
        }
    };

    const fetchsubCatProducts = async () => {
        try {
            setData('')
            setLoading(true);
            const response = await API.post('api/products/subcat', { subcategory });
            setData(response.data);
            // setFilteredData(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };


    const fetchRatingForProduct = async (productId) => {
        try {
            if (!productId) return;
            const res = await API.get(`/rating/${productId}`);
            setRatings((prev) => ({
                ...prev,
                [productId]: res.data || { avgRating: 0, totalCount: 0 },
            }));
        } catch (error) {
            setRatings((prev) => ({
                ...prev,
                [productId]: { avgRating: 0, totalCount: 0 },
            }));
        }
    };

    const fetchUserWishlist = async () => {
        try {
            if (!userId) return;
            const response = await API.get(`/wishlist/user/${userId}`);

            const wishlistProductIds = response.data.map(item => item.productId);
            setWishlistItems(wishlistProductIds);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    };

    const toggleWishlist = async (productId) => {
        try {
            if (!userId) return;
            const isInWishlist = wishlistItems.includes(productId);

            if (isInWishlist) {
                // Remove from wishlist
                await API.post('/wishlist/remove', { user_id: userId, productId });
                setWishlistItems(wishlistItems.filter(id => id !== productId));
            } else {
                // Add to wishlist
                await API.post('/wishlist/add', { user_id: userId, productId });
                setWishlistItems([...wishlistItems, productId]);
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        }
    };

    const filterAndSortProducts = () => {
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
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
        }

        setFilteredData(filtered);
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
                            const ratingInfo = ratings[productId];
                            const avgRating = ratingInfo?.avgRating ?? 0;

                            return (
                                <Pressable
                                    onPress={() => router.push({
                                        pathname: 'ProductDetail',
                                        params: { id: item?.productId || item?.id || index }
                                    })}
                                    className="mb-4"
                                    style={{ width: '48%' }}
                                >
                                    <View className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                                        <View className="relative">
                                            <Image
                                                source={{
                                                    uri: item.imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400'
                                                }}
                                                style={styles.productImage}
                                            />
                                            <Pressable
                                                onPress={() => toggleWishlist(item?.productId || item?.id)}
                                                className="absolute top-2 left-2 bg-white/90 rounded-full p-2"
                                            >
                                                <Ionicons
                                                    name={wishlistItems.includes(item?.productId || item?.id) ? 'heart' : 'heart-outline'}
                                                    size={18}
                                                    color={wishlistItems.includes(item?.productId || item?.id) ? '#e74c3c' : '#343434'}
                                                />
                                            </Pressable>
                                            {(item?.totalStock > 0) && (
                                                <View className="absolute top-2 right-2 bg-[#343434] px-2 py-1 rounded-full">
                                                    <Text className="text-white text-xs font-medium">
                                                        {item?.totalStock > 10 ? 'In Stock' : 'Limited'}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                        <View className="p-3">
                                            <Text className="font-semibold text-gray-800 mb-1" numberOfLines={1}>
                                                {item?.productName || 'Unknown Product'}
                                            </Text>
                                            <Text className="text-sm text-gray-500 mb-2">
                                                {item?.brand || 'Stylique'}
                                            </Text>
                                            <View className="flex-row justify-between items-center">
                                                <Text className="text-lg font-bold text-gray-900">
                                                    ₹{item?.sellingPrice || '0.00'}
                                                </Text>
                                                <View className="flex-row items-center">
                                                    <Ionicons name="star" size={14} color="#FFA500" />
                                                    <Text className="text-xs text-gray-600 ml-1">
                                                        {avgRating ? avgRating.toFixed(1) : '0.0'}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </Pressable>
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