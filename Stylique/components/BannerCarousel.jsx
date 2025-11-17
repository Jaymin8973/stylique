import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');
const CARD_HEIGHT = 180;
const DOT_SIZE = 8;

const DEFAULT_BANNERS = [
  {
    id: '1',
    title: 'New Collection',
    subtitle: 'Discount 50% for the first transaction',
    cta: 'Shop Now',
    image: 'https://images.unsplash.com/photo-1520975922203-bfe1258d66dc?w=600',
    bg: '#EDE1D5'
  },
  {
    id: '2',
    title: 'Summer Sale',
    subtitle: 'Up to 40% off selected items',
    cta: 'Explore',
    image: 'https://images.unsplash.com/photo-1514996937319-344454492b37?w=600',
    bg: '#EFEAE4'
  },
  {
    id: '3',
    title: 'Trending Now',
    subtitle: 'Fresh fits you will love',
    cta: 'Discover',
    image: 'https://images.unsplash.com/photo-1520975682031-569d9b3c5a73?w=600',
    bg: '#F0E9E1'
  }
];

export default function BannerCarousel({
  banners = DEFAULT_BANNERS,
  onPressCta,
  autoPlay = true,
  interval = 3000,
}) {
  const listRef = useRef(null);
  const [index, setIndex] = useState(0);
  const autoplayRef = useRef(null);

  const scrollToSlide = (nextIndex) => {
    listRef.current?.scrollToOffset({
      offset: nextIndex * width,
      animated: true,
    });
  };

  // Autoplay Logic (rock-solid)
  useEffect(() => {
    if (!autoPlay || banners.length <= 1) return;

    autoplayRef.current = setInterval(() => {
      const nextIndex = (index + 1) % banners.length;
      scrollToSlide(nextIndex);
      setIndex(nextIndex);
    }, interval);

    return () => clearInterval(autoplayRef.current);
  }, [index, autoPlay, interval, banners.length]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={banners}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ width }}>
            <View style={[styles.card, { backgroundColor: item.bg }]}>
              <View style={styles.left}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
                <Pressable onPress={() => onPressCta?.(item)} style={styles.cta}>
                  <Text style={styles.ctaText}>{item.cta}</Text>
                </Pressable>
              </View>

              <Image
                source={{ uri: item.image }}
                style={styles.image}
                contentFit="cover"
                pointerEvents="none"
              />
            </View>
          </View>
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(newIndex);
        }}
      />

      {/* Dots */}
      <View style={styles.indicators}>
        {banners.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === index && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  card: {
    height: CARD_HEIGHT,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  left: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  cta: {
    backgroundColor: '#6B4B3F',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  ctaText: {
    color: 'white',
    fontWeight: '600',
  },
  image: {
    width: 140,
    height: CARD_HEIGHT,
    borderRadius: 16,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: '#E5E7EB',
  },
  dotActive: {
    backgroundColor: '#6B4B3F',
  },
});
