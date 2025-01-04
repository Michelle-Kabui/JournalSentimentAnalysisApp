import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [weekOffset, setWeekOffset] = useState(0);
  
  const getCurrentMonth = () => {
    const date = new Date();
    date.setDate(date.getDate() + weekOffset * 7);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const getCurrentWeek = () => {
    const today = new Date();
    today.setDate(today.getDate() + weekOffset * 7);
    const week = [];
    for (let i = -3; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      week.push({
        date: date.getDate(),
        day: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][date.getDay()],
        isToday: i === 0 && weekOffset === 0
      });
    }
    return week;
  };

  const handlePreviousWeek = () => {
    setWeekOffset(weekOffset - 1);
  };

  const handleNextWeek = () => {
    setWeekOffset(weekOffset + 1);
  };

  const moods = [
    { id: 'happy', emoji: '😀', label: 'Happy' },
    { id: 'sad', emoji: '😔', label: 'Sad' },
    { id: 'meh', emoji: '😐', label: 'Meh' },
    { id: 'stressed', emoji: '😣', label: 'Stressed' },
    { id: 'angry', emoji: '😠', label: 'Angry' },
    { id: 'scared', emoji: '😱', label: 'Scared' },
    { id: 'confused', emoji: '🤔', label: 'Confused' },
    { id: 'frustrated', emoji: '😤', label: 'Frustrated' },
    { id: 'crying', emoji: '😭', label: 'Crying' },
    { id: 'calm', emoji: '😌', label: 'Calm' }
  ];

  const quotes = [
    { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
    { text: "Happiness is not something ready-made. It comes from your own actions.", author: "Dalai Lama" },
    { text: "Every moment is a fresh beginning.", author: "T.S. Eliot" },
    { text: "Peace comes from within. Do not seek it without.", author: "Buddha" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" }
  ];

  useEffect(() => {
    const today = new Date();
    setCurrentQuote(today.getDate() % quotes.length);
  }, []);

  const navigationItems = [
    { 
      icon: ({color, size}) => <Feather name="home" size={size} color={color} />,
      label: 'Home',
      route: 'Home',
      onPress: () => console.log('Home') 
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
      onPress: () => navigation.navigate('Assessment')    },
    { 
      icon: ({color, size}) => <Feather name="user" size={size} color={color} />,
      label: 'Profile',
      route: 'Profile',
      onPress: () =>navigation.navigate('Profile') 
    }
  ];

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Calendar Section */}
        <View style={styles.calendarContainer}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={handlePreviousWeek}>
              <Feather name="chevron-left" size={24} color="#000000" />
            </TouchableOpacity>
            <Text style={styles.monthText}>{getCurrentMonth()}</Text>
            <TouchableOpacity onPress={handleNextWeek}>
              <Feather name="chevron-right" size={24} color="#000000" />
            </TouchableOpacity>
          </View>
          <View style={styles.weekContainer}>
            {getCurrentWeek().map((item, index) => (
              <View 
                key={index} 
                style={[
                  styles.dateItem,
                  item.isToday && styles.todayItem
                ]}
              >
                <Text style={[styles.dayText, item.isToday && styles.todayText]}>
                  {item.day}
                </Text>
                <Text style={[styles.dateText, item.isToday && styles.todayText]}>
                  {item.date}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Mood Section */}
        <View style={styles.moodContainer}>
          <Text style={styles.sectionTitle}>Today I'm Feeling...</Text>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.moodOptionsContent}
          >
            {moods.map((mood) => (
              <TouchableOpacity
                key={mood.id}
                style={[
                  styles.moodButton,
                  selectedMood === mood.id && styles.selectedMood
                ]}
                onPress={() => {
                  setSelectedMood(mood.id);
                  navigation.navigate('Journal', { mood: mood.label });
                }}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text numberOfLines={1} style={styles.moodLabel}>{mood.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

       
      <View style={styles.rowContainer}>
        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('Journal')}
        >
          <Text style={styles.cardTitle}>Daily Log</Text>
          <Text style={styles.cardSubtitle}>Keep record of how you are feeling?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('Assessment')}
        >
          <Text style={styles.cardTitle}>Check-in</Text>
          <Text style={styles.cardSubtitle}>Check your mental health status.</Text>
        </TouchableOpacity>
      </View>

        <TouchableOpacity 
          style={styles.zenChatCard}
          onPress={() => navigation.navigate('ZenChat')}
        >
          <Text style={styles.cardTitle}>ZenChat</Text>
          <Text style={styles.cardSubtitle}>Want to talk to someone? ZenChat is waiting to hear from you!</Text>
        </TouchableOpacity>

        <View style={styles.quoteCard}>
          <Text style={styles.cardTitle}>Quote of the Day</Text>
          <Text style={styles.quoteText}>"{quotes[currentQuote].text}"</Text>
          <Text style={styles.quoteAuthor}>- {quotes[currentQuote].author}</Text>
        </View>
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
              color: item.route === 'Home' ? "#007AFF" : "#666666", 
              size: 24 
            })}
            <Text style={[
              styles.navLabel,
              item.route === 'Home' && styles.navLabelActive
            ]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 0,
  },
  logo: {
    width: 300,
    height: 250,
  },
  calendarContainer: {
    margin: 0,
    padding: 0,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  dateItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 45,
    height: 70,
    borderRadius: 10,
  },
  todayItem: {
    backgroundColor: '#007AFF',
  },
  dayText: {
    fontSize: 12,
    color: '#000000',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  todayText: {
    color: '#ffffff',
  },
  moodContainer: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    margin: 10,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  moodContainer: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    margin: 10,
    padding: 10,
    paddingBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    marginLeft: 10,
  },
  moodOptionsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 20,
  },
  moodButton: {
    alignItems: 'center',
    padding: 3,
    marginHorizontal: 1,
    minWidth: 40,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 2,
  },
  moodLabel: {
    color: '#ffffff',
    fontSize: 10,
    textAlign: 'center',
  },
  selectedMood: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    width: '48%',
  },
  zenChatCard: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 15,
    margin: 10,
  },
  quoteCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    margin: 10,
    marginBottom: 80, 
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000000',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#000000',
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666666',
    marginTop: 5,
  },
  quoteAuthor: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'right',
    marginTop: 5,
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
    color: '#000000',
    marginTop: 4,
  },
});

export default HomeScreen;