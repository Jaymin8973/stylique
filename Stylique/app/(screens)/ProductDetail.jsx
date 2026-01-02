import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Dimensions, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressBar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Stars from 'react-native-stars';

import ImageGallery from '@components/ImageGallery';
import { THEME } from '@constants/Theme';
import Toast from 'react-native-toast-message';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Hooks
import { useProducts } from '@hooks/useProducts';
import { useCart } from '@hooks/useCart';
import { useWishlist } from '@hooks/useWishlist';

export default function ProductDetail() {
  const params = useLocalSearchParams();
  const id = params.id;
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width, height } = Dimensions.get("window");
  const [expand, setExpand] = useState(false);
  const [expandReviews, setExpandReviews] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [userId, setUserId] = useState(null);

  const bottomSheetRef = useRef(null);
  const recommendationsSheetRef = useRef(null);

  // Hook usage
  const { useProduct, useProductRating, useRecommendations } = useProducts();
  const { data: product, isLoading: productLoading } = useProduct(id);
  const { data: rating } = useProductRating(id);
  const { data: recommendations, isLoading: recLoading } = useRecommendations(id);

  const { addToCart, isAdding, checkInCart } = useCart();
  const { checkWishlist, toggleWishlist, isToggling: wlLoading } = useWishlist(userId);
  const { data: wlData } = checkWishlist(id);
  const isInWishlist = wlData?.isInWishlist;

  const inCart = checkInCart(id);
  const prodRating = rating || { avgRating: 4.5, totalCount: 0, ratingPercentages: {} };

  // snap points (height values)
  const snapPoints = useMemo(() => ['25%', '50%'], []);
  const recommendationSnapPoints = useMemo(() => ['70%'], []);

  const handleOpen = () => bottomSheetRef.current?.expand();
  const handleClose = () => bottomSheetRef.current?.close();

  // UserId loading
  useEffect(() => {
    const loadUserId = async () => {
      try {
        const idStr = await SecureStore.getItemAsync('userId');
        if (idStr) setUserId(Number(idStr));
      } catch { }
    };
    loadUserId();
  }, []);

  const handleToggleWishlist = async () => {
    if (!userId) {
      router.push('/(Authentication)/Login');
      return;
    }
    await toggleWishlist({ productId: id, isInWishlist });
  };

  const handleScroll = (event) => {
    const slideIndex = Math.round(
      event.nativeEvent.contentOffset.x / width
    );
    setCurrentIndex(slideIndex);
  };

  const handleAddToCart = async () => {
    if (!id || isAdding) return;
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        router.push('/(Authentication)/Login');
        return;
      }

      const cartPayload = {
        productId: Number(id),
        quantity,
      };

      if (product?.saleInfo?.salePrice) {
        cartPayload.salePrice = product.saleInfo.salePrice;
      }

      await addToCart(cartPayload);

      // Fetch recommendations after adding to cart
      // recs likely come from hook usage above, not here
      // But we can trigger opening sheet if recs exist
      if (recommendations && recommendations.length > 0) {
        recommendationsSheetRef.current?.expand();
      }
    } catch (e) {
      // toast shown by hook
    }
  };

  const handleRecommendationPress = (productId) => {
    recommendationsSheetRef.current?.close();
    router.push(`/ProductDetail?id=${productId}`);
  };

  const handleAddRecommendationToCart = async (productId) => {
    try {
      await addToCart({
        productId: Number(productId),
        quantity: 1,
      });
    } catch (e) {
      // handled
    }
  };



  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  if (!product) return <Text>Loading...</Text>;


  let colorArray = [];
  let sizeArray = [];

  try {
    colorArray = product.color ? JSON.parse(product.color) : [];
  } catch (error) {
    console.warn('Error parsing color JSON:', error);
    colorArray = [];
  }

  try {
    sizeArray = product.size ? JSON.parse(product.size) : [];
  } catch (error) {
    console.warn('Error parsing size JSON:', error);
    sizeArray = [];
  }

  const bottomSheetHeight = 90;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-white">
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: bottomSheetHeight }}>
          <StatusBar style='dark' />
          <SafeAreaView className="flex-1">
            <View className="flex-1 ">
              <View className="absolute top-12 left-5 right-5 z-10 flex-row justify-between items-center">
                <TouchableOpacity
                  className="w-12 h-12 bg-white/30 rounded-full justify-center items-center shadow-lg"
                  onPress={() => router.back()}
                >
                  <Ionicons name="chevron-back" size={25} color="#ffff" />
                </TouchableOpacity>
                <Pressable
                  className="w-12 h-12 bg-white/30 rounded-full justify-center items-center shadow-lg"
                  onPress={handleToggleWishlist}
                  disabled={wlLoading}
                >
                  <Ionicons
                    name={isInWishlist ? 'heart' : 'heart-outline'}
                    size={25}
                    color={isInWishlist ? '#e74c3c' : '#ffff'}
                  />
                </Pressable>
              </View>

              {/* Image Gallery */}
              <ImageGallery
                images={product?.images || []}
                primaryImage={product?.imageUrl}
                onImagePress={(image) => {

                }}
              />

              {/* Product Info */}
              <View className="px-5 pt-6 pb-4 ">
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    {/* Sale Badge */}
                    {product?.saleInfo && (
                      <View
                        style={{
                          backgroundColor: '#ef4444',
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                          borderRadius: 8,
                          alignSelf: 'flex-start',
                          marginBottom: 8,
                        }}
                      >
                        <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
                          {product.saleInfo.discountPercent}% OFF - {product.saleInfo.saleName}
                        </Text>
                      </View>
                    )}
                    <Text className="text-2xl font-bold text-gray-900 mb-1">{product?.productName || 'Unknown Product'}</Text>

                    {/* Price Display */}
                    {product?.saleInfo ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text
                          style={{
                            textDecorationLine: 'line-through',
                            color: '#9ca3af',
                            fontSize: 16,
                          }}
                        >
                          ₹{product.saleInfo.originalPrice}
                        </Text>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#16a34a' }}>
                          ₹{product.saleInfo.salePrice}
                        </Text>
                      </View>
                    ) : (
                      <Text className="text-lg text-gray-600 font-medium">₹{product?.sellingPrice || '0.00'}</Text>
                    )}
                  </View>
                </View>

                <View className="flex-row items-center mb-4">
                  <Stars
                    default={parseFloat(rating?.avgRating || 4.5)}
                    count={5}
                    disabled={true}
                    half={true}
                    starSize={20}
                    fullStar={<MaterialCommunityIcons name="star" size={20} color={THEME.colors.rating} />}
                    emptyStar={<MaterialCommunityIcons name="star-outline" size={20} color={THEME.colors.rating} />}
                    halfStar={<MaterialCommunityIcons name="star-half" size={20} color={THEME.colors.rating} />}
                  />
                  <Text className="text-gray-600 text-sm ml-2">({prodRating.totalCount || 0} reviews)</Text>
                </View>
              </View>

              {/* Color Selection */}
              {colorArray.length > 0 && (
                <View className="px-5 pb-4">
                  <Text className="text-base font-semibold text-gray-900 mb-3">Select Color</Text>
                  <View className="flex-row gap-3">
                    {colorArray.map((color, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => setSelectedColor(index)}
                        className={`w-12 h-12 rounded-full border-2 ${selectedColor === index ? 'border-gray-900' : 'border-gray-300'
                          }`}
                        style={{ backgroundColor: color }}
                      >
                        {selectedColor === index && (
                          <View className="w-full h-full rounded-full border-2 border-white bg-gray-900 justify-center items-center">
                            <Ionicons name="checkmark" size={16} color="white" />
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Size Selection */}
              {sizeArray.length > 0 && (
                <View className="px-5 pb-4">
                  <Text className="text-base font-semibold text-gray-900 mb-3">Select Size</Text>
                  <View className="flex-row gap-3">
                    {sizeArray.map((size, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => setSelectedSize(index)}
                        className={`px-4 py-3 rounded-lg border ${selectedSize === index
                          ? 'border-gray-900 bg-gray-900'
                          : 'border-gray-300 bg-white'
                          }`}
                      >
                        <Text className={`text-sm font-medium ${selectedSize === index ? 'text-white' : 'text-gray-900'
                          }`}>
                          {size}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Quantity Selector */}
              <View className="px-5 pb-4">
                <Text className="text-base font-semibold text-gray-900 mb-3">Quantity</Text>
                <View className="flex-row items-center gap-4">
                  <Pressable
                    onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-gray-300 justify-center items-center"
                  >
                    <Ionicons name="remove" size={20} color="#666" />
                  </Pressable>
                  <Text className="text-lg font-semibold text-gray-900 w-8 text-center">{quantity}</Text>
                  <Pressable
                    onPress={() => setQuantity(quantity + 1)}
                    disabled={product?.totalStock == quantity}
                    className="w-10 h-10 rounded-lg border border-gray-300 justify-center items-center"
                  >
                    <Ionicons name="add" size={20} color="#666" />
                  </Pressable>
                </View>
              </View>

              {/* Description */}
              <View className="px-5 pb-4">
                <View className="bg-gray-50 rounded-2xl overflow-hidden">
                  <TouchableOpacity
                    onPress={() => setExpand(!expand)}
                    className="flex-row justify-between items-center p-4"
                  >
                    <Text className="text-base font-semibold text-gray-900">Description</Text>
                    <MaterialCommunityIcons
                      name={expand ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#666"
                    />
                  </TouchableOpacity>
                  {expand && (
                    <View className="px-4 pb-4">
                      <Text className="text-gray-600 leading-relaxed">
                        {product?.description || 'No description available for this product.'}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Reviews */}
              <View className="px-5 pb-4">
                <View className="bg-gray-50 rounded-2xl overflow-hidden">
                  <TouchableOpacity
                    onPress={() => setExpandReviews(!expandReviews)}
                    className="flex-row justify-between items-center p-4"
                  >
                    <Text className="text-base font-semibold text-gray-900">Reviews</Text>
                    <MaterialCommunityIcons
                      name={expandReviews ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#666"
                    />
                  </TouchableOpacity>
                  {expandReviews && (
                    <View className="px-4 pb-4">
                      <View className="w-full flex-row justify-between items-center mb-4">
                        <View className="flex-row items-center gap-2">
                          <Text className="text-4xl font-bold text-gray-900">{prodRating.avgRating || 4.5}</Text>
                          <Text className="text-xs text-gray-500 font-medium">OUT OF 5</Text>
                        </View>

                        <View className="items-end gap-1">
                          <Stars
                            default={parseFloat(rating.avgRating || 4.5)}
                            disabled={true}
                            count={5}
                            half={true}
                            starSize={20}
                            fullStar={<MaterialCommunityIcons name="star" size={20} color={THEME.colors.rating} />}
                            emptyStar={<MaterialCommunityIcons name="star-outline" size={20} color={THEME.colors.rating} />}
                            halfStar={<MaterialCommunityIcons name="star-half" size={20} color={THEME.colors.rating} />}
                          />
                          <Text className="text-sm text-gray-500">{prodRating.totalCount || 0} ratings</Text>
                        </View>
                      </View>

                      {[5, 4, 3, 2, 1].map(star => {
                        const progressValue = ((prodRating.ratingPercentages?.[star.toString()] ?? 80) / 100);
                        const displayPercentage = prodRating.ratingPercentages?.[star.toString()] ?? "80";

                        return (
                          <View key={star} className="flex-row w-full items-center mb-2">
                            <Text className="text-sm text-gray-600 w-12">
                              {star} <MaterialCommunityIcons name="star" size={14} color={THEME.colors.rating} />
                            </Text>
                            <ProgressBar
                              progress={progressValue}
                              color={THEME.colors.rating}
                              style={{ height: 6, borderRadius: 3 }}
                              className="flex-1 mx-3"
                            />
                            <Text style={{ width: 35, textAlign: 'right' }} className="text-sm text-gray-600">
                              {displayPercentage}%
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>

        {/* Bottom Fixed Sheet */}
        <View style={[styles.bottomSheet, { height: bottomSheetHeight }]}>
          <View className="flex-row items-center justify-between w-full px-6">
            <View>
              <Text className="text-white text-sm font-medium">
                {product?.saleInfo ? 'Sale Price' : 'Price'}
              </Text>
              {product?.saleInfo ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ textDecorationLine: 'line-through', color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
                    ₹{(parseFloat(product.saleInfo.originalPrice) * quantity).toFixed(0)}
                  </Text>
                  <Text className="text-white text-xl font-bold">
                    ₹{(parseFloat(product.saleInfo.salePrice) * quantity).toFixed(0)}
                  </Text>
                </View>
              ) : (
                <Text className="text-white text-xl font-bold">₹{(parseFloat(product?.sellingPrice || 0) * quantity).toFixed(2)}</Text>
              )}
            </View>
            {inCart ? (
              <TouchableOpacity onPress={() => router.push('/(tabs)/Cart')} className="bg-white px-8 py-3 rounded-lg flex-row items-center">
                <Ionicons name="cart-outline" size={20} color={THEME.colors.primary} />
                <Text className="ml-2 font-bold text-base" style={{ color: THEME.colors.primary }}>
                  View Cart
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleAddToCart} disabled={isAdding} className="bg-white px-8 py-3 rounded-lg flex-row items-center">
                <Ionicons name="bag-check-sharp" size={20} color={THEME.colors.primary} />
                <Text className="ml-2 font-bold text-base" style={{ color: THEME.colors.primary }}>
                  {isAdding ? 'Adding...' : 'Add To Cart'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Recommendations Bottom Sheet */}
        <BottomSheet
          ref={recommendationsSheetRef}
          index={-1}
          snapPoints={recommendationSnapPoints}
          enablePanDownToClose={true}
          backdropComponent={renderBackdrop}
          backgroundStyle={{ backgroundColor: 'white' }}
          handleIndicatorStyle={{ backgroundColor: '#D1D5DB' }}
        >
          <BottomSheetView style={{ flex: 1, paddingHorizontal: 20 }}>
            <View className="mb-4">
              <Text className="text-2xl font-bold text-gray-900 mb-1">You might also like</Text>
              <Text className="text-gray-600">Similar products based on your selection</Text>
            </View>

            {recLoading ? (
              <View className="flex-1 justify-center items-center">
                <Text className="text-gray-600">Loading recommendations...</Text>
              </View>
            ) : recommendations.length === 0 ? (
              <View className="flex-1 justify-center items-center">
                <Ionicons name="search-outline" size={48} color="#D1D5DB" />
                <Text className="text-gray-600 mt-4">No recommendations available</Text>
              </View>
            ) : (
              <BottomSheetFlatList
                data={recommendations}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={{ gap: 12, marginBottom: 12 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  const primaryImage = item.imageUrl || 'https://via.placeholder.com/150';
                  return (
                    <TouchableOpacity
                      onPress={() => handleRecommendationPress(item.id)}
                      className="flex-1 bg-white rounded-2xl border border-gray-100 overflow-hidden"
                      style={{ maxWidth: '48%' }}
                    >
                      <Image
                        source={{ uri: primaryImage }}
                        style={{ width: '100%', height: 150 }}
                        resizeMode="cover"
                      />
                      <View className="p-3">
                        <Text className="text-sm font-semibold text-gray-900 mb-1" numberOfLines={2}>
                          {item.productName}
                        </Text>
                        <Text className="text-base font-bold text-gray-900 mb-2">
                          ₹{item.sellingPrice}
                        </Text>
                        {checkInCart(item.id) ? (
                          <View className="bg-gray-200 rounded-lg py-2 px-3 flex-row items-center justify-center">
                            <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
                            <Text className="text-gray-700 text-xs font-semibold ml-1">Added to Cart</Text>
                          </View>
                        ) : (
                          <TouchableOpacity
                            onPress={() => handleAddRecommendationToCart(item.id)}
                            className="bg-black rounded-lg py-2 px-3 flex-row items-center justify-center"
                          >
                            <Ionicons name="cart-outline" size={16} color="white" />
                            <Text className="text-white text-xs font-semibold ml-1">Add to Cart</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            )}
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}


const styles = StyleSheet.create({
  dot: {
    height: 10,
    width: 10,
    borderRadius: 50,
    backgroundColor: THEME.colors.text.secondary,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: THEME.colors.text.primary,
    height: 10,
    width: 10,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: THEME.colors.primary,
    borderTopLeftRadius: THEME.borderRadius.xl,
    borderTopRightRadius: THEME.borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    shadowColor: THEME.colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
});

