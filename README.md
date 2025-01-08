# ZenZone - Mental Health Journal & Assessment App

ZenZone is a comprehensive mental health journaling and assessment mobile application built with React Native and Django. The app provides users with tools for mood tracking, journaling, and mental health assessments, helping them monitor and understand their emotional well-being over time.

## Features

### 📝 Journaling
- Create and manage personal journal entries
- Support for both English and Kiswahili
- Sentiment analysis of entries
- Historical view of all entries
- Rich text editing capabilities


### 🔍 Mental Health Assessments
- Mood Disorder Questionnaire (MDQ)
- Bipolar Spectrum Diagnostic Scale (BSDS)
- Assessment history tracking
- Detailed results analysis
- Scheduling and reminders

### 📱 Additional Features
- Secure authentication system
- Customizable reminders
- Data visualization
- Cross-platform compatibility

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Python (v3.8 or later)
- PostgreSQL
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device
- Django development environment

### Installation

#### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Michelle-Kabui/JournalSentimentAnalysisApp.git
   cd zenzone/backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure the database:
   - Create a PostgreSQL database
   - Update database settings in `settings.py`
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql',
           'NAME': 'your_database_name',
           'USER': 'your_username',
           'PASSWORD': 'your_password',
           'HOST': 'localhost',
           'PORT': '5432',
       }
   }
   ```

5. Run migrations:
   ```bash
   python manage.py migrate
   ```

6. Create a superuser:
   ```bash
   python manage.py createsuperuser
   ```

7. Start the Django server:
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the API endpoint:
   - Update the BASE_URL in `src/services/api.js`
   ```javascript
   const BASE_URL = 'http://your-backend-url:8000/api';
   ```

4. Start the development server:
   ```bash
   npm start
   ```

### Running the App

#### Using Expo Go (Recommended for Development)

1. Start the Expo development server:
   ```bash
   npx expo start
   ```

2. Run on device:
   - Install Expo Go app on your mobile device from App Store (iOS) or Play Store (Android)
   - Scan the QR code shown in the terminal with:
     - iOS: Use the device camera app
     - Android: Use the Expo Go app's QR scanner

3. Development Options:
   - Press 'a' in the terminal to open on Android emulator
   - Press 'i' to open on iOS simulator
   - Press 'w' to open in web browser
   - Press 'r' to reload the app
   - Press 'm' to toggle the menu
   
#### Using React Native CLI (For Production)

1. Start the Metro bundler:
   ```bash
   npx react-native start
   ```

2. Run the app on Android:
   ```bash
   npx react-native run-android
   ```

   Or iOS:
   ```bash
   npx react-native run-ios
   ```

#### Expo Build Commands

1. Build for Android:
   ```bash
   expo build:android
   ```

2. Build for iOS:
   ```bash
   expo build:ios
   ```

3. Generate APK for testing:
   ```bash
   expo build:android -t apk
   ```

## Architecture

### Frontend (React Native)
- Navigation using React Navigation
- State management with Context API
- Secure token storage using AsyncStorage
- Chart visualization using react-native-chart-kit
- UI components from React Native Paper

### Backend (Django)
- Django REST framework for API endpoints
- JWT authentication
- PostgreSQL database
- Sentiment analysis integration
- CORS middleware for cross-origin requests

## API Endpoints

### Authentication
- POST `/api/auth/register/` - User registration
- POST `/api/auth/login/` - User login
- POST `/api/auth/token/refresh/` - Refresh JWT token

### Journal
- GET `/api/journal/entries/` - List journal entries
- POST `/api/journal/entries/` - Create journal entry
- GET `/api/journal/entries/{id}/` - Get specific entry
- PUT `/api/journal/entries/{id}/` - Update entry
- DELETE `/api/journal/entries/{id}/` - Delete entry

### Assessments
- GET `/api/assessments/history/` - Assessment history
- POST `/api/assessments/save/` - Save assessment results

### Analytics
- GET `/api/journal/entries/analytics/` - Journal analytics
- GET `/api/journal/entries/mood-analysis/` - Mood analysis


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details


