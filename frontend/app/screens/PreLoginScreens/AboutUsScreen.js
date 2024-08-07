import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, StatusBar } from 'react-native';
import themeStyles from '../../styles/ThemeStyles';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../../components/Theme';
import getGloballySharedStyles from '../../styles/GloballySharedStyles';
import getLocallySharedStylesPreLoginScreens from '../../styles/LocallySharedStylesPreLoginScreens';


const AboutUsScreen = () => {
    const { theme } = useContext(ThemeContext);
    const sharedStyles = getGloballySharedStyles(theme);
    const localStyles = getLocallySharedStylesPreLoginScreens(theme);

    return (
        <SafeAreaView style={[{ backgroundColor: 'rgba(1, 193, 219, 1)' }]} >
            <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
            <ScrollView style={localStyles.containerWithPadding} contentContainerStyle={[{ paddingBottom: 30 }]} showsVerticalScrollIndicator={false}>
                <Image
                    source={require('../../../assets/logo-2.png')}
                    style={localStyles.logo}
                />
                <Text style={localStyles.title}>About AI-Chain-Contracts</Text>
                <Text style={localStyles.sectionTitle}>Project Description</Text>
                <Text style={localStyles.text}>
                    AI-Chain-Contracts is a platform developed in collaboration with IBM as a dissertation project at King's College London. It is experimental software designed to leverage Generative AI and smart contract technology to automate and secure employment interactions.
                </Text>
                <Text style={localStyles.sectionTitle}>Software Description</Text>
                <Text style={localStyles.text}>
                    AI-Chain-Contracts uses a fine-tuned model of OpenAI's GPT-3.5 Turbo to convert traditional legal employment contracts into smart ones. The backend is built using the Django Rest Framework, providing a robust environment for handling data processing and interactions with the AI model. The user interface is developed with React Native for both iOS and Android devices.
                </Text>
                <Text style={localStyles.sectionTitle}>Key Features</Text>
                <Text style={localStyles.text}>
                    - Contract Conversion: Automatically transforms traditional employment contracts into smart contracts using AI.
                </Text>
                <Text style={localStyles.text}>
                    - User Authentication: Secure account creation and management for both employers and employees.
                </Text>
                <Text style={localStyles.text}>
                    - Contract Management: Allows users to create, view, update, and delete smart contracts.
                </Text>
                <Text style={localStyles.text}>
                    - Salary Management: Facilitates salary payments using USDC Coin.
                </Text>
                <Text style={localStyles.text}>
                    - Notifications: Keeps users informed about contract updates, salary payments, and other important events.
                </Text>
                <Text style={localStyles.text}>
                    - Performance Metrics: Supports the input and management of job-related performance metrics.
                </Text>
                <Text style={localStyles.text}>
                    - Admin Panel: Provides an efficient backend management interface for system administrators.
                </Text>
                <Text style={localStyles.text}>
                    - Dispute Resolution: Offers mechanisms to resolve disputes based on contract terms.
                </Text>
                <Text style={localStyles.text}>
                    - Custom Theming: Supports dark and light modes for the user interface.
                </Text>
                <Text style={localStyles.text}>
                    - Scalability and Security: Ensures the system can handle a growing number of users and contracts securely.
                </Text>
                <Text style={localStyles.sectionTitle}>Technology Stack</Text>
                <Text style={localStyles.text}>
                    - Backend: Django Rest Framework
                </Text>
                <Text style={localStyles.text}>
                    - Frontend: React Native
                </Text>
                <Text style={localStyles.text}>
                    - AI Model: OpenAI's GPT-3.5 Turbo
                </Text>
                <Text style={localStyles.text}>
                    - Smart Contracts: Solidity
                </Text>
                <Text style={localStyles.text}>
                    - Database: PostgreSQL
                </Text>
                <Text style={localStyles.text}>
                    - Notifications: Redis server
                </Text>
                <Text style={localStyles.text}>
                    - Encryption: Nginx for HTTPS and WSS
                </Text>
                <Text style={localStyles.text}>
                    - Deployment: Google Cloud Platform
                </Text>
                <Text style={localStyles.text}>
                    - Containerisation: Docker
                </Text>
                <Text style={localStyles.sectionTitle}>Objectives and Benefits</Text>
                <Text style={localStyles.text}>
                    AI-Chain-Contracts aims to provide a reliable, efficient, and secure platform for managing and enforcing employment contracts. By automating the conversion process and ensuring secure transactions through blockchain technology, the platform enhances transparency and trust between employers and employees. The use of stable cryptocurrencies like USDC Coin for salary payments minimizes financial risks, making it a practical solution for modern employment management.
                </Text>
                <Text style={localStyles.text}>
                    This project lays the groundwork for future advancements, including the integration of more complex job-specific performance metrics and the expansion of smart contract applications in various employment scenarios.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AboutUsScreen;