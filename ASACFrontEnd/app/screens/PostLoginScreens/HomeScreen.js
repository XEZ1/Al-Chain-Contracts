import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import getStyles from '../../styles/SharedStyles';
import { ThemeContext } from '../../components/Theme';

// DropZone Component (as provided in the second snippet)
const DropZone = ({ onFileSelected }) => {
  const { theme, toggleTheme, isDarkMode } = useContext(ThemeContext);
  
  const handleFileSelect = () => {
    // Dummy data for selected file
    onFileSelected({ name: 'ContractCode.sol' });
    Alert.alert('File Selected', 'You have selected a file.');
  };

  // Retrieve styles from the theme context or define them here
  const styles = getStyles(); // This needs to be adjusted to your actual implementation

  return (
    <TouchableOpacity style={styles.dropZone} onPress={handleFileSelect}>
      <Text style={styles.buttonText} placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}>Tap to select a .sol file</Text>
    </TouchableOpacity>
  );
};

const HomeScreen = ( navigation ) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const { theme, toggleTheme, isDarkMode } = useContext(ThemeContext);
  const styles = getStyles(theme);
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.header}>Smart Contract Toolkit</Text>

        {/* Contract Creation Section */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Create a New Contract</Text>
          <TextInput style={styles.input} placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'} placeholder="Enter Contract Name" />
          <TextInput style={styles.input} placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'} placeholder="Set Initial Supply" keyboardType="numeric" />
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Create Contract</Text>
          </TouchableOpacity>
        </View>

        {/* File Upload Section */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Upload Contract Code</Text>
          <DropZone onFileSelected={handleFileSelect} />
          {selectedFile && (
            <Text style={styles.fileName}>File: {selectedFile.name}</Text>
          )}
        </View>

        {/* Contract Templates Section */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Contract Templates</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>ERC20 Token</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>ERC721 Token</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Crowdsale</Text>
          </TouchableOpacity>
        </View>

        {/* Contract Deployment Section */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Deploy Your Contract</Text>
          <TextInput style={styles.input} placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'} placeholder="Enter Network (e.g., Ethereum, Binance Smart Chain)" />
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Deploy Contract</Text>
          </TouchableOpacity>
        </View>

        {/* User's Contracts Section */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>My Contracts</Text>
          {/* This would be a list component that lists the contracts the user has created */}
        </View>

        {/* Additional Features */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Tools & Utilities</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Contract Interactions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Transaction History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Smart Contract Analytics</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Section */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>All rights reserved © Smart Contract Toolkit</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
