import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCart } from './CartContext';  // Import the useCart hook to access the cart

const OrderScreen = ({ route }) => {
  const { cart, removeFromCart } = useCart();  // Access cart from context
  const { totalPrice = 0, user } = route?.params || {};  // Destructure route params safely

  const [status, setStatus] = useState('PENDING');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userToken, setUserToken] = useState(null);

  // Log cart items to verify their structure
  useEffect(() => {
    console.log('Cart Items:', cart);
  }, [cart]);

  // Fetch user token from AsyncStorage
  useEffect(() => {
    const fetchUserToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setUserToken(token);
      } catch (err) {
        console.error('Failed to fetch user token:', err);
        setError('Unable to retrieve user token');
      }
    };

    fetchUserToken();
  }, []);

  // Handle POST request to place the order
  useEffect(() => {
    if (cart.length > 0 && userToken) {
      handlePostOrder();
    }
  }, [cart, userToken]);

  const handlePostOrder = async () => {
    setLoading(true);

    if (!cart || cart.length === 0) {
      console.error('Cart items are empty or undefined!');
      setError('No items in cart');
      setLoading(false);
      return;
    }

    try {
      console.log('Cart items:', cart);  // Log cart items to verify their structure

      // Send the POST request to create a new order
      const response = await fetch('http://192.168.99.118:8000/api/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${userToken}`,
        },
        body: JSON.stringify({
          user: user.id,
          products: cart.map(item => ({
            id: item.id,
            title: item.title || item.name || 'Unnamed product',
            quantity: item.quantity,
          })),
          total_price: totalPrice,
          comments: 'Order placed through mobile app',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setStatus('Order Placed');
        console.log('Order placed:', data);
        await AsyncStorage.removeItem('cartItems');  // Optionally clear cart after order is placed
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        setError(errorData.message || 'An error occurred while placing the order');
      }
    } catch (error) {
      console.error('Request failed:', error);
      setError('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart.length) {
    return (
      <View style={styles.container}>
        <Text>No items in the order</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.TORDER}>ORDER ITEMS</Text>

      <ScrollView contentContainerStyle={styles.productCon}>
        {cart.map((item, index) => (
          <View key={index} style={styles.productItem}>
            <Text>Name: {item.title || 'Unnamed product'}</Text>
            <Text>Quantity: {item.quantity}</Text>
            <Text>Price: {item.price}</Text>
          </View>
        ))}

        <Text style={styles.totalPrice}>Total Price: ${totalPrice}</Text>
        <Text style={styles.status}>Status: {status}</Text>

        {loading ? (
          <Text>Placing order...</Text>
        ) : (
          <Button title="Place Order" onPress={handlePostOrder} />
        )}

        {error && <Text style={{ color: 'red' }}>{error}</Text>}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  TORDER: {
    position: 'absolute',
    top: 40,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  productCon: {
    margin: 8,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    marginTop: 80,
    width: '100%',
  },
  productItem: {
    marginVertical: 5,
  },
  totalPrice: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  status: {
    marginTop: 10,
    color: 'green',
  },
});

export default OrderScreen;
