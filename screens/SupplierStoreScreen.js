import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import API_URL from '../../api';

const SupplierStoreScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUsername, setCurrentUsername] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
        fetchProducts();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
        const token = await AsyncStorage.getItem('userToken');
        const username = await AsyncStorage.getItem('userName');
        setCurrentUsername(username);

        // Fetch products. 
        const response = await fetch(`${API_URL}/api/products/`, {
            headers: { 'Authorization': `Token ${token}` }
        });

        if (response.ok) {
            const data = await response.json();
            
            // Filter products that belong to the current user
            const myProducts = data.filter(item => {
                // Access nested supplier.username OR flat supplier_name
                // If the API returns key 'supplier' as an object with 'username'
                // OR returns key 'supplier_name' as a string
                // We MUST ensuring strict matching.
                
                const ownerName = item.supplier?.username || item.supplier_name;
                
                // Debug log to help identify what's coming from API
                console.log(`Product: ${item.title}, Owner: ${ownerName}, Me: ${username}`);

                // STRICT CHECK: The product owner must match the logged-in username.
                // We allow a fallback (item.supplier === null) ONLY if we align with backend behavior,
                // but given the user request, let's correspond strictly.
                
                return ownerName === username;
            });
            
            setProducts(myProducts);
        } else {
            console.error("Failed to fetch products");
        }
    } catch (error) {
        console.error("Error fetching supplier products:", error);
    } finally {
        setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
        "Delete Product",
        "Are you sure you want to delete this product?",
        [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: async () => {
                try {
                    const token = await AsyncStorage.getItem('userToken');
                    const response = await fetch(`${API_URL}/api/products/${id}/`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Token ${token}` }
                    });
                    
                    if (response.ok) {
                        fetchProducts(); // Refresh list
                    } else {
                        Alert.alert("Error", "Could not delete product");
                    }
                } catch (error) {
                    Alert.alert("Error", "Network request failed");
                }
            }}
        ]
    );
  };

  const renderProduct = ({ item }) => (
    <View style={styles.card}>
        <Image 
            source={item.image ? { uri: item.image } : require('../../assets/logo.jpg')} 
            style={styles.productImage} 
        />
        <View style={styles.infoContainer}>
            <Text style={styles.productName}>{item.title}</Text>
            <Text style={styles.productDetails}>Stock: {item.stock} | Price: ₱{item.price}</Text>
            <Text style={styles.category}>{item.category?.name || item.category || 'Uncategorized'}</Text>
        </View>
        <View style={styles.actionContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('AddProduct', { product: item })}>
                <Ionicons name="create-outline" size={24} color="#004d00" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={{ marginLeft: 15 }}>
                <Ionicons name="trash-outline" size={24} color="#d32f2f" />
            </TouchableOpacity>
        </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Store</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddProduct')} style={styles.addButton}>
            <Ionicons name="add-circle" size={30} color="#004d00" />
            <Text style={styles.addButtonText}>Add Product</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#004d00" style={styles.center} />
      ) : (
        <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={products.length === 0 ? styles.center : styles.listContent}
            ListEmptyComponent={<Text>No products in your store yet.</Text>}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 10, 
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#004d00',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    marginLeft: 5,
    color: '#004d00',
    fontWeight: '600',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  productDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  category: {
    fontSize: 12,
    color: '#004d00',
    marginTop: 2,
    fontWeight: '500',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default SupplierStoreScreen;
