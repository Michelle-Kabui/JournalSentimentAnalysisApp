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
import { API } from '../../services/api';
import { TokenStorage } from '../../utils/tokenStorage';

const BSDSScreen = ({ navigation, route }) => {
  // State for story statements
  const [checkedItems, setCheckedItems] = useState(Array(19).fill(false));
  // State for overall story fit
  const [storyFit, setStoryFit] = useState(null);

  const narrativeChecks = [
    "mood and/or energy levels shift drastically from time to time",
    "at times, their mood and/or energy level is very low, and at other times, very high",
    "a need to stay in bed or get extra sleep; and little or no motivation to do things they need to do",
    "They often put on weight during these periods",
    "feel \"blue\", sad all the time, or depressed",
    "feel hopeless or even suicidal",
    "Their ability to function at work or socially is impaired",
    "Typically, these low phases last for a few weeks, but sometimes they last only a few days",
    "experience a period of \"normal\" mood in between mood swings",
    "notice a marked shift or \"switch\" in the way they feel",
    "energy increases above what is normal for them",
    "feel as if they have too much energy or feel \"hyper\"",
    "feel irritable, \"on edge\", or aggressive",
    "take on too many activities at once",
    "spend money in ways that cause them trouble",
    "more talkative, outgoing, or sexual during these periods",
    "behavior during these high periods seems strange or annoying to others",
    "difficulty with co-workers or the police, during these high periods",
    "increase their alcohol or non-prescription drug use during these high periods"
  ];

  const fitOptions = [
    "This story fits me very well, or almost perfectly",
    "This story fits me fairly well",
    "This story fits me to some degree, but not in most respects",
    "This story does not really describe me at all"
  ];

  const toggleCheckbox = (index) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);
  };

  const handleSubmit = async () => {
    if (!storyFit) {
      Alert.alert(
        "Incomplete Assessment",
        "Please select how well the story describes you overall.",
        [{ text: "OK" }]
      );
      return;
    }

    const bsdsScore = {
      checkedStatements: checkedItems.filter(item => item).length,
      storyFit: storyFit
  };

  try {
      // Save BSDS results
      const token = await TokenStorage.getAccessToken();
      if (token) {
          await API.saveAssessmentResult(token, {
              assessment_type: 'BSDS',
              bsds_checked_statements: bsdsScore.checkedStatements,
              bsds_story_fit: bsdsScore.storyFit,
          });
      }

      navigation.navigate('Results', {
          mdqResults: route.params?.mdqResults, 
          bsdsResults: bsdsScore
      });
  } catch (error) {
      console.error('Error saving BSDS results:', error);
      navigation.navigate('Results', {
          mdqResults: route.params?.mdqResults,
          bsdsResults: bsdsScore
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
              Please read through the entire passage below and check each statement that applies to you.
            </Text>
          </View>

          {/* Narrative with Checkboxes */}
          <View style={styles.narrativeContainer}>
            <Text style={styles.narrativeText}>
              Some individuals notice that their{' '}
            </Text>
            {narrativeChecks.map((statement, index) => (
              <View key={index} style={styles.checkboxRow}>
                <TouchableOpacity
                  style={[styles.checkbox, checkedItems[index] && styles.checkboxChecked]}
                  onPress={() => toggleCheckbox(index)}
                >
                  {checkedItems[index] && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
                <Text style={styles.statementText}>{statement}</Text>
              </View>
            ))}
          </View>

          {/* Overall Fit Question */}
          <View style={styles.fitContainer}>
            <Text style={styles.fitQuestion}>
              Now that you have read this passage, please check one of the following options:
            </Text>
            {fitOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.radioOption}
                onPress={() => setStoryFit(index)}
              >
                <View style={[styles.radio, storyFit === index && styles.radioSelected]} />
                <Text style={styles.radioText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>
              {route.params?.fromMDQ ? 'Submit and View Results' : 'Submit and Continue to MDQ'}
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
  narrativeContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  narrativeText: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 22,
    marginBottom: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  statementText: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    lineHeight: 22,
  },
  fitContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  fitQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 15,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 10,
  },
  radioSelected: {
    backgroundColor: '#007AFF',
  },
  radioText: {
    fontSize: 16,
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

export default BSDSScreen;