import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCart } from './CartContext'; // Import the cart context
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ShopScreen = () => {
  const { cart, removeFromCart, updateCartItemStock } = useCart();
  const navigation = useNavigation(); // Initialize the navigation hook
  const [loading, setLoading] = useState(false);

  // Calculate the total price for all items in the cart
  const calculateTotalPrice = () => {
    return cart.reduce((sum, item) => {
      if (!item || !item.price) return sum;
      const price = parseFloat(item.price.replace('$', '')) || 0; // Fallback to 0 if price is invalid
      return sum + price * (item.quantity || 1); // Fallback to 1 for quantity
    }, 0);
  };

  // Fetch the token from AsyncStorage
  const getTokenFromStorage = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      return token;
    } catch (error) {
      console.error('Error fetching token:', error);
      return null;
    }
  };

// Handle checkout for an individual item
const handleCheckoutForItem = async (item) => {
  if (!item || !item.id) {
    console.error('Invalid item:', item);
    return;
  }

  // Fetch the token from AsyncStorage
  const token = await AsyncStorage.getItem('userToken');
  if (!token) {
    Alert.alert('Error', 'Unable to complete checkout. Please log in.');
    return;
  }

  const orderData = {
    product_name: item.title, // Map item.title to product_name
    quantity: item.quantity,
    status: 'pending',
  };

  setLoading(true);
  try {
    const response = await axios.post('http://52.62.183.28/api/orders/', orderData, {
      headers: { Authorization: `Token ${token}` }, // Correctly format the Authorization header
    });
    console.log('Order created successfully:', response.data);

    navigation.navigate('Order', {
      cartItems: [item],
    });

    updateCartItemStock(item.id, item.quantity);
    removeFromCart(item.id);
  } catch (error) {
    console.error('Error creating order:', error.response?.data || error);
    Alert.alert('Checkout Failed', 'An error occurred during checkout.');
  } finally {
    setLoading(false);
  }
};

// Handle bulk checkout for all items in the cart
const handleProceedToCheckout = async () => {
  if (cart.length === 0) {
    Alert.alert('Your cart is empty!', 'Please add items to your cart before proceeding.');
    return;
  }

  const totalPrice = calculateTotalPrice();
  const token = await AsyncStorage.getItem('userToken');

  if (!token) {
    console.error('No token found in AsyncStorage');
    Alert.alert('Error', 'Unable to complete checkout. Please log in.');
    return;
  }

  const orderData = cart.map((item) => ({
    product_name: item.title,
    quantity: item.quantity,
    status: 'pending',
  }));

  setLoading(true);
  try {
    const response = await axios.post('http://52.62.183.28/api/orders/', orderData, {
      headers: { Authorization: `Token ${token}` }, // Correctly format the Authorization header
    });
    console.log('Bulk orders created successfully:', response.data);

    navigation.navigate('Order', {
      cartItems: cart,
      totalPrice,
    });

    cart.forEach((item) => {
      updateCartItemStock(item.id, item.quantity);
      removeFromCart(item.id);
    });
  } catch (error) {
    console.error('Error creating bulk orders:', error.response?.data || error);
    Alert.alert('Checkout Failed', 'An error occurred during checkout.');
  } finally {
    setLoading(false);
  }
};

  

  // Render cart items
  const renderItem = ({ item }) => {
    if (!item || !item.id) {
      console.error('Invalid cart item:', item);
      return null; // Skip invalid items
    }

    return (
      <View style={styles.cartItem}>
        <Text style={styles.cartItemName}>{item.title || 'Unknown Item'}</Text>
        <Text style={styles.cartItemQuantity}>Quantity: {item.quantity || 0}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeFromCart(item.id)}
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>

          <Button
            title="Checkout this item"
            onPress={() => handleCheckoutForItem(item)}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        renderItem={renderItem}
        keyExtractor={(item) => (item?.id?.toString() || item?.title || Math.random().toString())}
      />

      <Text style={styles.totalAmount}>
        Total: ${calculateTotalPrice().toFixed(2)}
      </Text>

      <Button title="Proceed to Checkout" onPress={handleProceedToCheckout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  cartItem: {
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  cartItemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cartItemQuantity: {
    fontSize: 16,
    color: '#666',
  },
  cartItemPrice: {
    fontSize: 16,
    color: '#888',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  removeButton: {
    backgroundColor: '#ff4d4d',
    padding: 8,
    borderRadius: 25,
  },
  removeButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default ShopScreen;
