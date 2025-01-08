import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Button } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation, route }) => {
  const { id } = route.params || {}; // Assuming you get `id` from `route.params`
  
  const [isModalVisible, setIsModalVisible] = useState(false); // State for the logout confirmation modal
  const [storedUserData, setStoredUserData] = useState({});
  const [userType, setUserType] = useState(''); // State to hold user type (role)

  // Function to handle logout
  const handleLogout = () => {
    // Clear all data from AsyncStorage
    AsyncStorage.clear()
      .then(() => {
        // Navigate to Login screen after clearing AsyncStorage
        navigation.navigate('Login');
      })
      .catch((error) => {
        console.error('Error clearing AsyncStorage:', error);
      });
  };

  // Function to show the confirmation modal
  const showLogoutConfirmation = () => {
    setIsModalVisible(true);
  };

  // Function to hide the confirmation modal
  const hideLogoutConfirmation = () => {
    setIsModalVisible(false);
  };

  // Fetch user data from AsyncStorage and API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const username = await AsyncStorage.getItem('userName');
        const userTypeFromStorage = await AsyncStorage.getItem('user_type'); // Fetching the user type (role)
        
        if (token) {
          const response = await axios.get('http://52.62.183.28/api/accounts/', {
            headers: {
              'Authorization': `Token ${token}`,
            },
          });
          const userData = response.data;

          setStoredUserData({
            username: username,
            userType: userTypeFromStorage || 'user', // Default to 'user' if no type is found
          });
          setUserType(userTypeFromStorage);

          // Store user data in AsyncStorage
          await AsyncStorage.setItem('userProfile', JSON.stringify(userData));
        } else {
          console.log('No token found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [id]);

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
          <Text style={styles.infoLabel}>Username</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>{storedUserData.username || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Role</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>{userType || 'N/A'}</Text>
          </View>
        </View>

        {/* Show instructor info if user_type is 'instructor' */}
        {userType === 'instructor' && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Instructor</Text>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>{storedUserData.instructor || 'N/A'}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={showLogoutConfirmation}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      {/* View History Button */}
      <TouchableOpacity style={styles.historyButton} onPress={() => navigation.navigate('History')}>
        <Text style={styles.historyButtonText}>History</Text>
      </TouchableOpacity>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={hideLogoutConfirmation} // When tapping outside, close the modal
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to log out?</Text>

            {/* Buttons for confirming or cancelling logout */}
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={hideLogoutConfirmation} color="gray" />
              <Button title="Yes" onPress={handleLogout} color="red" />
            </View>
          </View>
        </View>
      </Modal>
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
  resetPasswordButton: {
    backgroundColor: '#FF0000', // Red color for reset password button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginTop: 10, // Space between the info box and reset password button
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
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});

export default ProfileScreen;
