// src/screens/auth/ForgotPasswordScreen.js
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

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    // Password reset logic will be implemented later
    Alert.alert(
      "Password Reset",
      "If an account exists for this email, you will receive password reset instructions.",
      [{ text: "OK", onPress: () => navigation.navigate('Login') }]
    );
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
          <Text style={styles.headerText}>Reset Password</Text>
          <Text style={styles.instructionText}>
            Enter your email address and we'll send you instructions to reset your password.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#87CEEB"
          />

          <TouchableOpacity 
            style={styles.resetButton}
            onPress={handleResetPassword}
          >
            <Text style={styles.resetButtonText}>Reset Password</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  resetButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: 'transparent',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#007AFF',
    padding: 15,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
});