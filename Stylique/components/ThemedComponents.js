import React from 'react';
import { View, Text, Pressable, TextInput, ScrollView, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME, getSearchBarStyle, getCategoryFilterStyle, getProductCardStyle } from '../constants/Theme';

// Themed Container
export const ThemedContainer = ({ children, style = {}, className = '' }) => (
  <View 
    className={`flex-1 bg-white ${className}`}
    style={style}
  >
    {children}
  </View>
);

// Themed Section
export const ThemedSection = ({ children, padding = true, className = '' }) => (
  <View className={`${padding ? 'px-5' : ''} ${className}`}>
    {children}
  </View>
);

// Themed Search Bar
export const ThemedSearchBar = ({ 
  value, 
  onChangeText, 
  placeholder = 'Search...', 
  onClear,
  className = '' 
}) => (
  <View className={`${getSearchBarStyle().className} ${className}`}>
    <Ionicons name="search" size={20} color="#666" />
    <TextInput
      className="flex-1 ml-3 text-gray-700"
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor="#999"
    />
    {value?.length > 0 && onClear && (
      <Pressable onPress={onClear}>
        <Ionicons name="close-circle" size={20} color="#666" />
      </Pressable>
    )}
  </View>
);

// Themed Category Filter
export const ThemedCategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory,
  className = '' 
}) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} className={className}>
    <View className="flex-row gap-3">
      {categories.map((category) => {
        const isActive = selectedCategory === category;
        const style = getCategoryFilterStyle(isActive);
        
        return (
          <Pressable
            key={category}
            onPress={() => onSelectCategory(category)}
            className={style.className}
          >
            <Text>
              {category}
            </Text>
          </Pressable>
        );
      })}
    </View>
  </ScrollView>
);

// Themed Product Card
export const ThemedProductCard = ({ 
  product, 
  onPress, 
  style = {},
  className = '' 
}) => {
  const cardStyle = getProductCardStyle({ style });
  
  return (
    <Pressable onPress={onPress} className={`mb-4 ${className}`}>
      <View {...cardStyle}>
        <View className="relative">
          <Image 
            source={{ 
              uri: product?.imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400' 
            }} 
            style={styles.productImage} 
          />
          {(product?.stockQuantity > 0) && (
            <View className="absolute top-2 right-2 bg-green-500 px-2 py-1 rounded-full">
              <Text className="text-white text-xs font-medium">
                In Stock
              </Text>
            </View>
          )}
        </View>
        <View className="p-3">
          <Text className="font-semibold text-gray-800 mb-1" numberOfLines={1}>
            {product?.name || 'Unknown Product'}
          </Text>
          <Text className="text-sm text-gray-500 mb-2">
            {product?.brand || 'Stylique'}
          </Text>
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-bold text-gray-900">
              ${product?.price || '0.00'}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="star" size={14} color={THEME.colors.rating} />
              <Text className="text-xs text-gray-600 ml-1">4.5</Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

// Themed Header
export const ThemedHeader = ({ title, onBack, className = '' }) => (
  <View className={`flex-row items-center justify-between px-5 pt-4 pb-3 ${className}`}>
    {onBack && (
      <Pressable onPress={onBack} className="rounded-full p-2">
        <Ionicons name="chevron-back" size={24} color={THEME.colors.primary} />
      </Pressable>
    )}
    <Text className="text-2xl font-bold text-gray-900 flex-1 text-center">
      {title}
    </Text>
    <View className="w-8" /> // Spacer for centering
  </View>
);

// Themed Button
export const ThemedButton = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  icon,
  className = '' 
}) => {
  const buttonStyle = variant === 'primary' 
    ? THEME.components.button.primary 
    : THEME.components.button.secondary;
    
  return (
    <Pressable 
      onPress={onPress}
      className={`${buttonStyle.background} ${buttonStyle.textColor} px-6 py-3 rounded-xl font-medium flex-row items-center justify-center ${className}`}
    >
      {icon && <Ionicons name={icon} size={20} className="mr-2" />}
      <Text>{title}</Text>
    </Pressable>
  );
};

// Themed Badge
export const ThemedBadge = ({ 
  title, 
  variant = 'success', 
  className = '' 
}) => {
  const badgeStyle = variant === 'success' 
    ? THEME.components.badge.success 
    : THEME.components.badge.warning;
    
  return (
    <View className={`${badgeStyle.background} px-3 py-1 rounded-full ${className}`}>
      <Text className={`${badgeStyle.textColor} text-xs font-medium`}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  productImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
});

export default {
  ThemedContainer,
  ThemedSection,
  ThemedSearchBar,
  ThemedCategoryFilter,
  ThemedProductCard,
  ThemedHeader,
  ThemedButton,
  ThemedBadge
};
