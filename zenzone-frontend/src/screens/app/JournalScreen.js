import { API } from '../../services/api';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
  Keyboard
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { TokenStorage } from '../../utils/tokenStorage';

const JournalScreen = ({ route, navigation }) => {

  const { mood, isEditing, entry } = route.params || { 
    mood: '', 
    isEditing: false, 
    entry: null 
  };

  // Initialize state using these values
  const [journalEntry, setJournalEntry] = useState(isEditing ? entry.content : '');
  const [customMood, setCustomMood] = useState(isEditing ? entry.mood : (mood || ''));

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  
  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const handleSave = async () => {
    try {
      const token = await TokenStorage.getAccessToken();
      if (!token) {
        Alert.alert('Error', 'Please login again');
        return;
      }

      const entryData = {
        content: journalEntry,
        mood: customMood
      };

      let savedEntry;
      if (entry && entry.id) { // Check if we're editing an existing entry
        savedEntry = await API.updateJournalEntry(token, entry.id, entryData);
      } else {
        savedEntry = await API.createJournalEntry(entryData, token);
      }

      console.log('Saved entry:', savedEntry);

      Alert.alert(
        'Success',
        `Journal entry ${entry ? 'updated' : 'saved'} successfully!`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Error saving journal entry:', error);
      Alert.alert('Error', 'Failed to save journal entry');
    }
  };

  const navigationItems = [
    { 
      icon: ({color, size}) => <Feather name="home" size={size} color={color} />,
      label: 'Home',
      route: 'Home',
      onPress: () => navigation.navigate('Home')
    },
    { 
      icon: ({color, size}) => <Feather name="edit" size={size} color={color} />,
      label: 'Journal',
      route: 'Journal',
      onPress: () => console.log('Already on Journal')
    },
    { 
      icon: ({color, size}) => <MaterialCommunityIcons name="book-open-variant" size={size} color={color} />,
      label: 'Assessment',
      route: 'Assessment',
      onPress: () => navigation.navigate('Assessment')
    },
    { 
      icon: ({color, size}) => <Feather name="user" size={size} color={color} />,
      label: 'Profile',
      route: 'Profile',
      onPress: () => navigation.navigate('Profile')
    }
  ];

  return (
    <View style={styles.mainContainer}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={() => Keyboard.dismiss()}
          scrollEventThrottle={16}
        >
         
         <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 40, marginRight: 20 }}>
  
</View>

          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>My Day</Text>
            <Text style={styles.headerDate}>{getCurrentDate()}</Text>
          </View>
          
         


          <View style={styles.moodContainer}>
            <Text style={styles.moodLabel}>Mood:</Text>
            <TextInput
              style={styles.moodInput}
              value={customMood}
              onChangeText={setCustomMood}
              placeholder="Enter your mood..."
              placeholderTextColor="#666666"
            />
          </View>
          

          <TextInput
    style={styles.journalInput}
    multiline
    placeholder="Write about your day..."
    value={journalEntry}  // This will show the existing content when editing
    onChangeText={setJournalEntry}
    placeholderTextColor="#666666"
    textAlignVertical="top"
    scrollEnabled={true}
    maxHeight={300}
  />

          <TouchableOpacity 
            style={styles.saveButton}
            onPress={() => {
              dismissKeyboard();
              handleSave();
            }}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
         

          {/* Add extra padding at bottom for keyboard */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          {navigationItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.navItem}
              onPress={item.onPress}
            >
              {item.icon({ 
                color: item.route === 'Journal' ? "#007AFF" : "#666666", 
                size: 24 
              })}
              <Text style={[
                styles.navLabel,
                item.route === 'Journal' && styles.navLabelActive
              ]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#8ec6e6',
  },
  container: {
    flex: 1,
  },

  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    backgroundColor: '#8ec6e6', // Match AssessmentScreen header color
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#b0d9ec',
    flexDirection: 'row', // Row layout for title and date
    justifyContent: 'space-between', // Space out elements
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  headerDate: {
    fontSize: 16,
    color: '#000000',
  },
  moodContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  moodLabel: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 10,
  },
  moodInput: {
    fontSize: 18,
    color: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#007AFF',
    paddingBottom: 5,
  },
  journalInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    minHeight: 400,
    textAlignVertical: 'top',
    marginBottom: 20,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginBottom: 80,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 6,
    left: 0,
    right: 0,
    backgroundColor: '#8ec6e6',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  navLabelActive: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default JournalScreen;