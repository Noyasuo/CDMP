import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrderScreen = () => {
  const [approvedOrders, setApprovedOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userToken, setUserToken] = useState(null);

  // Fetch user token from AsyncStorage
  useEffect(() => {
    const fetchUserToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) setUserToken(token);
        else setError('User token is missing');
      } catch (err) {
        console.error('Failed to fetch user token:', err);
        setError('Unable to retrieve user token');
      }
    };

    fetchUserToken();
  }, []);

  // Fetch approved orders
  useEffect(() => {
    const fetchApprovedOrders = async () => {
      if (!userToken) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch('http://52.62.183.28/api/orders/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${userToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const filteredOrders = data.filter(order => order.final_status === 'approved');
          setApprovedOrders(filteredOrders);
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to fetch orders');
        }
      } catch (error) {
        console.error('Request failed:', error);
        setError('Unable to fetch approved orders');
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedOrders();
  }, [userToken]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading approved orders...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  if (!approvedOrders.length) {
    return (
      <View style={styles.container}>
        <Text>No approved orders found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Approved Orders</Text>
      <ScrollView contentContainerStyle={styles.orderContainer}>
        {approvedOrders.map((order, index) => (
          <View key={order.id} style={styles.orderItem}>
            <Text>Order ID: {order.id}</Text>
            <Text>User: {order.user.username}</Text>
            <Text>Products:</Text>
            {order.product.map((product, idx) => (
              <Text key={idx}>
                - {product.title} (Quantity: {order.quantity})
              </Text>
            ))}
            <Text>Status: {order.final_status}</Text>

          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  orderContainer: {
    padding: 10,
  },
  orderItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
});

export default OrderScreen;
