import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const ResultsScreen = ({ navigation, route }) => {
  const { mdqResults, bsdsResults } = route.params || {};

  // Calculate MDQ interpretation
  const getMDQInterpretation = (results) => {
    if (!results) return "Incomplete assessment";
    
    const isPositive = 
      results.yesAnswers >= 7 && 
      results.sameTimePeriod === true && 
      (results.problemLevel === 2 || results.problemLevel === 3); // Moderate or Serious problem

    return isPositive
      ? "Further medical assessment for bipolar disorder is clearly warranted."
      : "Screening results do not indicate a strong likelihood of bipolar disorder.";
  };

  // Calculate BSDS interpretation
  const getBSDSInterpretation = (results) => {
    if (!results) return "Incomplete assessment";

    const totalScore = results.checkedStatements + (3 - results.storyFit);
    
    if (totalScore < 6) return "Very low probability of bipolar disorder";
    if (totalScore <= 10) return "Low probability of bipolar disorder";
    if (totalScore <= 18) return "Moderate probability of bipolar disorder";
    return "High probability of bipolar disorder";
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
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Assessment Results</Text>
            <Text style={styles.headerDate}>{new Date().toLocaleDateString()}</Text>
          </View>

          {/* MDQ Results */}
          <View style={styles.resultCard}>
            <Text style={styles.cardTitle}>Mood Disorder Questionnaire (MDQ)</Text>
            <View style={styles.scoreContainer}>
              <View style={styles.scoreRow}>
                <Text style={styles.scoreLabel}>"Yes" Answers:</Text>
                <Text style={styles.scoreValue}>{mdqResults?.yesAnswers || 0}/13</Text>
              </View>
              <View style={styles.scoreRow}>
                <Text style={styles.scoreLabel}>Same Time Period:</Text>
                <Text style={styles.scoreValue}>
                  {mdqResults?.sameTimePeriod ? 'Yes' : 'No'}
                </Text>
              </View>
              <View style={styles.scoreRow}>
                <Text style={styles.scoreLabel}>Impact Level:</Text>
                <Text style={styles.scoreValue}>
                  {['No', 'Minor', 'Moderate', 'Serious'][mdqResults?.problemLevel || 0]} Problem
                </Text>
              </View>
            </View>
            <View style={styles.interpretationContainer}>
              <Text style={styles.interpretationTitle}>Interpretation:</Text>
              <Text style={styles.interpretationText}>
                {getMDQInterpretation(mdqResults)}
              </Text>
            </View>
          </View>

          {/* BSDS Results */}
          <View style={styles.resultCard}>
            <Text style={styles.cardTitle}>Bipolar Spectrum Diagnostic Scale (BSDS)</Text>
            <View style={styles.scoreContainer}>
              <View style={styles.scoreRow}>
                <Text style={styles.scoreLabel}>Statements Endorsed:</Text>
                <Text style={styles.scoreValue}>
                  {bsdsResults?.checkedStatements || 0}/19
                </Text>
              </View>
              <View style={styles.scoreRow}>
                <Text style={styles.scoreLabel}>Story Fit Score:</Text>
                <Text style={styles.scoreValue}>
                  {3 - (bsdsResults?.storyFit || 0)}
                </Text>
              </View>
              <View style={styles.scoreRow}>
                <Text style={styles.scoreLabel}>Total Score:</Text>
                <Text style={styles.scoreValue}>
                  {(bsdsResults?.checkedStatements || 0) + (3 - (bsdsResults?.storyFit || 0))}
                </Text>
              </View>
            </View>
            <View style={styles.interpretationContainer}>
              <Text style={styles.interpretationTitle}>Interpretation:</Text>
              <Text style={styles.interpretationText}>
                {getBSDSInterpretation(bsdsResults)}
              </Text>
            </View>
            <View style={styles.scaleContainer}>
              <Text style={styles.scaleTitle}>Score Scale:</Text>
              <View style={styles.scaleRow}>
                <Text style={styles.scaleLabel}>&lt;6:</Text>
                <Text style={styles.scaleText}>Very Unlikely</Text>
              </View>
              <View style={styles.scaleRow}>
                <Text style={styles.scaleLabel}>6-10:</Text>
                <Text style={styles.scaleText}>Low Probability</Text>
              </View>
              <View style={styles.scaleRow}>
                <Text style={styles.scaleLabel}>11-18:</Text>
                <Text style={styles.scaleText}>Moderate Probability</Text>
              </View>
              <View style={styles.scaleRow}>
                <Text style={styles.scaleLabel}>≥19:</Text>
                <Text style={styles.scaleText}>Highly Likely</Text>
              </View>
            </View>
          </View>

          {/* Important Notice */}
          <View style={styles.noticeContainer}>
            <Text style={styles.noticeTitle}>Important Notice:</Text>
            <Text style={styles.noticeText}>
              These results are for screening purposes only and do not constitute a diagnosis. 
              Please consult with a qualified mental health professional for a proper evaluation 
              and diagnosis. Bipolar disorder is a complex condition that requires thorough 
              clinical assessment.
            </Text>
          </View>

          {/* Next Steps */}
          <View style={styles.nextStepsContainer}>
            <Text style={styles.nextStepsTitle}>Recommended Next Steps:</Text>
            <Text style={styles.nextStepsText}>
              1. Share these results with your healthcare provider{'\n'}
              2. Continue tracking your mood with the journal{'\n'}
              3. Maintain regular check-ins and assessments{'\n'}
              4. Seek professional guidance for proper diagnosis
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.primaryButtonText}>Return to Home</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => {/* Handle save/share */}}
            >
              <Text style={styles.secondaryButtonText}>Save Results</Text>
            </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 80,
  },
  headerContainer: {
    backgroundColor: '#007AFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerDate: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 15,
  },
  scoreContainer: {
    marginBottom: 15,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#666666',
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  interpretationContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  interpretationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  interpretationText: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 22,
  },
  scaleContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 15,
  },
  scaleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
  scaleRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  scaleLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666666',
    width: 60,
  },
  scaleText: {
    fontSize: 16,
    color: '#000000',
  },
  noticeContainer: {
    backgroundColor: '#FFE4E1',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  noticeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF4444',
    marginBottom: 10,
  },
  noticeText: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 20,
  },
  nextStepsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  nextStepsText: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 24,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 25,
    marginHorizontal: 5,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
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

export default ResultsScreen;