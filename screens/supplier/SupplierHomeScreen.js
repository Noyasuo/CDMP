import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import API_URL from '../../api';

const SupplierHomeScreen = ({ navigation }) => {
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

        // Fetch products. Assuming API returns all products or filters by user
        const response = await fetch(`${API_URL}/api/products/`, {
            headers: { 'Authorization': `Token ${token}` }
        });

        if (response.ok) {
            const data = await response.json();
            // Optional: Filter client-side if API returns all products
            // const myProducts = data.filter(p => p.supplier_id === myId); 
            setProducts(data);
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

  const renderProduct = ({ item }) => {
    // Check if the current user is the owner
    const itemOwner = item.supplier?.username || item.supplier_name;
    const isOwner = !itemOwner || itemOwner === currentUsername;

    return (
    <View style={styles.card}>
        <Image 
            source={item.image ? { uri: item.image } : require('../../assets/logo.jpg')} 
            style={styles.productImage} 
        />
        <View style={styles.infoContainer}>
            <Text style={styles.productName}>{item.title}</Text>
            <Text style={styles.productDetails}>Stock: {item.stock} | Price: ₱{item.price}</Text>
            
            {/* Added explicit display labels for clarity */}
            <Text style={styles.category}>
                Category: 
                <Text style={{fontWeight: 'bold'}}> {item.category?.name || item.category || 'Uncategorized'}</Text>
            </Text>
            
            <Text style={styles.owner}>
                Owner: 
                <Text style={{fontWeight: 'bold'}}> {itemOwner || 'Me'}</Text>
            </Text>
        </View>
        
        {/* Only show actions if user is owner */}
        {isOwner && (
        <View style={styles.actionContainer}>
           <Text style={{fontSize: 12, color: '#004d00', fontWeight: 'bold'}}>My Product</Text>
        </View>
        )}
    </View>
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { 
          text: "OK", 
          onPress: async () => {
            await AsyncStorage.clear();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Supplier Dashboard</Text>
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
            ListEmptyComponent={<Text>No products found. Add one!</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
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
    marginTop: 4,
    fontWeight: '500',
  },
  owner: {
    fontSize: 12,
    color: '#333',
    marginTop: 2,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#d32f2f',
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SupplierHomeScreen;
