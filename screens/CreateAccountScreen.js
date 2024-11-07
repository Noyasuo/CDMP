import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import Picker

const CreateAccountScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [position, setPosition] = useState(''); // State for position
    const [address, setAddress] = useState('');

    const handleCreateAccount = () => {
        if (username && email && password && contactNumber && idNumber && position && address) {
            if (password !== confirmPassword) {
                Alert.alert("Error", "Passwords do not match.");
                return;
            }

            Alert.alert("Account Created!", `Welcome, ${username}!`, [
                {
                    text: "OK", 
                    onPress: () => {
                        // After successful account creation, navigate to login screen
                        navigation.navigate('Login');
                    }
                }
            ]);
            // You can add your API call here to create the account
        } else {
            Alert.alert("Error", "Please fill in all fields.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                placeholderTextColor="black"
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholderTextColor="black"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="black"
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholderTextColor="black"
            />
            <TextInput
                style={styles.input}
                placeholder="Contact Number"
                value={contactNumber}
                onChangeText={setContactNumber}
                keyboardType="phone-pad"
                placeholderTextColor="black"
            />
            <TextInput
                style={styles.input}
                placeholder="ID Number"
                value={idNumber}
                onChangeText={setIdNumber}
                placeholderTextColor="black"
            />
            
            <Picker
                selectedValue={position}
                onValueChange={(itemValue) => setPosition(itemValue)}
                style={styles.picker} // Add custom styling to Picker
            >
                <Picker.Item label="Select Position" value="" />
                <Picker.Item label="Head" value="Head" />
                <Picker.Item label="Dean" value="Dean" />
            </Picker>
            <TextInput
                style={styles.input}
                placeholder="Address"
                value={address}
                onChangeText={setAddress}
                placeholderTextColor="black"
            />
            
            <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
                <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#004d00',
    },
    title: {
        fontSize: 24,
        marginBottom: 24,
        textAlign: 'center',
        color: '#ffffff',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 10,
        backgroundColor: 'white',
    },
    label: {
        fontSize: 16,
        color: 'white',
        marginBottom: 8,
    },
    picker: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        backgroundColor: 'white',
    },
    button: {
        width: '100%',
        height: 40,
        backgroundColor: '#FFFF00', // Yellow background for the button
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0,
    },
    buttonText: {
        color: '#000000', // Black text color
        fontSize: 18,
    },
});

export default CreateAccountScreen;
