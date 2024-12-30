import { API } from '../../services/api';
import { TokenStorage } from '../../utils/tokenStorage';
import  { useState, useEffect} from 'react';

import React from 'react';
import {
  View,
  Text, 
  Alert,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native';


const JournalDetailScreen = ({ route, navigation }) => {
  const { entryId } = route.params;
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntry();
  }, []);

  const fetchEntry = async () => {
    try {
      const token = await TokenStorage.getAccessToken();
      if (!token) {
        Alert.alert('Error', 'Please login again');
        return;
      }

      const entryData = await API.getJournalEntry(token, entryId);
      setEntry(entryData);
    } catch (error) {
      console.error('Error fetching entry:', error);
      Alert.alert('Error', 'Failed to load journal entry');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!entry) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text>Entry not found</Text>
      </View>
    );
  };


  // Function to format date
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Function to get mood emoji
  const getMoodEmoji = (mood) => {
    const moodEmojis = {
      'Happy': '😀',
      'Sad': '😔',
      'Calm': '😌',
      'Stressed': '😣',
      'Angry': '😠',
      'Scared': '😱',
      'Confused': '🤔',
      'Frustrated': '😤',
      'Crying': '😭'
    };
    return moodEmojis[mood] || '😐';
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
      onPress: () => navigation.navigate('Journal')
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
  const handleDelete = async () => {
    console.log('Delete button pressed');
    try {
        const token = await TokenStorage.getAccessToken();
        console.log('Got token:', token ? 'Yes' : 'No');

        if (!token) {
            Alert.alert('Error', 'Please login again');
            return;
        }

        // Show confirmation dialog
        Alert.alert(
            'Delete Entry',
            'Are you sure you want to delete this journal entry?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        console.log('Delete confirmed, attempting deletion...');
                        try {
                            await API.deleteJournalEntry(token, entryId);
                            console.log('Entry deleted successfully');
                            
                            Alert.alert(
                                'Success',
                                'Journal entry deleted successfully',
                                [{
                                    text: 'OK',
                                    onPress: () => {
                                        console.log('Navigating back to history');
                                        navigation.goBack();
                                    }
                                }]
                            );
                        } catch (error) {
                            console.error('Error in deletion process:', error);
                            Alert.alert('Error', 'Failed to delete journal entry');
                        }
                    }
                }
            ]
        );
    } catch (error) {
        console.error('Error in handleDelete:', error);
        Alert.alert('Error', 'An error occurred while trying to delete');
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

  <TouchableOpacity 
    style={[styles.headerButton, styles.editButton]}
    onPress={() => navigation.navigate('Journal', {
      isEditing: true,
      entry: entry
    })}
  >
    <Feather name="edit" size={24} color="#007AFF" />
  </TouchableOpacity>
</View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.dateContainer}>
            <Text style={styles.date}>
              {new Date(entry.created_at).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
            <Text style={styles.time}>
              {new Date(entry.created_at).toLocaleTimeString()}
            </Text>
          </View>

          <View style={styles.moodContainer}>
            <Text style={styles.moodEmoji}>{getMoodEmoji(entry.mood)}</Text>
            <Text style={styles.moodText}>Feeling {entry.mood}</Text>
          </View>

          <View style={styles.entryContainer}>
            <Text style={styles.entryText}>{entry.content}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomDeleteButton}>
  <TouchableOpacity 
    style={styles.deleteButton}
    onPress={handleDelete}
  >
    <Feather name="trash-2" size={24} color="#FF4444" />
    <Text style={styles.deleteButtonText}>Delete</Text>
  </TouchableOpacity>
</View>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8ec6e6',
  },
  header: {
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
    justifyContent: 'space-between',},
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#000000',
    fontSize: 16,
    marginLeft: 5,
  },
  editButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 80,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  time: {
    fontSize: 16,
    color: '#666666',
  },
  moodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  moodEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  moodText: {
    fontSize: 18,
    color: '#000000',
  },
  entryContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    minHeight: 300,
  },
  entryText: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 24,
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
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 15,
    position: 'absolute',
    bottom: 50,
    left: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  deleteButtonText: {
    color: '#FF4444',
    fontSize: 16,
    marginLeft: 5,
  },

  
});

export default JournalDetailScreen;