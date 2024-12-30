import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
} from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth - 70;

const MoodVisualizationScreen = ({ navigation }) => {
  // Dummy data - will be replaced with actual data
  const dailyData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [4, 3, 5, 2, 4, 5, 3],
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`
      }
    ]
  };

  const weeklyMoodDistribution = {
    labels: ["Happy", "Sad", "Calm", "Stressed"],
    data: [0.7, 0.4, 0.6, 0.3]
  };

  const monthlyMoodCount = {
    labels: ["Happy", "Sad", "Calm", "Stressed", "Angry"],
    datasets: [{
      data: [20, 10, 15, 8, 5]
    }]
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

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    width: chartWidth,
    height: 220,
    paddingRight: 0,
    paddingTop: 0,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    propsForLabels: {
      fontSize: 12
    }
  };

  const screenWidth = Dimensions.get('window').width;

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
        <Text style={styles.headerTitle}>Mood Analytics </Text>
        <View style={{ width: 60 }} /> {/* For balance */}
    
</View>
      

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Daily Mood Trends */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Daily Mood Trends</Text>
           <LineChart
  data={dailyData}
  width={chartWidth}
  height={220}
  chartConfig={chartConfig}
  bezier
  style={styles.chart}
  withInnerLines={false}  // Makes it cleaner
  withOuterLines={true}
/>
          </View>

          {/* Weekly Mood Distribution */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Weekly Mood Distribution</Text>
            <ProgressChart
  data={weeklyMoodDistribution}
  width={chartWidth + 20}  // Add extra width for this specific chart
  height={220}
  chartConfig={{
    ...chartConfig,
    paddingRight: 30,  // Increase right padding
  }}
  style={[
    styles.chart,
    { marginHorizontal: -25 }  // Compensate for the extra width
  ]}
/>
          </View>

          {/* Monthly Mood Summary */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Monthly Mood Summary</Text>
            <BarChart
  data={monthlyMoodCount}
  width={chartWidth}
  height={220}
  chartConfig={chartConfig}
  style={styles.chart}
  showValuesOnTopOfBars={true}
  withInnerLines={false}
/>
          </View>

          {/* Statistics Summary */}
          <View style={styles.statsContainer}>
            <Text style={styles.statsTitle}>Summary Statistics</Text>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Most Common Mood:</Text>
              <Text style={styles.statValue}>Happy 😊</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Average Mood Score:</Text>
              <Text style={styles.statValue}>4.2/5</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Mood Variations:</Text>
              <Text style={styles.statValue}>Moderate</Text>
            </View>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',  // Center the charts
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
  chart: {
    borderRadius: 15,
    marginVertical: 8,
    marginHorizontal: -15,  // Compensate for container padding
  },
  statsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 15,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 16,
    color: '#666666',
  },
  statValue: {
    fontSize: 16,
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


export default MoodVisualizationScreen;