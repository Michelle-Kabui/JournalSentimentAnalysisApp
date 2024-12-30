import AsyncStorage from '@react-native-async-storage/async-storage';

export const TokenStorage = {
    storeTokens: async (tokens) => {
        try {
            await AsyncStorage.setItem('access_token', tokens.access);
            await AsyncStorage.setItem('refresh_token', tokens.refresh);
            console.log('Tokens stored successfully'); // Debug log
        } catch (error) {
            console.error('Error storing tokens:', error);
            throw error;
        }
    },

    getAccessToken: async () => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            console.log('Retrieved access token:', token ? 'Yes' : 'No'); // Debug log
            return token;
        } catch (error) {
            console.error('Error getting access token:', error);
            return null;
        }
    },

    getRefreshToken: async () => {
        try {
            return await AsyncStorage.getItem('refresh_token');
        } catch (error) {
            console.error('Error getting refresh token:', error);
            return null;
        }
    },

    clearTokens: async () => {
        try {
            await AsyncStorage.removeItem('access_token');
            await AsyncStorage.removeItem('refresh_token');
        } catch (error) {
            console.error('Error clearing tokens:', error);
        }
    }
};