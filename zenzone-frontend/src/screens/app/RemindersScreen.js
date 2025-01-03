import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Feather } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { API } from '../../services/api';
import { TokenStorage } from '../../utils/tokenStorage';

// Configure notifications for iOS
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const RemindersScreen = ({ navigation }) => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [selectedType, setSelectedType] = useState('APP_USAGE');

  useEffect(() => {
    configureNotifications();
    fetchReminders();
  }, []);

  const configureNotifications = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') {
          Alert.alert('Permission Required', 'Please enable notifications to use reminders.');
        }
      }
    } catch (error) {
      console.error('Error configuring notifications:', error);
    }
  };

  const fetchReminders = async () => {
    try {
      const token = await TokenStorage.getAccessToken();
      const fetchedReminders = await API.getReminders(token);
      setReminders(fetchedReminders);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const scheduleNotification = async (title, time) => {
    const trigger = new Date(time);
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body: 'This is your reminder!',
        sound: true,
      },
      trigger,
    });
    console.log('Notification scheduled for:', trigger.toLocaleTimeString());
  };

  const handleCreateReminder = async () => {
    try {
      const token = await TokenStorage.getAccessToken();
      const reminderData = {
        title: selectedType === 'APP_USAGE' ? 'Journal Reminder' : 'Assessment Reminder',
        type: selectedType,
        time: selectedTime.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
        days: JSON.stringify(['MON', 'WED', 'FRI']),
        is_active: true,
      };

      const newReminder = await API.createReminder(token, reminderData);
      setReminders([...reminders, newReminder]);

      // Schedule the notification
      await scheduleNotification(newReminder.title, selectedTime);

      Alert.alert('Success', 'Reminder created successfully');
    } catch (error) {
      console.error('Error creating reminder:', error);
    }
  };

  const toggleReminder = async (reminder) => {
    try {
      const token = await TokenStorage.getAccessToken();
      const updatedReminder = { ...reminder, is_active: !reminder.is_active };
      await API.updateReminder(token, reminder.id, updatedReminder);
      setReminders(reminders.map((r) => (r.id === reminder.id ? updatedReminder : r)));
    } catch (error) {
      console.error('Error toggling reminder:', error);
    }
  };

  const deleteReminder = async (reminderId) => {
    try {
      const token = await TokenStorage.getAccessToken();
      await API.deleteReminder(token, reminderId);
      setReminders(reminders.filter((r) => r.id !== reminderId));
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color="#000000" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reminders</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Add New Reminder Section */}
        <View style={styles.addSection}>
          <Text style={styles.sectionTitle}>Add New Reminder</Text>

          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                selectedType === 'APP_USAGE' && styles.selectedType,
              ]}
              onPress={() => setSelectedType('APP_USAGE')}
            >
              <Text style={styles.typeButtonText}>Journal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                selectedType === 'ASSESSMENT' && styles.selectedType,
              ]}
              onPress={() => setSelectedType('ASSESSMENT')}
            >
              <Text style={styles.typeButtonText}>Assessment</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.timeSelector}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.timeSelectorText}>
              Select Time: {selectedTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </Text>
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={showTimePicker}
            mode="time"
            onConfirm={(time) => {
              setSelectedTime(time);
              setShowTimePicker(false);
            }}
            onCancel={() => setShowTimePicker(false)}
            headerTextIOS="Pick a Time"
            confirmTextIOS="Set"
            cancelTextIOS="Cancel"
          />

          <TouchableOpacity style={styles.createButton} onPress={handleCreateReminder}>
            <Text style={styles.createButtonText}>Create Reminder</Text>
          </TouchableOpacity>
        </View>

        {/* Existing Reminders Section */}
        <View style={styles.remindersSection}>
          <Text style={styles.sectionTitle}>Your Reminders</Text>

          {reminders.map((reminder) => (
            <View key={reminder.id} style={styles.reminderCard}>
              <View style={styles.reminderInfo}>
                <Text style={styles.reminderTitle}>{reminder.title}</Text>
                <Text style={styles.reminderTime}>
                  {new Date(`2000-01-01T${reminder.time}`).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </Text>
              </View>
              <View style={styles.reminderActions}>
                <Switch
                  value={reminder.is_active}
                  onValueChange={() => toggleReminder(reminder)}
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={reminder.is_active ? '#007AFF' : '#f4f3f4'}
                />
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() =>
                    Alert.alert(
                      'Delete Reminder',
                      'Are you sure you want to delete this reminder?',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Delete', onPress: () => deleteReminder(reminder.id) },
                      ]
                    )
                  }
                >
                  <Feather name="trash-2" size={20} color="#FF4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {reminders.length === 0 && (
            <Text style={styles.noRemindersText}>No reminders set. Create one above!</Text>
          )}
        </View>
      </ScrollView>
    </View>
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
    flex: 1,
    padding: 20,
  },
  testButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addSection: {
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
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  typeButton: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedType: {
    backgroundColor: '#007AFF',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  timeSelector: {
  backgroundColor: '#E0F7FA', // Lighter and eye-catching color
  padding: 20,               // Increase padding
  borderRadius: 15,
  marginBottom: 15,
  borderWidth: 2,            // Add border for prominence
  borderColor: '#007AFF',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 5, // For Android shadow
},
  timeSelectorText: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  remindersSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
  },
  reminderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  reminderInfo: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 5,
  },
  reminderTime: {
    fontSize: 14,
    color: '#666666',
  },
  reminderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    marginLeft: 15,
    padding: 5,
  },
  noRemindersText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8ec6e6',
  }
});
export default RemindersScreen;