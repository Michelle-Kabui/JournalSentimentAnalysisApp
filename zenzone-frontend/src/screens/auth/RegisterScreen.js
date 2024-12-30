// src/screens/auth/RegisterScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView, 
  Alert
} from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // For Google icon
import { API } from '../../services/api';
import { TokenStorage } from '../../utils/tokenStorage'; 

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !username || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
  
    console.log('Starting registration with:', {
      email,
      username,
      password: '***'
    });
  
    try {
      const response = await API.register({
        email: email.trim(),
        username: username.trim(),
        password: password
      });
      console.log('Registration successful:', response);
      
      if (response.tokens) {
        Alert.alert('Success', 'Registration successful!', [
          {
            text: 'OK',
            onPress: () => navigation.replace('Login')
          }
        ]);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      Alert.alert('Error', 'Registration failed. Please check the console for details.');
    }
  };
  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="#8EC6E6"
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#8EC6E6"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#8EC6E6"
          />

          <TouchableOpacity 
             style={styles.registerButton}
             onPress={handleRegister}
             disabled={loading}
           >
             <Text style={styles.registerButtonText}>
               {loading ? 'Registering...' : 'Register'}
             </Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

         

          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
// src/screens/auth/RegisterScreen.js
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#8ec6e6', // Updated background color
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: 20,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 40,
    },
    logo: {
      width: 300,
      height: 300,
      marginBottom: 10,
    },
    logoText: {
      fontSize: 24,
      color: '#000000',
      fontWeight: '400',
    },
    formContainer: {
      width: '100%',
      paddingHorizontal: 20,
    },
    input: {
      backgroundColor: '#FFFFFF',
      borderRadius: 25,
      padding: 15,
      marginBottom: 15,
      fontSize: 16,
      borderWidth: 1,
      borderColor: '#007AFF',
    },
    registerButton: {
      backgroundColor: '#007AFF',
      borderRadius: 25,
      padding: 15,
      alignItems: 'center',
      marginBottom: 10,
      borderWidth: 1,
      borderColor: '#007AFF',
    },
    registerButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    loginButton: {
      backgroundColor: 'transparent',
      borderRadius: 25,
      borderWidth: 1,
      borderColor: '#007AFF',
      padding: 15,
      alignItems: 'center',
      marginBottom: 10,
    },
    loginButtonText: {
      color: '#007AFF',
      fontSize: 16,
      fontWeight: '500',
    },
    
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 20,
    },
    divider: {
      flex: 1,
      height: 1,
      backgroundColor: '#007AFF',
    },
    dividerText: {
      marginHorizontal: 10,
      color: '#007AFF',
      fontWeight: '500',
    },
    googleButton: {
      flexDirection: 'row',
      backgroundColor: '#FFFFFF',
      borderRadius: 25,
      padding: 15,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 15,
      borderWidth: 1,
      borderColor: '#EA4335',
    },
    googleButtonText: {
      color: '#000000',
      fontSize: 16,
      fontWeight: '500',
      marginLeft: 10,
    },
  });