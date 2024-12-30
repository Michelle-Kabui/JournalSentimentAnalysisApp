import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';

const JournalAnalyticsScreen = ({ navigation }) => {
  const [timeframe, setTimeframe] = useState('weekly'); // 'weekly' or 'monthly'

  // Dummy data for weekly sentiment trends
  const weeklyData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [
          0.8,  // Positive
          0.2,  // Negative
          0.5,  // Neutral
          0.9,  // Positive
          0.3,  // Negative
          0.7,  // Positive
          0.4   // Neutral
        ],
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`
      }
    ]
  };

  // Dummy data for monthly sentiment trends
  const monthlyData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        data: [0.7, 0.5, 0.8, 0.6],
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`
      }
    ]
  };

  const screenWidth = Dimensions.get('window').width;

  const chartConfig = {
    backgroundGradient: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 1,
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
          <Feather name="chevron-left" size={24} color="#FFFFFF" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Journal Analytics</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Overall Sentiment Summary */}
          <View style={styles.summaryContainer}>
            <Text style={styles.sectionTitle}>Current Period Summary</Text>
            <View style={styles.summaryStats}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#4CAF50' }]}>65%</Text>
                <Text style={styles.statLabel}>Positive</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#FFC107' }]}>25%</Text>
                <Text style={styles.statLabel}>Neutral</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#FF5252' }]}>10%</Text>
                <Text style={styles.statLabel}>Negative</Text>
              </View>
            </View>
          </View>

          {/* Timeframe Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity 
              style={[
                styles.toggleButton,
                timeframe === 'weekly' && styles.toggleButtonActive
              ]}
              onPress={() => setTimeframe('weekly')}
            >
              <Text style={[
                styles.toggleText,
                timeframe === 'weekly' && styles.toggleTextActive
              ]}>Weekly</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.toggleButton,
                timeframe === 'monthly' && styles.toggleButtonActive
              ]}
              onPress={() => setTimeframe('monthly')}
            >
              <Text style={[
                styles.toggleText,
                timeframe === 'monthly' && styles.toggleTextActive
              ]}>Monthly</Text>
            </TouchableOpacity>
          </View>

          {/* Sentiment Trend Chart */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>
              {timeframe === 'weekly' ? 'Weekly Sentiment Trend' : 'Monthly Sentiment Trend'}
            </Text>
            <LineChart
              data={timeframe === 'weekly' ? weeklyData : monthlyData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>

          {/* Legend */}
          <View style={styles.legendContainer}>
            <Text style={styles.legendText}>
              Sentiment scale: 0 (Negative) to 1 (Positive)
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
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 15,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
    marginTop: 5,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 5,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
  },
  toggleButtonActive: {
    backgroundColor: '#007AFF',
  },
  toggleText: {
    fontSize: 14,
    color: '#666666',
  },
  toggleTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  chart: {
    borderRadius: 15,
    marginVertical: 8,
  },
  legendContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  legendText: {
    fontSize: 14,
    color: '#666666',
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

export default JournalAnalyticsScreen;