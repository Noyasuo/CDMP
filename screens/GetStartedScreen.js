import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';  // Import LinearGradient

const GetStartedScreen = ({ navigation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false); // State to track modal visibility
  const [hasAgreed, setHasAgreed] = useState(false); // State to track user agreement

  // Function to handle navigation if the user has agreed
  const handleNavigation = () => {
    if (hasAgreed) {
      navigation.navigate('Login');
    } else {
      Alert.alert('Agreement Required', 'You must agree to the terms to proceed.');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#32CD32', '#006400']}
        style={styles.gradient}
      >
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Colegio De Montalban</Text>
          <Image source={require('./logo/logo.png')} style={styles.logo} />
          
          <TouchableOpacity style={styles.agreeButton} onPress={() => setIsModalVisible(true)}>
            <Text style={styles.agreeButtonText}>View User Agreement</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navigationButton} onPress={handleNavigation}>
            <Text style={styles.navigationButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.agreementTitle}>User Agreement</Text>
            <Text style={styles.agreementText}>
              
              - This Application is for head and dean only.{"\n"}
              - This Application takes a simple user data.{"\n"}
              - Ensure correct order information.{"\n"}
              - Contact support for assistance with any issues.{"\n"}
            </Text>
            <Text style={styles.agreementConfirm}>
              By using this app and making a reservation, you agree to these terms.
            </Text>
            <TouchableOpacity
              style={styles.agreeButton}
              onPress={() => {
                setHasAgreed(true);
                setIsModalVisible(false);
              }}
            >
              <Text style={styles.agreeButtonText}>Agree</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width:'100%',
  },
  innerContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    fontStyle: 'italic',
    color: '#fff',  
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  agreeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
  },
  navigationButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    backgroundColor: '#1C2841',
  },
  navigationButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  agreementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  agreementText: {
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20,
  },
  agreementConfirm: {
    fontSize: 14,
    marginBottom: 20,
    fontWeight: 'bold',
    padding:20,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    backgroundColor: '#FF6347',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  agreeButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center'
  },
});

export default GetStartedScreen;
