import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { API } from '../../services/api';
import { TokenStorage } from '../../utils/tokenStorage';

const ZenChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasAcceptedDisclaimer, setHasAcceptedDisclaimer] = useState(false);
  const scrollViewRef = useRef();

  const showDisclaimer = () => {
    Alert.alert(
      "Important Medical Disclaimer",
      "ZenChat is an AI-powered conversational tool designed to provide general information and support. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified healthcare providers with any questions you may have regarding medical conditions. Never disregard professional medical advice or delay in seeking it because of something you have read in this chat.\n\nIf you're experiencing a medical emergency, call your local emergency services immediately.",
      [
        {
          text: "I Understand",
          onPress: () => setHasAcceptedDisclaimer(true)
        },
        {
          text: "Go Back",
          onPress: () => navigation.goBack(),
          style: "cancel"
        }
      ]
    );
  };

  React.useEffect(() => {
    if (!hasAcceptedDisclaimer) {
      showDisclaimer();
    }
  }, []);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
        role: 'user',
        content: inputText.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
        const token = await TokenStorage.getAccessToken();
        console.log('Retrieved token:', token ? 'Yes' : 'No');
        
        if (!token) {
            Alert.alert('Error', 'Not logged in. Please log in again.');
            navigation.replace('Login');
            return;
        }

        const response = await API.sendChatMessage(token, userMessage.content);
        console.log('Got response:', response);
        
        if (response && response.response) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: response.response
            }]);
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        console.error('Detailed error in sendMessage:', error);
        Alert.alert(
            'Error', 
            `Failed to send message: ${error.message || 'Unknown error'}`
        );
        
        // Add error message to chat
        setMessages(prev => [...prev, {
            role: 'system',
            content: 'Sorry, I encountered an error processing your message. Please try again.'
        }]);
    } finally {
        setLoading(false);
    }
};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="chevron-left" size={24} color="#000000" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ZenChat</Text>
        <TouchableOpacity 
          style={styles.infoButton}
          onPress={showDisclaimer}
        >
          <Feather name="info" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.chatContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
          style={styles.messagesContainer}
        >
          <View style={styles.welcomeMessage}>
            <Text style={styles.welcomeTitle}>Welcome to ZenChat</Text>
            <Text style={styles.welcomeText}>
              I'm here to listen and provide support. While I can offer information and guidance,
              remember that I'm not a substitute for professional medical advice.
            </Text>
          </View>

          {messages.map((message, index) => (
            <View 
              key={index} 
              style={[
                styles.messageContainer,
                message.role === 'user' ? styles.userMessage : styles.assistantMessage
              ]}
            >
              <Text style={styles.messageText}>{message.content}</Text>
            </View>
          ))}

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#007AFF" />
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            multiline
            maxHeight={100}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={sendMessage}
            disabled={loading || !inputText.trim()}
          >
            <Feather 
              name="send" 
              size={24} 
              color={!inputText.trim() ? '#CCCCCC' : '#007AFF'}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8ec6e6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#8ec6e6',
    borderBottomWidth: 1,
    borderBottomColor: '#b0d9ec',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    marginLeft: 5,
    color: '#000000',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  infoButton: {
    padding: 5,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  messagesContainer: {
    flex: 1,
    padding: 15,
  },
  welcomeMessage: {
    backgroundColor: '#F0F8FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  messageContainer: {
    maxWidth: '80%',
    marginBottom: 10,
    padding: 12,
    borderRadius: 15,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F0F0',
  },
  messageText: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 22,
  },
  loadingContainer: {
    padding: 10,
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ZenChatScreen;