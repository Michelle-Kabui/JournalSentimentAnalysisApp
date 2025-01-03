const BASE_URL = 'http://192.168.1.102:8000/api';

export const API = {

    // User Profile
    getUserProfile: async (token) => {
        try {
            console.log('Fetching user profile...');
            console.log('Token:', token);
            const response = await fetch(`${BASE_URL}/auth/profile/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`Failed to fetch user profile: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Profile data received:', data);
            return data;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            throw error;
        }
    },

    updateUserProfile: async (token, userData) => {
        try {
            console.log('Updating profile with data:', userData);
            const response = await fetch(`${BASE_URL}/auth/profile/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });
            
            console.log('Update response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Update error response:', errorData);
                throw new Error(errorData.message || 'Failed to update user profile');
            }
            
            const data = await response.json();
            console.log('Profile updated successfully:', data);
            return data;
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    },

    // Authentication
    register: async (userData) => {
        console.log('Attempting to connect to:', `${BASE_URL}/auth/register/`);
        console.log('With data:', userData);
        
        try {
            const response = await fetch(`${BASE_URL}/auth/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });
            
            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);
            
            return data;
        } catch (error) {
            console.error('Detailed error:', error);
            throw error;
        }
    },

    login: async (credentials) => {
        console.log('Attempting login with:', {
            email: credentials.email,
            password: '***'  // Hide password in logs
        });

        try {
            const response = await fetch(`${BASE_URL}/auth/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });
            
            console.log('Login response status:', response.status);
            const data = await response.json();
            console.log('Login response data:', data);
            
            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }
            
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    refreshToken: async (refreshToken) => {
        try {
            const response = await fetch(`${BASE_URL}/auth/token/refresh/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh: refreshToken })
            });
            
            if (!response.ok) {
                throw new Error('Token refresh failed');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error refreshing token:', error);
            throw error;
        }
    },

    // Journal Entries
    createJournalEntry: async (entryData, token) => {
        try {
            const response = await fetch(`${BASE_URL}/journal/entries/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(entryData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to create journal entry');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error creating journal entry:', error);
            throw error;
        }
    },

    getJournalEntries: async (token) => {
        try {
            console.log('Using token:', token); // Debug log
            const response = await fetch(`${BASE_URL}/journal/entries/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.status === 401) {
                // Token expired, try to refresh
                const refreshToken = await TokenStorage.getRefreshToken();
                if (refreshToken) {
                    const newTokens = await API.refreshToken(refreshToken);
                    await TokenStorage.storeTokens(newTokens);
                    
                    // Retry with new token
                    const retryResponse = await fetch(`${BASE_URL}/journal/entries/`, {
                        headers: {
                            'Authorization': `Bearer ${newTokens.access}`,
                            'Content-Type': 'application/json',
                        }
                    });
                    
                    if (!retryResponse.ok) {
                        throw new Error('Failed to fetch entries after token refresh');
                    }
                    
                    return await retryResponse.json();
                }
            }
            
            if (!response.ok) {
                throw new Error('Failed to fetch journal entries');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching journal entries:', error);
            throw error;
        }
    },

    getJournalEntry: async (token, entryId) => {
        try {
            const response = await fetch(`${BASE_URL}/journal/entries/${entryId}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch journal entry');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching journal entry:', error);
            throw error;
        }
    },

    updateJournalEntry: async (token, entryId, entryData) => {
        try {
            const response = await fetch(`${BASE_URL}/journal/entries/${entryId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(entryData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to update journal entry');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error updating journal entry:', error);
            throw error;
        }
    },

    deleteJournalEntry: async (token, entryId) => {
        try {
            const response = await fetch(`${BASE_URL}/journal/entries/${entryId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete journal entry');
            }
            
            return true;
        } catch (error) {
            console.error('Error deleting journal entry:', error);
            throw error;
        }
    },

    // Analytics
   getJournalAnalytics: async (token, timeframe = 'weekly') => {
        try {
            console.log('Fetching analytics with timeframe:', timeframe);
            console.log('Using token:', token ? 'Token exists' : 'No token');
            
            const response = await fetch(
                `${BASE_URL}/journal/entries/analytics/?timeframe=${timeframe}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );
            
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error data:', errorData);
                throw new Error(`Failed to fetch analytics: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Analytics data received:', data);
            return data;
        } catch (error) {
            console.error('Detailed error:', error);
            throw error;
        }
    },
     
    
    getAssessmentHistory: async (token) => {
        try {
            console.log('Attempting to fetch assessment history...');
            console.log('Using token:', token ? 'Token present' : 'No token');
            console.log('Fetch URL:', `${BASE_URL}/assessments/history/`);

            const response = await fetch(`${BASE_URL}/assessments/history/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`Failed to fetch assessment history: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Successfully fetched assessment history:', data);
            return data;
        } catch (error) {
            console.error('Detailed fetch error:', error);
            throw error;
        }
    },

    saveAssessmentResult: async (token, assessmentData) => {
        try {
            console.log('Saving assessment result...');
            console.log('Assessment data:', assessmentData);

            const response = await fetch(`${BASE_URL}/assessments/save/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(assessmentData)
            });

            console.log('Save response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error('Failed to save assessment result');
            }

            const data = await response.json();
            console.log('Successfully saved assessment:', data);
            return data;
        } catch (error) {
            console.error('Error saving assessment result:', error);
            throw error;
        }
    }



};
export default API;

