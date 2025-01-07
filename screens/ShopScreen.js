import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook
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
      if (!item) return sum;
      const price = parseFloat(item.price.replace('$', ''));
      return sum + price * item.quantity;
    }, 0);
  };

  // Function to fetch the token from AsyncStorage
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
      return; // Exit if item is invalid
    }

    const itemTotalPrice = item.quantity * parseFloat(item.price);
    console.log('Navigating to Order screen for item:', item);

    // Navigate to Order screen and pass relevant data
    navigation.navigate('Order', {
      cartItems: [item],  // Pass the selected item in an array
      totalPrice: itemTotalPrice,  // Pass the total price for the selected item
    });

    // Update the stock for the item
    updateCartItemStock(item.id, item.quantity);
    removeFromCart(item.id);

    // Fetch the token from AsyncStorage
    const token = await getTokenFromStorage();
    if (!token) {
      console.error('No token found in AsyncStorage');
      return; // Exit if token is not found
    }

    // Prepare order data
    const orderData = {
      itemId: item.id,
      quantity: item.quantity,
      totalPrice: itemTotalPrice,
      status: 'pending',  // Assuming you set an order status
    };

    // Send the PATCH request to update the order on the server
    setLoading(true);
    try {
      const response = await axios.patch(`http://192.168.5.124:8000/api/order/${item.id}/`, orderData, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      console.log('Order patched successfully:', response.data);
      console.log("Item ID for PATCH request:", item.id);
      // Handle success response (e.g., show confirmation)
    } catch (error) {
      console.error('Error patching order:', error);
      // Handle error (e.g., show an error message to the user)
    } finally {
      setLoading(false);
    }
  };

  // Handle the "Proceed to Checkout" for the entire cart
  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Your cart is empty!', 'Please add items to your cart before proceeding.');
      return;
    }

    const totalPrice = calculateTotalPrice();
    navigation.navigate('Order', {
      cartItems: cart,  // Pass all items in the cart
      totalPrice,  // Pass the total price for the cart
    });

    // Update stock for each item in the cart (but **don't remove** items from cart)
    cart.forEach((item) => {
      if (item && item.id) {
        updateCartItemStock(item.id, item.quantity);  // Safe to use item.id now
      }
    });
  };

  // Render cart items
  const renderItem = ({ item }) => {
    if (!item || !item.id) {
      console.error('Received an invalid item in renderItem:', item);
      return null; // Return null if item is invalid
    }

    return (
      <View style={styles.cartItem}>
        <Text style={styles.cartItemName}>{item.title}</Text>
        <Text style={styles.cartItemQuantity}>Quantity: {item.quantity}</Text>
        <Text style={styles.cartItemPrice}>Price: ${parseFloat(item.price.replace('$', '')).toFixed(2)}</Text>

        <View style={styles.bading}>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeFromCart(item.id)}  // Safe to access item.id
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>

          <Button
            title="Checkout this item"
            onPress={() => handleCheckoutForItem(item)}  // Safe to pass item
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
        keyExtractor={(item) => item?.id?.toString() || item?.title}  // Ensure item has a valid id
      />

      <Text style={styles.totalAmount}>Total: ${calculateTotalPrice().toFixed(2)}</Text>

      <Button title="Proceed to Checkout" onPress={handleProceedToCheckout} />
      {/* Removed "Remove all" button to prevent removing items from the cart */}
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
  bading: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ShopScreen;
