import * as React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

    // Function to handle password reset
    const handleResetPassword = () => {
      // Navigate to Reset Password screen
      navigation.navigate('forgot');
    };

    const handleLogin = async () => {
      if (!username || !password) {
        Alert.alert('All fields are required!', 'Please fill in all fields to continue.');
        return;
      }
    
      try {
        const response = await fetch('http://52.62.183.28/api/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        });
    
        // Check if the response status is OK
        if (response.status === 200) {
          const data = await response.json();
          console.log(data); // For debugging purposes
    
          // Check if the response has the necessary data (message, token)
          if (data.token) {
            // Assuming the backend sends back a 'message' and 'token'
            Alert.alert('Login Successful', `Welcome back!`);
    
            // Save the token, username, and user_type in AsyncStorage
            await AsyncStorage.setItem('userToken', data.token);
            await AsyncStorage.setItem('userName', username);
            await AsyncStorage.setItem('user_type', data.user_type);  // Save user_type
    
            // Log the username and user_type after saving to AsyncStorage
            const savedUsername = await AsyncStorage.getItem('userName');
            const savedUserType = await AsyncStorage.getItem('user_type');  // Retrieve user_type
            console.log('Saved username in AsyncStorage:', savedUsername);
            console.log('Saved user_type in AsyncStorage:', savedUserType);
    
            // Navigate to the Home screen
            navigation.navigate('Main', {
              screen: 'Home',
              params: { name: username, token: data.token },
            });
          } else {
            Alert.alert('Login Failed', data.message || 'Something went wrong');
          }
        } else {
          // Handle non-200 status codes
          const errorData = await response.json();
          Alert.alert('Login Failed', errorData.message || 'Something went wrong');
        }
      } catch (error) {
        Alert.alert('Error', 'There was an error connecting to the server');
      }
    };
    
    

  const handleUsernameChange = (text) => {
    setUsername(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  return (
    <View style={styles.container}>
      <Image source={require('./logo/logo.png')} style={styles.logo} />

      {/* Username Input Field */}
      <View style={styles.inputContainer}>
        <Ionicons name="person" size={20} color="#fff" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#ccc"
          value={username}
          onChangeText={handleUsernameChange}
        />
      </View>

      {/* Password Input Field */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed" size={20} color="#fff" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#ccc"
          secureTextEntry={true}
          value={password}
          onChangeText={handlePasswordChange}
        />
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Reset Password Button */}
              <TouchableOpacity style={styles.resetPasswordButton} onPress={handleResetPassword}>
                <Text style={styles.buttonText}>Forgot Password</Text>
              </TouchableOpacity>
    </View>

    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#004d00',
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
    width: '80%',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 10,
    color: '#fff',
  },
  button: {
    width: '80%',
    height: 40,
    backgroundColor: '#FFFF00',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
  },
  registerText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 10,
  },
});

export default LoginScreen;