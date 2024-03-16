import { useState } from 'react';
import { Alert, LayoutAnimation } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { BACKEND_URL } from '@env';

