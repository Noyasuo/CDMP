import * as React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import { useState } from 'react';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Check for empty fields
    if (!username || !password) {
      Alert.alert('All fields are required!', 'Please fill in all fields to continue.');
      return;
    }

    // Navigate to Main and pass the user data
    navigation.navigate('Main', {
      screen: 'Home',
      params: { name: username },
    });
  };

  const handleUsernameChange = (text) => {
    // Allow letters and spaces
    const validInput = text.replace(/[^a-zA-Z\s]/g, '');
    setUsername(validInput);
  };

  const handlePasswordChange = (text) => {
    // Allow all characters for password
    setPassword(text);
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.jpg')} style={styles.logo} />
      
      <View style={styles.inputContainer}>
        <Ionicons name="person" size={20} color="#fff" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#ccc"  // Lighter shade of white
          value={username}
          onChangeText={handleUsernameChange}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed" size={20} color="#fff" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#ccc"  // Lighter shade of white
          secureTextEntry={true}
          value={password}
          onChangeText={handlePasswordChange}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
        <Text style={styles.registerText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#004d00', // Dark green color
    padding: 16,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 100,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 10,
    width: '80%', // Match the width previously set for the inputBox
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 10,
    color: '#fff', // Set the input text color to white
  },
  button: {
    width: '80%',
    height: 40,
    backgroundColor: '#FFFF00', // Yellow background color
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#000000', // Black text color
    fontSize: 18,
  },
  registerText: {
    color: '#ffffff', // White color
    fontSize: 16,
    marginTop: 10,
  },
});

export default LoginScreen;
