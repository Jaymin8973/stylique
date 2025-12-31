import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useProducts } from '@hooks/useProducts';

const ProductCard = ({ item, wishlistItems, toggleWishlist, width = '48%' }) => {
    const router = useRouter();
    const productId = item?.productId || item?.id;
    const { useProductRating } = useProducts();
    const { data: rating } = useProductRating(productId);

    const avgRating = rating?.avgRating || 0;
    const hasSale = item?.saleInfo && item?.saleInfo?.salePrice;

    return (
        <Pressable
            onPress={() => router.push({
                pathname: 'ProductDetail',
                params: { id: productId }
            })}
            className="mb-4"
            style={{ width }}
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
                        onPress={() => toggleWishlist(productId)}
                        className="absolute top-2 left-2 bg-white/90 rounded-full p-2"
                    >
                        <Ionicons
                            name={wishlistItems.includes(productId) ? 'heart' : 'heart-outline'}
                            size={18}
                            color={wishlistItems.includes(productId) ? '#e74c3c' : '#343434'}
                        />
                    </Pressable>

                    {/* Sale Badge */}
                    {hasSale ? (
                        <View className="absolute top-2 right-2 bg-red-500 px-2 py-1 rounded-full">
                            <Text className="text-white text-xs font-bold">
                                {item.saleInfo.discountPercent}% OFF
                            </Text>
                        </View>
                    ) : (item?.totalStock > 0) && (
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
                        {hasSale ? (
                            <View className="flex-row items-center gap-2">
                                <Text className="text-lg font-bold text-green-600">
                                    ₹{item.saleInfo.salePrice}
                                </Text>
                                <Text className="text-sm text-gray-400 line-through">
                                    ₹{item.saleInfo.originalPrice}
                                </Text>
                            </View>
                        ) : (
                            <Text className="text-lg font-bold text-gray-900">
                                ₹{item?.sellingPrice || '0.00'}
                            </Text>
                        )}
                        <View className="flex-row items-center">
                            <Ionicons name="star" size={14} color="#FFA500" />
                            <Text className="text-xs text-gray-600 ml-1">
                                {avgRating ? Number(avgRating).toFixed(1) : '0.0'}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    productImage: {
        width: '100%',
        height: 200,
        contentFit: 'cover',
    },
});

export default ProductCard;
