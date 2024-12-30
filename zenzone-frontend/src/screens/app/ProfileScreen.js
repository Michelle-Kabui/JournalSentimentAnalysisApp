import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
  // Dummy user data - will be replaced with actual user data
  const userData = {
    name: "John Doe",
    email: "johndoe@example.com"
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout", 
          onPress: () => navigation.replace('Login'),
          style: 'destructive'
        }
      ]
    );
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
      onPress: () => console.log('Already on Profile')
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView style={styles.scrollView}>
  <View style={styles.content}>
    {/* User Info Section */}
    <View style={styles.userInfoContainer}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{userData.name}</Text>
        <Text style={styles.userEmail}>{userData.email}</Text>
      </View>
    </View>

    {/* Analytics Navigation Section */}
    <View style={styles.analyticsContainer}>
      <Text style={styles.sectionTitle}>Analytics & Visualizations</Text>

      <TouchableOpacity
        style={styles.analyticsCard}
        onPress={() => navigation.navigate('MoodVisualization')}
      >
        <Feather name="bar-chart-2" size={24} color="#007AFF" />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>Mood Analytics</Text>
          <Text style={styles.cardDescription}>View your mood patterns and trends</Text>
        </View>
        <Feather name="chevron-right" size={24} color="#007AFF" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.analyticsCard}
        onPress={() => navigation.navigate('JournalAnalytics')}
      >
        <Feather name="pie-chart" size={24} color="#007AFF" />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>Journal Analytics</Text>
          <Text style={styles.cardDescription}>Analyze your journal entries</Text>
        </View>
        <Feather name="chevron-right" size={24} color="#007AFF" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.analyticsCard}
        onPress={() => navigation.navigate('AssessmentHistory')}
      >
        <MaterialCommunityIcons name="history" size={24} color="#007AFF" />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>Assessment History</Text>
          <Text style={styles.cardDescription}>View past assessment results</Text>
        </View>
        <Feather name="chevron-right" size={24} color="#007AFF" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.analyticsCard}
        onPress={() => navigation.navigate('JournalHistory')}
      >
        <Feather name="user" size={24} color="#007AFF" />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>Journal History</Text>
          <Text style={styles.cardDescription}>View your past journal entries</Text>
        </View>
        <Feather name="chevron-right" size={24} color="#007AFF" />
      </TouchableOpacity>
    </View>

    {/* Logout Button */}
    <TouchableOpacity
      style={styles.logoutButton}
      onPress={handleLogout}
    >
      <Feather name="log-out" size={20} color="#FF4444" />
      <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
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
              color: item.route === 'Profile' ? "#007AFF" : "#666666", 
              size: 24 
            })}
            <Text style={[
              styles.navLabel,
              item.route === 'Profile' && styles.navLabelActive
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
  },
  headerTitle: {
    fontSize: 28, // Larger title
    fontWeight: 'bold',
    color: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 80,
  },
  userInfoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20, // Softer corners
    paddingVertical: 30, // Increased padding for vertical alignment
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center', // Center-align content
    elevation: 3, // Slight shadow for elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 26, // Increased font size
    fontWeight: 'bold',
    color: '#333333', // Slightly darker color for contrast
    marginBottom: 8, // Added space between name and email
  },
  userEmail: {
    fontSize: 18, // Slightly larger font size
    color: '#555555', // Softer gray for contrast
  },
  analyticsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 15,
  },
  analyticsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666666',
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 16,
    color: '#FF4444',
    fontWeight: 'bold',
    marginLeft: 10,
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

export default ProfileScreen;