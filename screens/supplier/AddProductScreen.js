import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, Button, Alert, ActivityIndicator, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Correct import for installed package
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import API_URL from '../../api';

const AddProductScreen = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState(''); // Added description as common field
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Assuming we fetch categories from API
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Check if we are editing
  const isEditing = route.params?.product;
  const productToEdit = route.params?.product;

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
        setName(productToEdit.title || productToEdit.name); // Handle both title/name
        setPrice(productToEdit.price ? productToEdit.price.toString() : '');
        setStock(productToEdit.stock ? productToEdit.stock.toString() : '');
        setCategory(productToEdit.category?.id || productToEdit.category); // Handle object or ID
        setImageUrl(productToEdit.image || '');
        setDescription(productToEdit.description || '');
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
        // This endpoint logic is an assumption, adjust if needed
      const response = await fetch(`${API_URL}/api/category/`, { // Trying singular 'category' or 'categories'
         headers: { 'Authorization': `Token ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        if (data.length > 0 && !category && !isEditing) {
            setCategory(data[0].id); // Default to first
        }
      } else {
        // Fallback for demo if API fails
        setCategories([
            { id: 1, name: 'Electronics' },
            { id: 2, name: 'Clothing' },
            { id: 3, name: 'Food' }
        ]);
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
        setLoadingCategories(false);
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!name || !price || !stock || !category) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const url = isEditing 
        ? `${API_URL}/api/products/${productToEdit.id}/` 
        : `${API_URL}/api/products/`;
      
      const method = isEditing ? 'PATCH' : 'POST';

      const formData = new FormData();
      formData.append('title', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('stock', stock);
      formData.append('category_id', category);

      if (imageUrl && !imageUrl.startsWith('http')) {
        let localUri = imageUrl;
        let filename = localUri.split('/').pop();

        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        formData.append('image', {
          uri: localUri,
          name: filename,
          type,
        });
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Token ${token}`,
          // content-type will be set automatically with boundary for FormData
        },
        body: formData
      });

      if (response.ok) {
        Alert.alert('Success', `Product ${isEditing ? 'updated' : 'created'} successfully!`);
        navigation.goBack();
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.detail || 'Operation failed');
        console.log(errorData);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Network request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{isEditing ? 'Edit Product' : 'Add New Product'}</Text>
      
      <Text style={styles.label}>Product Name *</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter product name"
      />

      <Text style={styles.label}>Category *</Text>
      <View style={styles.pickerContainer}>
        {loadingCategories ? (
            <ActivityIndicator />
        ) : (
            <Picker
                selectedValue={category}
                onValueChange={(itemValue) => setCategory(itemValue)}
            >
                {categories.map((cat) => (
                    <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
                ))}
            </Picker>
        )}
      </View>

      <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Price *</Text>
            <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="0.00"
                keyboardType="numeric"
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Stock *</Text>
            <TextInput
                style={styles.input}
                value={stock}
                onChangeText={setStock}
                placeholder="0"
                keyboardType="numeric"
            />
          </View>
      </View>

      <Text style={styles.label}>Product Image *</Text>
      
      <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
         <Text style={styles.imagePickerText}>{imageUrl ? "Change Image" : "Select from Gallery"}</Text>
      </TouchableOpacity>

      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.previewImage} />
      ) : null}

      <View style={styles.buttonContainer}>
        <Button 
            title={loading ? "Saving..." : "Save Product"} 
            onPress={handleSubmit} 
            disabled={loading}
            color="#004d00"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#004d00',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  buttonContainer: {
    marginTop: 20,
  },
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  imagePickerButton: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  imagePickerText: {
    color: '#333',
    fontWeight: 'bold',
  }
});

export default AddProductScreen;
