import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';  // Import LinearGradient
import Ionicons from 'react-native-vector-icons/Ionicons';

const GetStartedScreen = ({ navigation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [isPrivacyModalVisible, setIsPrivacyModalVisible] = useState(false); 

  const [hasAgreedTerms, setHasAgreedTerms] = useState(false); 
  const [hasAgreedPrivacy, setHasAgreedPrivacy] = useState(false);

  // Function to handle navigation if the user has agreed
  const handleNavigation = () => {
    if (hasAgreedTerms && hasAgreedPrivacy) {
      navigation.navigate('Login');
    } else {
      Alert.alert('Agreement Required', 'You must agree to both the Terms and Conditions and the Privacy Policy to proceed.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.gradient, { backgroundColor: '#0c7e0c' }]}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Procurement</Text>
          <Text style={styles.title}>Colegio De Montalban</Text>
          <Image source={require('./logo/logo.png')} style={styles.logo} />
          
          <View style={{ width: '100%', paddingHorizontal: 20 }}>
            <Text style={styles.agreementHeader}>I agree to the:</Text>

            {/* Terms and Conditions Checkbox */}
            <View style={styles.checkboxContainer}>
              <TouchableOpacity 
                style={styles.checkbox} 
                onPress={() => setHasAgreedTerms(!hasAgreedTerms)}
              >
                <Ionicons 
                  name={hasAgreedTerms ? "checkbox" : "square-outline"} 
                  size={24} 
                  color="white" 
                />
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                <Text style={styles.termsLink}>Terms and Conditions</Text>
              </TouchableOpacity>
            </View>

            {/* Privacy Policy Checkbox */}
            <View style={styles.checkboxContainer}>
              <TouchableOpacity 
                style={styles.checkbox} 
                onPress={() => setHasAgreedPrivacy(!hasAgreedPrivacy)}
              >
                <Ionicons 
                  name={hasAgreedPrivacy ? "checkbox" : "square-outline"} 
                  size={24} 
                  color="white" 
                />
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => setIsPrivacyModalVisible(true)}>
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.navigationButton} onPress={handleNavigation}>
            <Text style={styles.navigationButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Terms and Conditions Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.agreementTitle}>Terms and Conditions</Text>
            <ScrollView style={{ maxHeight: 400 }}>
              <Text style={styles.agreementText}>
                1. Acceptance of Terms{"\n"}
                By creating an account or using the Service, you agree to be bound by this Agreement. If you are using the Service on behalf of an organization, you represent that you have the legal authority to bind that organization to these terms.{"\n"}{"\n"}

                2. Description of Service{"\n"}
                CDM Procurement provides a digital platform for procurement workflow management, including:{"\n"}
                - Requisition and Purchase Order (PO) creation.{"\n"}
                - Internal approval routing and tracking.{"\n"}
                - Vendor database management and record-keeping.{"\n"}
                - Spend analytics and reporting.{"\n"}
                Important: CDM Procurement is a management and record-keeping tool only. It is not a payment processor, bank, or money transmitter.{"\n"}{"\n"}

                3. User Responsibilities & Account Security{"\n"}
                Authorized Access: You are responsible for all activity occurring under your account. You must maintain the confidentiality of your login credentials.{"\n"}
                Approval Authority: You are responsible for ensuring that users granted "Approver" status within the app have the actual internal corporate authority to authorize company spending.{"\n"}
                Data Integrity: You agree to provide accurate and complete information regarding vendors, pricing, and quantities.{"\n"}{"\n"}

                4. Disclaimer of Financial Responsibility{"\n"}
                CDM Procurement does not facilitate, handle, or execute the transfer of funds. By using the Service, you acknowledge:{"\n"}
                No Payment Processing: All financial transactions resulting from the use of this app must be completed through your own external banking or accounting systems.{"\n"}
                Data Verification: You are solely responsible for verifying the accuracy of all quantities, pricing, and vendor bank details. We are not liable for costs incurred due to data entry errors or unauthorized internal approvals.{"\n"}
                Third-Party Disputes: We are not a party to any contract or purchase agreement generated within the app. Disputes regarding goods, services, or delivery are strictly between you and your vendors.{"\n"}{"\n"}

                5. Digital Approvals & Audit Logs{"\n"}
                Electronic Record: You agree that clicking "Approve," "Authorize," or similar prompts within the Service constitutes a valid electronic action intended to have the same weight as a physical signature for internal audit purposes.{"\n"}
                Audit Trail: CDM Procurement maintains logs of user actions. You acknowledge that these logs are provided "as-is" for your record-keeping and internal compliance.{"\n"}{"\n"}

                6. Data Ownership & Privacy{"\n"}
                Client Data: You retain all ownership rights to the data you input into the Service.{"\n"}
                License to Host: You grant us a limited license to host, transmit, and display your data solely as necessary to provide the Service to you.{"\n"}
                Privacy: Your use of the Service is also governed by our Privacy Policy, which details how we protect your information.{"\n"}{"\n"}

                7. System Availability & Maintenance{"\n"}
                While we strive for high availability, CDM Procurement is provided on an "as-is" and "as-available" basis. We are not liable for:{"\n"}
                Planned maintenance or emergency downtime.{"\n"}
                Loss of data caused by third-party integrations or user-side internet failures.{"\n"}
                Indirect or consequential damages arising from the inability to access the Service.{"\n"}{"\n"}

                8. Termination{"\n"}
                By You: You may terminate your account at any time. It is your responsibility to export your procurement records prior to termination.{"\n"}
                By Us: We reserve the right to suspend or terminate access if we detect fraudulent activity, "ghost" vendor creation, or any breach of these terms.{"\n"}{"\n"}

                9. Governing Law{"\n"}
                This Agreement shall be governed by and construed in accordance with the laws of [Insert Your State/Country], without regard to its conflict of law principles.
              </Text>
            </ScrollView>
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal
        visible={isPrivacyModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsPrivacyModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.agreementTitle}>Privacy Policy</Text>
            <ScrollView style={{ maxHeight: 400 }}>
              <Text style={styles.agreementText}>
                [Privacy Policy Placeholder]
                {"\n"}{"\n"}
                We value your privacy. This section will detail how we collect, use, and protect your data.
                {"\n"}{"\n"}
                (You can update this section with your full Privacy Policy text later.)
              </Text>
            </ScrollView>
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsPrivacyModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
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
  agreeButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  navigationButton: {
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 25,
    backgroundColor: '#1C2841',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  navigationButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
    paddingHorizontal: 0, 
    justifyContent: 'flex-start'
  },
  agreementHeader: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  checkbox: {
    marginRight: 10,
  },
  textContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    flex: 1,
  },
  agreementLabel: {
    color: '#fff',
    fontSize: 16,
  },
  termsLink: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
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
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    backgroundColor: '#888',
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default GetStartedScreen;
