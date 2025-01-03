import { API } from '../../services/api';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { TokenStorage } from '../../utils/tokenStorage';

const AssessmentHistoryScreen = ({ navigation }) => {
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    fetchAssessmentHistory();
}, []);

const fetchAssessmentHistory = async () => {
    try {
        setLoading(true);
        const token = await TokenStorage.getAccessToken();
        if (!token) {
            navigation.replace('Login');
            return;
        }
        
        const history = await API.getAssessmentHistory(token);
        setAssessmentHistory(history);
    } catch (error) {
        console.error('Detailed error in fetchAssessmentHistory:', error);
        Alert.alert('Error', 'Failed to load assessment history');
    } finally {
        setLoading(false);
    }
};

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getFilteredAssessments = () => {
    switch(selectedFilter) {
        case 'mdq':
            return assessmentHistory.filter(a => a.assessment_type === 'MDQ');
        case 'bsds':
            return assessmentHistory.filter(a => a.assessment_type === 'BSDS');
        default:
            return assessmentHistory;
    }
};

  const getResultSummary = (assessment) => {
    if (assessment.assessment_type === 'MDQ') {
        return `${assessment.mdq_yes_answers}/13 Yes responses - ${
            assessment.mdq_yes_answers >= 7 && assessment.mdq_same_time_period 
            && assessment.mdq_problem_level >= 2 
                ? 'Further assessment warranted' 
                : 'No strong indication'
        }`;
    } else { // BSDS
        const totalScore = (assessment.bsds_checked_statements || 0) + 
            (3 - (assessment.bsds_story_fit || 0));
        let interpretation = '';
        if (totalScore < 6) interpretation = 'Very low probability';
        else if (totalScore <= 10) interpretation = 'Low probability';
        else if (totalScore <= 18) interpretation = 'Moderate probability';
        else interpretation = 'High probability';
        
        return `Score: ${totalScore} - ${interpretation}`;
    }
  };

  const getStatusColor = (assessment) => {
    if (assessment.assessment_type === 'MDQ') {
        return assessment.mdq_yes_answers >= 7 &&
               assessment.mdq_same_time_period &&
               assessment.mdq_problem_level >= 2
            ? '#FF4444' : '#4CAF50';
    } else { // BSDS
        const totalScore = (assessment.bsds_checked_statements || 0) + 
            (3 - (assessment.bsds_story_fit || 0));
        return totalScore >= 11 ? '#FF4444' : '#4CAF50';
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
        onPress={() => navigation.navigate('Assessment')}
      >
        <Feather name="chevron-left" size={24} color="#000000" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
        <Text style={styles.headerTitle}>Assessment History</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Summary Container */}
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

        <View style={styles.filterContainer}>
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
        >
            <TouchableOpacity 
                style={[
                    styles.filterButton,
                    selectedFilter === 'all' && styles.filterButtonActive
                ]}
                onPress={() => setSelectedFilter('all')}
            >
                <Text style={[
                    styles.filterText,
                    selectedFilter === 'all' && styles.filterTextActive
                ]}>All</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[
                    styles.filterButton,
                    selectedFilter === 'mdq' && styles.filterButtonActive
                ]}
                onPress={() => setSelectedFilter('mdq')}
            >
                <Text style={[
                    styles.filterText,
                    selectedFilter === 'mdq' && styles.filterTextActive
                ]}>MDQ</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[
                    styles.filterButton,
                    selectedFilter === 'bsds' && styles.filterButtonActive
                ]}
                onPress={() => setSelectedFilter('bsds')}
            >
                <Text style={[
                    styles.filterText,
                    selectedFilter === 'bsds' && styles.filterTextActive
                ]}>BSDS</Text>
            </TouchableOpacity>
        </ScrollView>
    </View>

          {/* History List */}
          <View style={styles.historyContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
            ) : (
              getFilteredAssessments().map((assessment) => (
                <TouchableOpacity
                  key={assessment.id}
                  style={styles.assessmentCard}
                  onPress={() => navigation.navigate('Results', { 
                    mdqResults: assessment.assessment_type === 'MDQ' ? {
                      yesAnswers: assessment.mdq_yes_answers,
                      sameTimePeriod: assessment.mdq_same_time_period,
                      problemLevel: assessment.mdq_problem_level
                    } : null,
                    bsdsResults: assessment.assessment_type === 'BSDS' ? {
                      checkedStatements: assessment.bsds_checked_statements,
                      storyFit: assessment.bsds_story_fit
                    } : null,
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
                      <Text style={styles.assessmentType}>{assessment.assessment_type}</Text>
                    </View>
                    <Text style={styles.assessmentTime}>
                      {new Date(assessment.date_taken).toLocaleTimeString()}
                    </Text>
                  </View>

                  <Text style={styles.assessmentDate}>
                    {formatDate(assessment.date_taken)}
                  </Text>

                  <Text style={styles.resultSummary}>
                    {getResultSummary(assessment)}
                  </Text>

                  <View style={styles.cardFooter}>
                    <Text style={styles.viewDetails}>View Details</Text>
                    <Feather name="chevron-right" size={20} color="#007AFF" />
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8ec6e6',
  },
  header: {
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
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 80,
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
  loader: {
    marginTop: 20,
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
      paddingHorizontal: 30,
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
});

export default AssessmentHistoryScreen;