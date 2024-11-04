import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const ProfileScreen = ({ navigation, route }) => {
  // Get user data from route params
  const { name = 'John Doe', teacherNo = '12345', contact = '555-1234' } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile Screen</Text>

      {/* Profile Box */}
      <View style={styles.profileBox}>
        {/* Profile Icon */}
        <Image
          source={require('../assets/profile.png')} // Replace with your default icon path
          style={styles.profileIcon}
        />

        {/* Information Fields */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Name</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>{name}</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Teacher No.</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>{teacherNo}</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Contact</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>{contact}</Text>
          </View>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      {/* View History Button */}
      <TouchableOpacity style={styles.historyButton} onPress={() => navigation.navigate('History')}>
        <Text style={styles.historyButtonText}>History</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    position: 'absolute',
    top: 40, // Distance from the top of the screen; adjust as needed
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold', // Make header bold
    color: '#000', // Black color for the text
  },
  profileBox: {
    width: '90%',
    height: '75%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#004d00', // Dark green background for the profile box
    alignItems: 'center',
    shadowColor: '#000', // Shadow for iOS
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5, // Shadow for Android
    marginTop: 100, // Adjust position as needed
    elevation: 100,
  },
  profileIcon: {
    width: 100, // Increased width
    height: 100, // Increased height
    borderRadius: 50, // Circular shape
    marginBottom: 20, // Space between the icon and text
  },
  infoContainer: {
    width: '90%',
    marginBottom: 10, // Space between fields
  },
  infoLabel: {
    fontSize: 18,
    color: '#ffffff', // Light gray for labels
    marginBottom: 5,
    fontWeight: 'bold', // Make label bold
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#e0e0e0', // Light gray background for the info box
    paddingVertical: 15, // Increased padding for more height
    paddingHorizontal: 15,
    borderRadius: 40,
  },
  infoText: {
    fontSize: 16,
    color: '#333', // Dark text color
    fontWeight: 'bold', // Make info text bold
    textAlign: 'center',
  },
  // Logout button
  logoutButton: {
    position: 'absolute',
    bottom: 30, // Distance from the bottom of the screen; adjust as needed
    right: 60, // Distance from the left side of the screen
    backgroundColor: '#FF0000', // Red color for logout button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
  },
  historyButton: {
    position: 'absolute',
    bottom: 30, // Same height as logout button
    left: 60, // Distance from the left side of the screen
    backgroundColor: '#004d00', // Dark green color for the history button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
  },
  buttonText: {
    color: '#ffffff', // White text color
    fontSize: 16,
    fontWeight: 'bold', // Make logout button text bold
  },
  historyButtonText: {
    color: '#ffffff', // White text color for history button
    fontSize: 16,
    fontWeight: 'bold', // Make history button text bold
  },
});

export default ProfileScreen;
