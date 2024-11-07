import React from 'react';
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity } from 'react-native';
import { useCart } from './CartContext';

const ShopScreen = () => {
  const { cart, removeFromCart } = useCart();


  const removeALLfromcart = () => {
    cart.forEach(item => removeFromCart(item.id)); // This calls removeFromCart for each item in the cart
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Text style={styles.cartItemName}>{item.name}</Text>
      <Text style={styles.cartItemQuantity}>Quantity: {item.quantity}</Text>
      <Text style={styles.cartItemPrice}>{item.price}</Text>
    <View style={styles.bading}>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFromCart(item.id)}
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
      <Button style={styles.removeButton} title="Proceed to Checkout" onPress={() => {}} />
    </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <Text style={styles.totalAmount}>
        Total: ${cart.reduce((sum, item) => sum + parseInt(item.price.slice(1)) * item.quantity, 0)}
      </Text>
      <Button title="Proceed to Checkout" onPress={() => {}} />
      <Button title="Remove all" onPress={removeALLfromcart} color="red" />
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
    borderRadius:25
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
  bading:{
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center',
  },
});
;
export default ShopScreen;
