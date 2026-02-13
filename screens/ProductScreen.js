import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Modal, Button } from 'react-native';
import axios from 'axios'; 
import { useCart } from './CartContext'; // Import the useCart hook
import AsyncStorage from '@react-native-async-storage/async-storage'; // For storing token

const ProductScreen = ({ navigation, searchQuery = '' }) => {
  const [products, setProducts] = useState([]); // State to store fetched products
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart(); // Access the addToCart function from context

  useEffect(() => {
    AsyncStorage.getItem('userToken').then(token => {
      if (token) {
        // Make API call with the token in Authorization header
        axios.get('http://52.62.183.28/api/products/', {
          headers: {
            Authorization: `Token ${token}`,
          }
        })
          .then(response => {
            setProducts(response.data);
            console.log(response.data); // Update the state with the fetched products
          })
          .catch(error => {
            console.error('Error fetching products:', error);
          });
      } else {
        console.log('No token found');
      }
    });
  }, []); // Empty dependency array to run this effect only once when the component mounts

  const openModal = (product) => {
    setSelectedProduct(product);
    setQuantity(1); // Reset quantity to 1 when opening the modal
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const incrementQuantity = () => {
    if (quantity < selectedProduct.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    // Check if selectedProduct is valid
    if (!selectedProduct || !selectedProduct.id) {
      console.error('Selected product is undefined or invalid:', selectedProduct);
      alert('Product is invalid or not selected');
      return; // Exit if selectedProduct is invalid
    }
  
    if (quantity > selectedProduct.stock) {
      alert('Not enough stock available');
      return;
    }
  
    // Add selected product with quantity to the cart
    addToCart({ ...selectedProduct, quantity });
  
    // Decrement the stock locally after adding to the cart
    const updatedProducts = products.map(product => 
      product.id === selectedProduct.id
        ? { ...product, stock: product.stock - quantity }
        : product
    );
    setProducts(updatedProducts); // Update local state with new stock values
  
    closeModal();
  };
  

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => openModal(item)} style={styles.card}>
        {/* Display product image or default image */}
        <Image 
          source={item.image ? { uri: item.image } : require('./logo/user.png')} // Use placeholder if image is null
          style={styles.productImage} 
        />
        <Text style={styles.productName}>{item.title}</Text>
        <Text style={styles.productCategory}>{item.category.name}</Text>
        <Text style={styles.productStock}>In Stock: {item.stock}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={products.filter(product => 
          product.title.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        contentContainerStyle={styles.grid}
      />

      {/* Product Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedProduct && (
              <>
                <Image 
                  source={selectedProduct.image ? { uri: selectedProduct.image } : require('./logo/user.png')} 
                  style={styles.modalImage} 
                />
                <Text style={styles.modalProductName}>{selectedProduct.title}</Text>
                
                {/* Add Stock and Category */}
                <Text style={styles.modalProductCategory}>Category: {selectedProduct.category.name}</Text>
                <Text style={styles.modalProductStock}>Stock: {selectedProduct.stock}</Text>

                {/* Quantity Selector */}
                <View style={styles.quantityContainer}>
                  <TouchableOpacity onPress={decrementQuantity} style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantity}</Text>
                  <TouchableOpacity onPress={incrementQuantity} style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>

                {/* Add to Cart Button */}
                <Button title="Add to Cart" onPress={handleAddToCart} />
                <Button title="Close" onPress={closeModal} color="red" />
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  grid: {
    padding: 16,
  },
  card: {
    flex: 1,
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
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  productCategory: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
  productStock: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 15,
  },
  modalProductName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalProductCategory: {
    fontSize: 14,
    color: '#444',
    marginBottom: 5,
  },
  modalProductStock: {
    fontSize: 14,
    color: '#444',
    marginBottom: 20,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
    borderRadius: 15,
  },
  quantityButtonText: {
    fontSize: 18,
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 15,
  },
});

export default ProductScreen;