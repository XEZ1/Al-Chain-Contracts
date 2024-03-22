import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { BACKEND_URL } from '@env';

