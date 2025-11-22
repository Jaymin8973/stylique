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
    image: 'https://images.unsplash.com/photo-1569484221992-2a453658fff3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZmFzdCUyMGZhc2hpb258ZW58MHx8MHx8fDA%3D',
    bg: '#EDE1D5'
  },
  {
    id: '2',
    title: 'Summer Sale',
    subtitle: 'Up to 40% off selected items',
    cta: 'Explore',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZmFzdCUyMGZhc2hpb258ZW58MHx8MHx8fDA%3D',
    bg: '#EFEAE4'
  },
  {
    id: '3',
    title: 'Trending Now',
    subtitle: 'Fresh fits you will love',
    cta: 'Discover',
    image: 'https://media.istockphoto.com/id/2238880682/photo/the-clothing-stores-display-window.jpg?s=612x612&w=0&k=20&c=ORzBdXJQZsWDRya5ddNXMMyVAJKQf0G1TvTGeCzuWvw=',
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

  const scrollToSlide = (nextIndex, animated = true) => {
    if (!listRef.current) return;
    listRef.current.scrollToOffset({
      offset: nextIndex * width,
      animated,
    });
  };

  // Autoplay Logic: advance index on a timer and loop without backward animation
  useEffect(() => {
    if (!autoPlay || banners.length <= 1) return;

    autoplayRef.current = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % banners.length;
        const isWrap = next === 0;
        // When wrapping from last to first, jump without animation so it doesn't slide backwards
        scrollToSlide(next, !isWrap);
        return next;
      });
    }, interval);

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [autoPlay, interval, banners.length]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={banners}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ width }}>
            <Pressable
              onPress={() => onPressCta?.(item)}
              style={styles.card}
            >
              <Image
                source={{ uri: item.image }}
                style={styles.image}
                contentFit="cover"
                pointerEvents="none"
              />
            </Pressable>
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
    overflow: 'hidden',
    marginHorizontal: 20,
  },
  image: {
    width: '100%',
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
