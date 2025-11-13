import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions, FlatList } from 'react-native';
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');

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

const DOT_SIZE = 8;

export default function BannerCarousel({
  banners = DEFAULT_BANNERS,
  onPressCta,
  autoPlay = true,
  interval = 3500,
  loop = true,
}) {
  const listRef = useRef(null);
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const isPausedRef = useRef(false);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || banners.length <= 1) return;
    // clear any existing timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (isPausedRef.current) return;
      let next = index + 1;
      if (next >= banners.length) {
        if (!loop) return; // stop at last slide if not looping
        next = 0;
      }
      if (listRef.current) {
        try {
          listRef.current.scrollToIndex({ index: next, animated: true });
        } catch (e) {
          // Fallback to offset if not measured yet
          listRef.current.scrollToOffset({ offset: next * width, animated: true });
        }
      }
      setIndex(next);
    }, interval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoPlay, interval, loop, index, banners.length]);

  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 60 };
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      const i = viewableItems[0].index ?? 0;
      if (typeof i === 'number') setIndex(i);
    }
  }).current;

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={banners}
        keyExtractor={(item) => String(item.id)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
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
              <Image source={{ uri: item.image }} style={styles.image} contentFit="cover" />
            </View>
          </View>
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onTouchStart={() => { isPausedRef.current = true; }}
        onTouchEnd={() => { isPausedRef.current = false; }}
        onScrollBeginDrag={() => { isPausedRef.current = true; }}
        onScrollEndDrag={() => { isPausedRef.current = false; }}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        initialScrollIndex={0}
        scrollEventThrottle={16}
        decelerationRate="fast"
      />

      {/* indicators */}
      <View style={styles.indicators}>
        {banners.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === index ? styles.dotActive : null
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const CARD_HEIGHT = 180;

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  cardWrap: {
    paddingHorizontal: 16,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    gap: 8,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: '#E5E7EB',
  },
  dotActive: {
    backgroundColor: '#6B4B3F',
  }
});
