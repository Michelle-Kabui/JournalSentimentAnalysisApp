import { API } from '../../services/api';
import { TokenStorage } from '../../utils/tokenStorage';
import  { useState, useEffect} from 'react';
import { useFocusEffect } from '@react-navigation/native';

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';


const JournalHistoryScreen = ({ navigation }) => {
  // Add state for journal entries
  const [journalEntries, setJournalEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add useEffect to fetch entries when screen loads
  useFocusEffect(
    React.useCallback(() => {
      fetchJournalEntries();
    }, [])
  );

  const fetchJournalEntries = async () => {
    try {
        setLoading(true);
        const token = await TokenStorage.getAccessToken();
        console.log('Token available:', token ? 'Yes' : 'No'); // Debug log
        
        if (!token) {
            console.log('No token found, redirecting to login');
            navigation.replace('Login');
            return;
        }

        const entries = await API.getJournalEntries(token);
        setJournalEntries(entries);
    } catch (error) {
        console.error('Error fetching entries:', error);
        if (error.message.includes('401') || error.message.includes('token')) {
            Alert.alert(
                'Session Expired',
                'Please login again',
                [{ text: 'OK', onPress: () => navigation.replace('Login') }]
            );
        } else {
            Alert.alert('Error', 'Failed to load journal entries');
        }
    } finally {
        setLoading(false);
    }
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="chevron-left" size={24} color="#000000" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Journal History</Text>
        <View style={{ width: 60 }}>
          <Text> </Text>
        </View>
      </View>

      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : (
            journalEntries.map((entry) => (
              <TouchableOpacity
                key={entry.id}
                style={styles.entryCard}
                onPress={() => navigation.navigate('JournalDetail', { entryId: entry.id })}
              >
                <View style={styles.entryHeader}>
                  <Text style={styles.entryDate}>
                    {new Date(entry.created_at).toLocaleDateString()}
                  </Text>
                  <Text style={styles.entryTime}>
                    {new Date(entry.created_at).toLocaleTimeString()}
                  </Text>
                </View>
                
                <View style={styles.moodContainer}>
    <Text style={styles.moodEmoji}>{getMoodEmoji(entry.mood)}</Text>
    <Text style={styles.moodText}>{entry.mood}</Text>
    {/* Add sentiment display */}
    <View style={[
      styles.sentimentBadge, 
      { backgroundColor: entry.sentiment === 'positive' ? '#4CAF50' : 
                        entry.sentiment === 'negative' ? '#FF5252' : 
                        '#FFC107' }
    ]}>
      <Text style={styles.sentimentText}>{entry.sentiment}</Text>
    </View>
  </View>
                
                <Text style={styles.entryPreview} numberOfLines={2}>
                  {entry.content}
                </Text>
                
                <View style={styles.entryFooter}>
                  <Text style={styles.readMore}>Read More</Text>
                  <Feather name="chevron-right" size={20} color="#007AFF" />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

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
            ]}>
              {item.label}
            </Text>
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
  headerContainer: {
    backgroundColor: '#8ec6e6', 
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
    flexDirection: 'row', 
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 15,
    paddingBottom: 80,
  },
  entryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  entryDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  entryTime: {
    fontSize: 14,
    color: '#666666',
  },
  moodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  moodEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  moodText: {
    fontSize: 16,
    color: '#000000',
  },
  entryPreview: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 10,
  },
  entryFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 60,
  },
  backButtonText: {
    color: '#000000',
    fontSize: 16,
    marginLeft: 5,
  },
  readMore: {
    fontSize: 14,
    color: '#007AFF',
    marginRight: 5,
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
  sentimentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  sentimentText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  
});

export default JournalHistoryScreen;