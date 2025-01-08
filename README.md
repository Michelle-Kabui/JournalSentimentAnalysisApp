# ZenZone - Mental Health Journal & Assessment App

ZenZone is a comprehensive mental health journaling and assessment mobile application built with React Native and Django. The app provides users with tools for mood tracking, journaling, and mental health assessments, helping them monitor and understand their emotional well-being over time.

## Features

### 📝 Journaling
- Create and manage personal journal entries
- Support for both English and Kiswahili
- Sentiment analysis of entries
- Historical view of all entries
- Rich text editing capabilities

### 📊 Mood Tracking
- Daily mood logging
  

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
- React Native development environment
- Django development environment

### Installation

#### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/zenzone.git
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
   python manage.py runserver
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

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- MDQ and BSDS assessment tools
- React Native community
- Django community
- All contributors and supporters

## Contact

Your Name - [@yourusername](https://twitter.com/yourusername)

Project Link: [https://github.com/yourusername/zenzone](https://github.com/yourusername/zenzone)
