import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProductScreen from './ProductScreen'; // Import ProductScreen

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState(''); // State for the search query

  // Handle change in search input
  const handleSearchChange = (text) => {
    setSearchQuery(text);
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={handleSearchChange} // Update search query on text change
        />
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
      </View>

      {/* Pass the search query to ProductScreen */}
      <ProductScreen searchQuery={searchQuery} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'grey',
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
});

export default HomeScreen;
