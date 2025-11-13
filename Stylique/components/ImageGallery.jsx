import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/Theme';

const { width } = Dimensions.get('window');

const ImageGallery = ({ images = [], primaryImage, onImagePress }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollViewRef = useRef(null);
  
  // Combine primary image with other images, avoiding duplicates
  const allImages = React.useMemo(() => {
    const imageUrls = images.map(img => img.imageUrl);
    const displayImages = [...images];
    
    // Add primary image if it's not already in the list
    if (primaryImage && !imageUrls.includes(primaryImage)) {
      displayImages.unshift({
        imageId: 'primary',
        imageUrl: primaryImage,
        isPrimary: true,
        displayOrder: 0
      });
    }
    
    return displayImages.sort((a, b) => a.displayOrder - b.displayOrder);
  }, [images, primaryImage]);

  const currentImage = allImages[selectedIndex] || { imageUrl: primaryImage };

  const handleScroll = (event) => {
    const slideIndex = Math.round(
      event.nativeEvent.contentOffset.x / width
    );
    setSelectedIndex(slideIndex);
  };


  if (allImages.length === 0) {
    return (
      <View style={styles.container}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400' }}
          style={styles.mainImage}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Main Image Scroll */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.mainImageScroll}
      >
        {allImages.map((image, index) => (
          <Pressable
            key={image.imageId || index}
            onPress={() => onImagePress && onImagePress(image)}
            style={styles.imageSlide}
          >
            <Image 
              source={{ uri: image.imageUrl }}
              style={styles.mainImage}
            />
          </Pressable>
        ))}
      </ScrollView>

      {/* Image Indicators */}
      {allImages.length > 1 && (
        <View style={styles.indicators}>
          {allImages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === selectedIndex && styles.activeDot
              ]}
            />
          ))}
        </View>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  mainImageScroll: {
    width: '100%',
    height: 400,
  },
  imageSlide: {
    width: width,
    height: 400,
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
    borderWidth: 1,

  },
  activeDot: {
    backgroundColor: THEME.colors.primary,
    width: 20,
    borderRadius:100
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
    resizeMode: 'cover',
  },
  primaryBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  primaryText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
});

export default ImageGallery;
