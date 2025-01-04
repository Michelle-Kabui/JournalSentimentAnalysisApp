import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { API } from '../../services/api';
import { TokenStorage } from '../../utils/tokenStorage';

const JournalAnalyticsScreen = ({ navigation }) => {
  const [timeframe, setTimeframe] = useState('daily');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = await TokenStorage.getAccessToken();
      if (!token) {
        navigation.replace('Login');
        return;
      }
      const response = await API.getJournalAnalytics(token, timeframe);
      console.log('Analytics response:', JSON.stringify(response, null, 2));  // Add this
      setAnalytics(response);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      Alert.alert('Error', 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = () => {
    if (!analytics?.sentiment_trends || Object.keys(analytics.sentiment_trends).length === 0) {
      return {
        labels: [],
        datasets: [
          {
            data: [],
            color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
            label: 'Positive'
          },
          {
            data: [],
            color: (opacity = 1) => `rgba(255, 193, 7, ${opacity})`,
            label: 'Neutral'
          },
          {
            data: [],
            color: (opacity = 1) => `rgba(244, 67, 54, ${opacity})`,
            label: 'Negative'
          }
        ]
      };
    }
  
    const labels = Object.keys(analytics.sentiment_trends);
    const datasets = [
      {
        data: labels.map(label => analytics.sentiment_trends[label].positive || 0),
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
        label: 'Positive'
      },
      {
        data: labels.map(label => analytics.sentiment_trends[label].neutral || 0),
        color: (opacity = 1) => `rgba(255, 193, 7, ${opacity})`,
        label: 'Neutral'
      },
      {
        data: labels.map(label => analytics.sentiment_trends[label].negative || 0),
        color: (opacity = 1) => `rgba(244, 67, 54, ${opacity})`,
        label: 'Negative'
      }
    ];
  
    // Format labels based on timeframe
    const formattedLabels = labels.map(label => {
      if (timeframe === 'daily') {
        const date = new Date(label);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const hour12 = hours % 12 || 12;
        return `${hour12}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
      } else if (timeframe === 'weekly') {
        const date = new Date(label);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      } else {
        const date = new Date(label);
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
      }
    });
  
    return { 
      labels: formattedLabels,
      datasets 
    };
  };

  const renderChart = () => {
    const chartData = prepareChartData();
    const maxValue = Math.max(
      ...chartData.datasets.flatMap(dataset => dataset.data)
    );
  
    const chartConfig = {
      backgroundColor: '#ffffff',
      backgroundGradientFrom: '#ffffff',
      backgroundGradientTo: '#ffffff',
      decimalPlaces: 0,
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      style: {
        borderRadius: 16
      },
      propsForDots: {
        r: "6",
        strokeWidth: "2"
      },
      // Ensure even distribution of y-axis values
      yAxisInterval: 1,
      formatYLabel: (value) => Math.floor(value),
      // Only show integers on y-axis
      count: Math.ceil(maxValue) + 1
    };
  
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Sentiment Trends</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <LineChart
            data={chartData}
            width={Dimensions.get('window').width * 1.5}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            fromZero={true}
            segments={Math.ceil(maxValue)}
            yAxisMinValue={0}
            yAxisMaxValue={Math.ceil(maxValue)}
            // Add these new props to ensure proper y-axis display
            withInnerLines={true}
            withOuterLines={true}
            withVerticalLines={false}
            withHorizontalLines={true}
            withVerticalLabels={true}
            withHorizontalLabels={true}
          />
        </ScrollView>
        
        {/* Legend */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.legendText}>Positive Entries</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FFC107' }]} />
            <Text style={styles.legendText}>Neutral Entries</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#F44336' }]} />
            <Text style={styles.legendText}>Negative Entries</Text>
          </View>
        </View>

        {/* Guidelines */}
        <View style={styles.guidelinesContainer}>
          <Text style={styles.guidelinesTitle}>Understanding Your {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Patterns:</Text>
          <View style={styles.guidelineItem}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.guidelineText}>
              {timeframe === 'daily' 
                ? 'Peak Hours: Most active journaling times show higher points' 
                : 'Peak Days: Days with most journaling activity'}
            </Text>
          </View>
          <View style={styles.guidelineItem}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.guidelineText}>Sentiment Distribution: Compare positive vs negative entries</Text>
          </View>
          <View style={styles.guidelineItem}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.guidelineText}>Pattern Recognition: Identify recurring emotional patterns</Text>
          </View>
        </View>

        {/* Axis Labels */}
        <View style={styles.axisLabels}>
          <Text style={styles.axisText}>
            X-Axis: {timeframe === 'daily' ? 'Time (24-hour format)' : 'Date'}
          </Text>
          <Text style={styles.axisText}>Y-Axis: Number of Journal Entries</Text>
        </View>
      </View>
    );
  };

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
        <Text style={styles.headerTitle}>Journal Analytics</Text>
        <View style={{ width: 60 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : (
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            {/* Timeframe Toggle */}
            <View style={styles.toggleContainer}>
              {['daily', 'weekly', 'monthly'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.toggleButton,
                    timeframe === option && styles.toggleButtonActive
                  ]}
                  onPress={() => setTimeframe(option)}
                >
                  <Text style={[
                    styles.toggleText,
                    timeframe === option && styles.toggleTextActive
                  ]}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Sentiment Summary */}
            <View style={styles.summaryContainer}>
              <Text style={styles.sectionTitle}>Sentiment Summary</Text>
              <View style={styles.summaryStats}>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: '#4CAF50' }]}>
                    {analytics?.sentiment_summary?.positive || 0}%
                  </Text>
                  <Text style={styles.statLabel}>Positive</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: '#FFC107' }]}>
                    {analytics?.sentiment_summary?.neutral || 0}%
                  </Text>
                  <Text style={styles.statLabel}>Neutral</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: '#F44336' }]}>
                    {analytics?.sentiment_summary?.negative || 0}%
                  </Text>
                  <Text style={styles.statLabel}>Negative</Text>
                </View>
              </View>
            </View>

            {/* Chart Section */}
            {analytics && renderChart()}

            {/* Mood Distribution */}
            <View style={styles.moodContainer}>
              <Text style={styles.sectionTitle}>Mood Distribution</Text>
              {Object.entries(analytics?.mood_analysis?.distribution || {}).map(([mood, percentage]) => (
                <View key={mood} style={styles.moodRow}>
                  <Text style={styles.moodLabel}>{mood}</Text>
                  <View style={styles.moodBarContainer}>
                    <View 
                      style={[
                        styles.moodBar,
                        { width: `${percentage}%` }
                      ]} 
                    />
                    <Text style={styles.moodPercentage}>{percentage}%</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
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
  content: {
    padding: 20,
    paddingBottom: 80,
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
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 15,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 15,
    textAlign: 'center',
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
  chart: {
    marginVertical: 8,
    borderRadius: 15,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    paddingHorizontal: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#666666',
  },
  guidelinesContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
  },
  guidelinesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
  guidelineItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  bulletPoint: {
    marginRight: 5,
    color: '#007AFF',
  },
  guidelineText: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  axisLabels: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  axisText: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 5,
  },
  moodContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  moodRow: {
    marginBottom: 10,
  },
  moodLabel: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 5,
  },
  moodBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
  },
  moodBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 10,
  },
  moodPercentage: {
    position: 'absolute',
    right: 10,
    fontSize: 12,
    color: '#000000',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default JournalAnalyticsScreen;