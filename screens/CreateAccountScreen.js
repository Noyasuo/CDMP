import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const CreateAccountScreen = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [position, setPosition] = useState('');
    const [address, setAddress] = useState('');

    const handleCreateAccount = () => {
        // Add your account creation logic here
        if (username && email && password && contactNumber && idNumber && position && address) {
            Alert.alert("Account Created!", `Welcome, ${username}!`);
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
                placeholderTextColor="black" // Placeholder color
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholderTextColor="black" // Placeholder color
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="black" // Placeholder color
            />
            <TextInput
                style={styles.input}
                placeholder="Contact Number"
                value={contactNumber}
                onChangeText={setContactNumber}
                keyboardType="phone-pad"
                placeholderTextColor="black" // Placeholder color
            />
            <TextInput
                style={styles.input}
                placeholder="ID Number"
                value={idNumber}
                onChangeText={setIdNumber}
                placeholderTextColor="black" // Placeholder color
            />
            <TextInput
                style={styles.input}
                placeholder="Position"
                value={position}
                onChangeText={setPosition}
                placeholderTextColor="black" // Placeholder color
            />
            <TextInput
                style={styles.input}
                placeholder="Address"
                value={address}
                onChangeText={setAddress}
                placeholderTextColor="black" // Placeholder color
            />
            <Button title="Create Account" onPress={handleCreateAccount} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#004d00', // Set background color to dark green
    },
    title: {
        fontSize: 24,
        marginBottom: 24,
        textAlign: 'center',
        color: '#ffffff', // Title text color
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 10,
        borderRadius: 20,
        backgroundColor: 'white', // Set input background color to white
    },
});

export default CreateAccountScreen;
