// src/screens/HomeScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Image, TouchableOpacity, Modal, Button } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons

const products = [
  { id: 1, uri: 'https://via.placeholder.com/150', name: 'Product 1', price: '$10' },
  { id: 2, uri: 'https://via.placeholder.com/150', name: 'Product 2', price: '$15' },
  { id: 3, uri: 'https://via.placeholder.com/150', name: 'Product 3', price: '$20' },
];

const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openProductDetail = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#888"
        />
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
      </View>

      {/* Products Gallery */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gallery}>
        {products.map((product) => (
          <TouchableOpacity key={product.id} onPress={() => openProductDetail(product)}>
            <View style={styles.productContainer}>
              <Image source={{ uri: product.uri }} style={styles.image} />
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>{product.price}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Product Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            {selectedProduct && (
              <>
                <Image source={{ uri: selectedProduct.uri }} style={styles.modalImage} />
                <Text style={styles.modalProductName}>{selectedProduct.name}</Text>
                <Text style={styles.modalProductPrice}>{selectedProduct.price}</Text>
                <Button title="Add to Cart" onPress={() => alert(`${selectedProduct.name} added to cart!`)} />
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
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  searchIcon: {
    position: 'absolute',
    right: 20,
  },
  gallery: {
    flexDirection: 'row',
  },
  productContainer: {
    alignItems: 'center',
    marginRight: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  productName: {
    marginTop: 5,
    fontWeight: 'bold',
  },
  productPrice: {
    color: '#888',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative',
  },
  modalImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalProductName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalProductPrice: {
    color: '#888',
    marginBottom: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#f44336', // Red color for the close button
    borderRadius: 10,
    padding: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
