import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const MDQScreen = ({ navigation, route }) => {
  // State for the 13 main questions
  const [answers, setAnswers] = useState({
    q1_1: null, q1_2: null, q1_3: null, q1_4: null,
    q1_5: null, q1_6: null, q1_7: null, q1_8: null,
    q1_9: null, q1_10: null, q1_11: null, q1_12: null,
    q1_13: null,
    q2: null,  // same time period question
    q3: null   // problem severity question
  });

  // Questions array
  const questions = [
    "...you felt so good or so hyper that other people thought you were not your normal self or you were so hyper that you got into trouble?",
    "...you were so irritable that you shouted at people or started fights or arguments?",
    "...you felt much more self-confident than usual?",
    "...you got much less sleep than usual and found you didn't really miss it?",
    "...you were much more talkative or spoke faster than usual?",
    "...thoughts raced through your head or you couldn't slow your mind down?",
    "...you were so easily distracted by things around you that you had trouble concentrating or staying on track?",
    "...you had much more energy than usual?",
    "...you were much more active or did many more things than usual?",
    "...you were much more social or outgoing than usual, for example, you telephoned friends in the middle of the night?",
    "...you were much more interested in sex than usual?",
    "...you did things that were unusual for you or that other people might have thought were excessive, foolish, or risky?",
    "...spending money got you or your family in trouble?"
  ];

  // Calculate MDQ score and handle submission
  const handleSubmit = () => {
    // Check if all questions are answered
    const unansweredQuestions = Object.entries(answers).filter(([key, value]) => value === null);
    
    if (unansweredQuestions.length > 0) {
      Alert.alert(
        "Incomplete Assessment",
        "Please answer all questions before submitting.",
        [{ text: "OK" }]
      );
      return;
    }

    // Calculate the score
    const mdqScore = {
      yesAnswers: Object.entries(answers)
        .filter(([key, value]) => key.startsWith('q1_') && value === true)
        .length,
      sameTimePeriod: answers.q2,
      problemLevel: answers.q3
    };

    // Determine next screen based on route params
    if (route.params?.fromBSDS) {
      // If coming from BSDS, navigate to results with both scores
      navigation.navigate('Results', {
        mdqResults: mdqScore,
        bsdsResults: route.params.bsdsResults
      });
    } else {
      // If starting with MDQ, navigate to BSDS
      navigation.navigate('BSDS', {
        mdqResults: mdqScore,
        fromMDQ: true
      });
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
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Instructions:</Text>
            <Text style={styles.instructions}>
              Check (✓) the answer that best applies to you.
              Please answer each question as best you can.
            </Text>
          </View>

          {/* Main Question */}
          <Text style={styles.mainQuestion}>
            1. Has there ever been a period of time when you were not your usual self and...
          </Text>

          {/* Questions Section */}
          <View style={styles.questionsContainer}>
            {questions.map((question, index) => (
              <View key={index} style={styles.questionRow}>
                <Text style={styles.questionText}>{question}</Text>
                <View style={styles.radioGroup}>
                  <TouchableOpacity 
                    style={styles.radioOption}
                    onPress={() => setAnswers({
                      ...answers,
                      [`q1_${index + 1}`]: true
                    })}
                  >
                    <View style={[
                      styles.radioButton,
                      answers[`q1_${index + 1}`] === true && styles.radioButtonSelected
                    ]}>
                      {answers[`q1_${index + 1}`] === true && (
                        <Text style={styles.radioButtonText}>✓</Text>
                      )}
                    </View>
                    <Text style={styles.radioText}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.radioOption}
                    onPress={() => setAnswers({
                      ...answers,
                      [`q1_${index + 1}`]: false
                    })}
                  >
                    <View style={[
                      styles.radioButton,
                      answers[`q1_${index + 1}`] === false && styles.radioButtonSelected
                    ]}>
                      {answers[`q1_${index + 1}`] === false && (
                        <Text style={styles.radioButtonText}>✓</Text>
                      )}
                    </View>
                    <Text style={styles.radioText}>No</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* Second Question */}
          <View style={styles.followUpContainer}>
            <Text style={styles.questionText}>
              2. If you checked YES to more than one of the above, have several of these ever 
              happened during the same period of time?
            </Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity 
                style={styles.radioOption}
                onPress={() => setAnswers({ ...answers, q2: true })}
              >
                <View style={[
                  styles.radioButton,
                  answers.q2 === true && styles.radioButtonSelected
                ]}>
                  {answers.q2 === true && <Text style={styles.radioButtonText}>✓</Text>}
                </View>
                <Text style={styles.radioText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.radioOption}
                onPress={() => setAnswers({ ...answers, q2: false })}
              >
                <View style={[
                  styles.radioButton,
                  answers.q2 === false && styles.radioButtonSelected
                ]}>
                  {answers.q2 === false && <Text style={styles.radioButtonText}>✓</Text>}
                </View>
                <Text style={styles.radioText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Third Question */}
          <View style={styles.followUpContainer}>
            <Text style={styles.questionText}>
              3. How much of a problem did any of these cause you — like being able to work; 
              having family, money, or legal troubles; getting into arguments or fights?
            </Text>
            <View style={styles.severityContainer}>
              {['No problem', 'Minor problem', 'Moderate problem', 'Serious problem'].map((option, index) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.severityOption}
                  onPress={() => setAnswers({ ...answers, q3: index })}
                >
                  <View style={[
                    styles.radioButton,
                    answers.q3 === index && styles.radioButtonSelected
                  ]}>
                    {answers.q3 === index && <Text style={styles.radioButtonText}>✓</Text>}
                  </View>
                  <Text style={styles.severityText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>
              {route.params?.fromBSDS ? 'Submit and View Results' : 'Submit and Continue to BSDS'}
            </Text>
          </TouchableOpacity>

          {/* Disclaimer */}
          <View style={styles.disclaimerContainer}>
            <Text style={styles.disclaimer}>
              This instrument is designed for screening purposes only and is not to be used as a diagnostic tool.
            </Text>
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
    paddingBottom: 40,
  },
  instructionsContainer: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  instructions: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  mainQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000000',
  },
  questionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  questionText: {
    flex: 1,
    fontSize: 15,
    color: '#000000',
    paddingRight: 10,
  },
  radioGroup: {
    flexDirection: 'row',
    width: 140,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioButtonSelected: {
    backgroundColor: '#007AFF',
  },
  radioButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  radioText: {
    fontSize: 14,
    color: '#000000',
  },
  followUpContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  severityContainer: {
    marginTop: 10,
  },
  severityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  severityText: {
    fontSize: 15,
    color: '#000000',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginVertical: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disclaimerContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 15,
  },
  disclaimer: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
    lineHeight: 20,
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

export default MDQScreen;