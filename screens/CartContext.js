import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the CartContext
const CartContext = createContext();

// Custom hook to access the cart data
export const useCart = () => {
  return useContext(CartContext);
};

// CartProvider component to wrap your app
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Fetch cart items from AsyncStorage on load
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const cartData = await AsyncStorage.getItem('cartItems');
        if (cartData) {
          setCart(JSON.parse(cartData));
        }
      } catch (error) {
        console.error('Failed to load cart from AsyncStorage', error);
      }
    };

    fetchCartItems();
  }, []); // Run only once when the component mounts

  // Update cart in AsyncStorage whenever it changes
  useEffect(() => {
    const saveCartItems = async () => {
      try {
        await AsyncStorage.setItem('cartItems', JSON.stringify(cart));
      } catch (error) {
        console.error('Failed to save cart to AsyncStorage', error);
      }
    };

    if (cart.length > 0) {
      saveCartItems();  // Save cart to AsyncStorage whenever cart changes
    }
  }, [cart]); // Depend on cart to save only when it changes


  const updateCartItemStock = async (productId, quantity, item) => {
    // Ensure 'item' and 'productId' are valid before proceeding
    if (!item || !item.id || !productId) {
      console.error('Invalid item or productId:', item, productId);
      return; // Exit if item or productId is invalid
    }
  
    const updatedStock = item.stock - quantity;
    console.log('Updating stock for item:', item.title, 'to:', updatedStock);
  
    try {
      // Fetch the token from AsyncStorage
      const token = await AsyncStorage.getItem('userToken');
      console.log('Retrieved token from AsyncStorage:', token);
  
      if (!token) {
        console.error('Token not found, cannot update stock');
        return; // Exit if token is missing
      }
  
      // Prepare the FormData for the API request (optional image handling)
      const formData = new FormData();
      formData.append('stock', updatedStock);
      formData.append('title', item.title);
      formData.append('price', item.price);
      formData.append('category', item.category.id);
      
      // Handle image if it exists
      if (item.image) {
        formData.append('image', {
          uri: item.image,
          type: 'image/jpeg',
          name: 'image.jpg',
        });
      }
  
      // Make the API request to update the product
      const response = await axios.put(
        `http://192.168.5.124:8000/api/products/${productId}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Token ${token}`,
          },
        }
      );
  
      // Check response status and log success
      if (response.status === 200) {
        console.log('Stock (and image) updated successfully:', response.data);
      } else {
        console.error('Error updating stock:', response.data);
      }
    } catch (error) {
      console.error('Error updating product stock:', error.response?.data || error.message);
    }
  };
  




  const addToCart = async (item) => {
    if (!item || !item.id) {
      console.error('Invalid item:', item);
      return; // Exit if item is invalid
    }
  
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      const updatedCart = existingItem
        ? prevCart.map((cartItem) =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
              : cartItem
          )
        : [...prevCart, item];
  
      AsyncStorage.setItem('cartItems', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };
  
  // Remove specific item from cart
  const removeFromCart = (id) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== id);
      return updatedCart;
    });
  };

  // Remove all items from cart
  const removeAllFromCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, removeAllFromCart, updateCartItemStock }}>
      {children}
    </CartContext.Provider>
  );
};
