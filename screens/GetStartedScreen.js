// screens/GetStartedScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const GetStartedScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.jpg')} style={styles.logo} />
      <Text style={styles.title}>Procurement Management Mobile</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
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
  },
  logo: {
    width: 200, // Adjust width as needed
    height: 200, // Adjust height as needed
    borderRadius: 100, // Half of the width and height to make it a circle
    marginBottom: 20, // Space between image and text
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff', // White color for better visibility on dark background
    marginBottom: 10, // Space between text and button
  },
  button: {
    backgroundColor: '#FFFF00', // Yellow background color
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 15, // Rounded corners for the button
    marginTop: 80, // Adds space above the button to move it down
  },
  buttonText: {
    color: '#000000', // Black text color for contrast
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GetStartedScreen;
