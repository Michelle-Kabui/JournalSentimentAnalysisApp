import { API } from '../../services/api';
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image,
  KeyboardAvoidingView,  // Add this import
  Platform,
  ScrollView,
  Alert } from 'react-native';
import { TokenStorage } from '../../utils/tokenStorage';
import { AntDesign } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
  
    try {
      console.log('Attempting login...');
      const response = await API.login({
        email: email.trim(),
        password: password
      });
      
      if (response.tokens) {
        console.log('Got tokens:', response.tokens); // Add this to debug
        await TokenStorage.storeTokens(response.tokens);
        const savedToken = await TokenStorage.getAccessToken(); // Verify token was saved
        console.log('Verified saved token:', savedToken); // Add this to debug
        navigation.replace('Home');
      } else {
        Alert.alert('Error', 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert(
        'Login Failed', 
        'Please check your email and password and try again'
      );
    }
};
  

  return (
    <View style={styles.container}>  
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
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#87CEEB"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#87CEEB"
          />

          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
           >
          <Text style={styles.loginButtonText}>
           {loading ? 'Logging in...' : 'Login'}
          </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.registerButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

         
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8ec6e6',
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
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: 'transparent',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#007AFF',
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  registerButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  
});