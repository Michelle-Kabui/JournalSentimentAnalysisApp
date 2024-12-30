import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const AssessmentScreen = ({ navigation }) => {
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
      onPress: () => console.log('Already on Assessment')
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
      <ScrollView style={styles.container}>
        {/* Title Container */}
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Mood Assessment</Text>
        </View>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          Note: These assessments are screening tools and not diagnostic instruments. 
          Please consult with a mental health professional for proper evaluation and diagnosis.
        </Text>

        {/* Introduction */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerSubtitle}>
            Discover tools to help you understand and track your mood patterns.
          </Text>
        </View>

        {/* MDQ Assessment Card */}
        <TouchableOpacity 
          style={styles.assessmentCard}
          onPress={() => navigation.navigate('MDQ')}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Mood Disorder Questionnaire (MDQ)</Text>
            <Text style={styles.timeEstimate}>5-10 minutes</Text>
          </View>
          
          <Text style={styles.cardDescription}>
            A brief questionnaire designed to help identify bipolar spectrum disorders. 
            Includes 13 yes/no questions about your experiences with mood and behavior, one question about occurrence period of the symptoms and one question about severity of the symptoms.
          </Text>
          
          <View style={styles.expectationsList}>
            <Text style={styles.expectationsTitle}>What to expect:</Text>
            <Text style={styles.expectationItem}>• Questions about mood patterns</Text>
            <Text style={styles.expectationItem}>• Yes/No responses</Text>
            <Text style={styles.expectationItem}>• Questions about impact on daily life</Text>
          </View>
        </TouchableOpacity>

        {/* BSDS Assessment Card */}
        <TouchableOpacity 
          style={styles.assessmentCard}
          onPress={() => navigation.navigate('BSDS')}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Bipolar Spectrum Diagnostic Scale (BSDS)</Text>
            <Text style={styles.timeEstimate}>5-10 minutes</Text>
          </View>
          
          <Text style={styles.cardDescription}>
            A narrative-based assessment that helps identify bipolar spectrum traits 
            through relatable stories and experiences.
          </Text>
          
          <View style={styles.expectationsList}>
            <Text style={styles.expectationsTitle}>What to expect:</Text>
            <Text style={styles.expectationItem}>• Story-based format</Text>
            <Text style={styles.expectationItem}>• Relatable experiences</Text>
            <Text style={styles.expectationItem}>• Personal connection to symptoms</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Note: These assessments are screening tools and not diagnostic instruments. 
          Please consult with a mental health professional for proper evaluation and diagnosis.
        </Text>
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
              color: item.route === 'Assessment' ? "#007AFF" : "#666666", 
              size: 24 
            })}
            <Text style={[
              styles.navLabel,
              item.route === 'Assessment' && styles.navLabelActive
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
    padding: 20,
  },
  headerContainer: { 
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    marginTop: 50,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 0,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 24,
  },
  assessmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    flex: 1,
  },
  timeEstimate: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 20,
    marginBottom: 15,
  },
  expectationsList: {
    backgroundColor: '#d3d3d3',
    borderRadius: 10,
    padding: 15,
  },
  expectationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  expectationItem: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 5,
    lineHeight: 20,
  },
  disclaimer: {
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 50,
  },
  titleContainer: {
    backgroundColor: '#8ec6e6',        
    borderRadius: 15,                 
    paddingVertical: 0,              
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

export default AssessmentScreen;