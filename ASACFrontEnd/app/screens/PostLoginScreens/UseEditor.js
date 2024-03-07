import { useState } from 'react';
import { Alert, LayoutAnimation } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { BACKEND_URL } from '@env';

const openShareContract = async (contractName) => {
    console.log(contractName);
    try {
        const filePath = `${FileSystem.documentDirectory}${contractName}.sol`;
        console.log(filePath);
        // Check if the sharing is available
        if (!(await Sharing.isAvailableAsync())) {
            Alert.alert("Error", "Sharing not available on this device");
            return;
        }

        await Sharing.shareAsync(filePath);
    } catch (error) {
        Alert.alert("Error", "Could not share the contract file.");
        console.error(error);
    }
};