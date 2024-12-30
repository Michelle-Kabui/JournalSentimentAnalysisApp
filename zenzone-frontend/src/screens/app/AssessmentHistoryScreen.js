import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';

const AssessmentHistoryScreen = ({ navigation }) => {
  // Dummy data - will be replaced with API data
  const assessmentHistory = [
    {
      id: '1',
      type: 'MDQ',
      date: '2024-12-28',
      time: '14:30',
      results: {
        yesAnswers: 8,
        sameTimePeriod: true,
        problemLevel: 'Moderate problem',
        interpretation: 'Further medical assessment warranted'
      }
    },
    {
      id: '2',
      type: 'BSDS',
      date: '2024-12-28',
      time: '15:00',
      results: {
        score: 15,
        interpretation: 'Moderate Probability'
      }
    },
    {
      id: '3',
      type: 'MDQ',
      date: '2024-12-15',
      time: '09:45',
      results: {
        yesAnswers: 6,
        sameTimePeriod: true,
        problemLevel: 'Minor problem',
        interpretation: 'No strong indication'
      }
    },
  ];
  const [selectedFilter, setSelectedFilter] = useState('all');

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getResultSummary = (assessment) => (
    <Text style={styles.resultSummary}>
      {assessment.type === 'MDQ' 
        ? `${assessment.results.yesAnswers}/13 Yes responses - ${assessment.results.interpretation}`
        : `Score: ${assessment.results.score} - ${assessment.results.interpretation}`
      }
    </Text>
  );

  const getStatusColor = (assessment) => {
    if (assessment.type === 'MDQ') {
      return assessment.results.yesAnswers >= 7 ? '#FF4444' : '#4CAF50';
    } else {
      return assessment.results.score >= 11 ? '#FF4444' : '#4CAF50';
    }
  };
  const getFilteredAssessments = () => {
    switch(selectedFilter) {
      case 'mdq':
        return assessmentHistory.filter(a => a.type === 'MDQ');
      case 'bsds':
        return assessmentHistory.filter(a => a.type === 'BSDS');
      case 'recent':
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return assessmentHistory.filter(a => new Date(a.date) >= oneWeekAgo);
      default:
        return assessmentHistory;
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
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="chevron-left" size={24} color="#000000" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assessment History</Text>
        <View style={{ width: 60 }}>
          <Text> </Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>
                {getFilteredAssessments().length}
              </Text>
              <Text style={styles.summaryLabel}>
                Total Assessments
              </Text>
            </View>
          </View>

          <View style={styles.historyContainer}>
            {getFilteredAssessments().map((assessment) => (
              <TouchableOpacity
                key={assessment.id}
                style={styles.assessmentCard}
                onPress={() => navigation.navigate('Results', { 
                  mdqResults: assessment.type === 'MDQ' ? assessment.results : null,
                  bsdsResults: assessment.type === 'BSDS' ? assessment.results : null,
                })}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.typeContainer}>
                    <View 
                      style={[
                        styles.statusDot, 
                        { backgroundColor: getStatusColor(assessment) }
                      ]} 
                    />
                    <Text style={styles.assessmentType}>{assessment.type}</Text>
                  </View>
                  <Text style={styles.assessmentTime}>{assessment.time}</Text>
                </View>

                <Text style={styles.assessmentDate}>
                  {formatDate(assessment.date)}
                </Text>

                {getResultSummary(assessment)}

                <View style={styles.cardFooter}>
                  <Text style={styles.viewDetails}>View Details</Text>
                  <Feather name="chevron-right" size={20} color="#007AFF" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
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
              color: item.route === 'Assessment' ? "#007AFF" : "#666666", 
              size: 24 
            })}
            <Text style={[
              styles.navLabel,
              item.route === 'Assessment' && styles.navLabelActive
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
    justifyContent: 'space-between',
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 80,
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 15,
    margin: 15,
    marginTop: 0,
  },
  filterScroll: {
    paddingHorizontal: 5,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: '#F0F0F0',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    color: '#666666',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666666',
    marginTop: 5,
  },
  historyContainer: {
    marginBottom: 20,
  },
  assessmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
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
    marginBottom: 5,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  assessmentType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  assessmentTime: {
    fontSize: 14,
    color: '#666666',
  },
  assessmentDate: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 10,
  },
  resultSummary: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  viewDetails: {
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
});

export default AssessmentHistoryScreen;