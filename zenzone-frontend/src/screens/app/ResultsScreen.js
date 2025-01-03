import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const ResultsScreen = ({ navigation, route }) => {
  const { mdqResults, bsdsResults } = route.params || {};

  // MDQ Interpretation
  const getMDQInterpretation = () => {
    const isPositive = 
      mdqResults?.yesAnswers >= 7 && 
      mdqResults?.sameTimePeriod === true && 
      (mdqResults?.problemLevel === 2 || mdqResults?.problemLevel === 3);

    return {
      result: isPositive
        ? "Further medical assessment for bipolar disorder is clearly warranted."
        : "Screening results do not indicate a strong likelihood of bipolar disorder.",
      severity: isPositive ? "high" : "low"
    };
  };

  // BSDS Interpretation
  const getBSDSInterpretation = () => {
    if (!bsdsResults) return null;
    
    const totalScore = bsdsResults.checkedStatements + (3 - bsdsResults.storyFit);
    let interpretation = '';
    let severity = 'low';

    if (totalScore <= 5) {
      interpretation = "Very low probability of bipolar disorder";
      severity = "low";
    } else if (totalScore <= 10) {
      interpretation = "Low probability of bipolar disorder";
      severity = "low";
    } else if (totalScore <= 18) {
      interpretation = "Moderate probability of bipolar disorder";
      severity = "medium";
    } else {
      interpretation = "High probability of bipolar disorder";
      severity = "high";
    }

    return { result: interpretation, severity, score: totalScore };
  };

  const renderMDQResults = () => {
    const interpretation = getMDQInterpretation();
    return (
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
        <View style={[
          styles.interpretationContainer,
          { backgroundColor: interpretation.severity === 'high' ? '#FFE4E1' : '#F0F8FF' }
        ]}>
          <Text style={styles.interpretationTitle}>Interpretation:</Text>
          <Text style={styles.interpretationText}>{interpretation.result}</Text>
        </View>
      </View>
    );
  };

  const renderBSDSResults = () => {
    const interpretation = getBSDSInterpretation();
    if (!interpretation) return null;

    return (
      <View style={styles.resultCard}>
        <Text style={styles.cardTitle}>Bipolar Spectrum Diagnostic Scale (BSDS)</Text>
        <View style={styles.scoreContainer}>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>Total Score:</Text>
            <Text style={styles.scoreValue}>{interpretation.score}/25</Text>
          </View>
        </View>
        <View style={[
          styles.interpretationContainer,
          { backgroundColor: interpretation.severity === 'high' ? '#FFE4E1' : '#F0F8FF' }
        ]}>
          <Text style={styles.interpretationTitle}>Interpretation:</Text>
          <Text style={styles.interpretationText}>{interpretation.result}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
            <View style={styles.content}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>Assessment Results</Text>
                    <Text style={styles.headerDate}>{new Date().toLocaleDateString()}</Text>
                </View>

                {/* Show both MDQ and BSDS results */}
                {mdqResults && renderMDQResults()}
                {bsdsResults && renderBSDSResults()}

                {/* Important Notice */}
                <View style={styles.noticeContainer}>
                    <Text style={styles.noticeTitle}>Important Notice:</Text>
                    <Text style={styles.noticeText}>
                        These results are for screening purposes only and do not constitute a diagnosis. 
                        Please consult with a qualified mental health professional for a proper evaluation 
                        and diagnosis.
                    </Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.primaryButton]}
                        onPress={() => navigation.navigate('AssessmentHistory')}
                    >
                        <Text style={styles.primaryButtonText}>View History</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
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
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
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
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
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
  }
});

export default ResultsScreen;