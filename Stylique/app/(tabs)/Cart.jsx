import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import API from '../../Api';

const Cart = () => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await API.get('/api/cart');
      setItems(res.data.items || []);
      setSubtotal(res.data.subtotal || 0);
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Failed to load cart' });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCart();
    }, [])
  );

  const updateQty = async (itemId, qty) => {
    try {
      if (qty <= 0) {
        await API.delete(`/api/cart/item/${itemId}`);
        setItems((prev) => prev.filter((i) => i.id !== itemId));
      } else {
        const res = await API.patch(`/api/cart/item/${itemId}` , { quantity: qty });
        setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, quantity: res.data.quantity } : i)));
      }
      const newSubtotal = items.reduce((sum, it) => sum + (it.id === itemId ? (qty <= 0 ? 0 : parseFloat(it.unitPrice || '0') * qty) : parseFloat(it.unitPrice || '0') * it.quantity), 0);
      setSubtotal(newSubtotal);
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Failed to update item' });
    }
  };

  const renderItem = ({ item }) => {
    const price = parseFloat(item.unitPrice || '0');
    const lineTotal = price * item.quantity;
    return (
      <View style={styles.card}>
        <Image source={{ uri: item.product?.imageUrl }} style={styles.image} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.name} numberOfLines={2}>{item.product?.productName}</Text>
          <Text style={styles.brand}>{item.product?.brand}</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.price}>₹{price}</Text>
            <Text style={styles.total}>₹{lineTotal.toFixed(2)}</Text>
          </View>
          <View style={[styles.rowBetween, { marginTop: 8 }]}>
            <View style={styles.qtyBox}>
              <Pressable style={styles.qtyBtn} onPress={() => updateQty(item.id, item.quantity - 1)}>
                <Ionicons name="remove" size={18} color="#333" />
              </Pressable>
              <Text style={styles.qtyText}>{item.quantity}</Text>
              <Pressable style={styles.qtyBtn} onPress={() => updateQty(item.id, item.quantity + 1)}>
                <Ionicons name="add" size={18} color="#333" />
              </Pressable>
            </View>
            <TouchableOpacity onPress={() => updateQty(item.id, 0)}>
              <Ionicons name="trash-outline" size={22} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Loading cart...</Text>
      </View>
    );
  }

  if (!items.length) {
    return (
      <View style={styles.center}>
        <Ionicons name="cart-outline" size={40} color="#999" />
        <Text style={{ marginTop: 8, color: '#666' }}>Your cart is empty</Text>
      </View>
    );
  }

  return (
    
    <View style={{ flex: 1 }}>
      <FlatList
        data={items}
        keyExtractor={(it) => String(it.id)}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
      />
      <View style={styles.footer}>
        <View>
          <Text style={styles.subLabel}>Subtotal</Text>
          <Text style={styles.subValue}>₹{Number(subtotal).toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn}>
          <Text style={styles.checkoutText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
  image: { width: 80, height: 80, borderRadius: 8 },
  name: { fontSize: 16, fontWeight: '600', color: '#222' },
  brand: { fontSize: 12, color: '#7a7a7a', marginTop: 2 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price: { fontSize: 14, color: '#333', fontWeight: '600' },
  total: { fontSize: 16, color: '#111', fontWeight: '700' },
  qtyBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f2f2f2', borderRadius: 8 },
  qtyBtn: { padding: 8 },
  qtyText: { paddingHorizontal: 12, fontSize: 14, fontWeight: '600' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eee', padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  subLabel: { color: '#666', fontSize: 12 },
  subValue: { color: '#111', fontSize: 20, fontWeight: '800' },
  checkoutBtn: { backgroundColor: '#343434', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
  checkoutText: { color: '#fff', fontWeight: '700' },
});

export default Cart;