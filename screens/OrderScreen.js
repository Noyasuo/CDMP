import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// UPDATE THIS to your machine's IP address
const API_URL = 'http://192.168.1.6:8000';

const OrderScreen = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (!token) return;

                const response = await fetch(`${API_URL}/api/orders/`, {
                    headers: { 'Authorization': `Token ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                } else {
                    console.error('Failed to fetch orders');
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusDisplay = (order) => {
        const procurementStatus = (order.status || '').trim().toLowerCase();
        const municipalStatus = (order.final_status || '').trim().toLowerCase();

        // 1. REJECTION CHECK
        if (procurementStatus === 'rejected' || procurementStatus === 'declined' || 
            municipalStatus === 'rejected' || municipalStatus === 'declined') {
            return { text: 'Declined', color: 'red' };
        }

        // 2. APPROVED (Final)
        // Municipal Admin has the final say.
        if (municipalStatus === 'approved') {
            return { text: 'Approved', color: 'green' };
        }

        // 3. REVIEWED (Intermediate)
        // Procurement Admin has checked and approved it.
        if (procurementStatus === 'approved' || procurementStatus === 'reviewed') {
            return { text: 'Reviewed', color: '#1976D2' }; // Blue for Reviewed
        }

        // 4. PENDING (Initial)
        return { text: 'Pending', color: 'orange' };
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size='large' color='#0000ff' />
                <Text style={{ marginTop: 10 }}>Loading orders...</Text>
            </View>
        );
    }

    return (
        <View style={styles.mainContainer}>
            <Text style={styles.header}>My Orders</Text>
            
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {orders.length === 0 ? (
                    <Text style={styles.noOrders}>No orders found.</Text>
                ) : (
                    orders.map((order) => {
                        const statusInfo = getStatusDisplay(order);
                        
                        return (
                            <View key={order.id} style={styles.card}>
                                {/* Header */}
                                <View style={styles.cardHeader}>
                                    <Text style={styles.orderId}>Order #{order.id}</Text>
                                    <Text style={styles.date}>
                                        {new Date(order.request_date).toLocaleDateString()}
                                    </Text>
                                </View>
                                
                                <View style={styles.divider} />
                                
                                {/* Products */}
                                <Text style={styles.sectionLabel}>Products:</Text>
                                {order.product && order.product.map((p, idx) => (
                                    <View key={idx} style={styles.productRow}>
                                        <Text style={styles.productName}>� {p.title}</Text>
                                    </View>
                                ))}

                                {/* Details */}
                                <View style={styles.detailsRow}>
                                    <Text style={styles.detailLabel}>Quantity:</Text>
                                    <Text style={styles.detailValue}>{order.quantity}</Text>
                                </View>

                                <View style={styles.detailsRow}>
                                    <Text style={styles.detailLabel}>Total Cost:</Text>
                                    <Text style={styles.detailValue}></Text>
                                </View>

                                {/* Status Text */}
                                <View style={styles.statusContainer}>
                                    <Text style={styles.statusLabel}>Current Status:</Text>
                                    <Text style={[styles.statusText, { color: statusInfo.color }]}>
                                        {statusInfo.text}
                                    </Text>
                                </View>
                            </View>
                        );
                    })
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: 20, 
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
        color: '#333',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    noOrders: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#888',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    date: {
        fontSize: 12,
        color: '#888',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginBottom: 12,
    },
    sectionLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
        fontWeight: '600',
    },
    productRow: {
        marginBottom: 2,
        marginLeft: 8,
    },
    productName: {
        fontSize: 15,
        color: '#444',
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    detailLabel: {
        fontSize: 14,
        color: '#666',
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    statusContainer: {
        marginTop: 15,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#f9f9f9',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#555',
    },
    statusText: {
        fontSize: 15, 
        fontWeight: 'bold',
        textTransform: 'uppercase', 
    }
});

export default OrderScreen;
