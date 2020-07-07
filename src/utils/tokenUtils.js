import AsyncStorage from '@react-native-community/async-storage';

export const getItem = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        console.debug("Value of promise", value);
        if (value !== null) {
            return value;
        }
    } catch (error) {
        Promise.reject(error);
    }
    return;
};