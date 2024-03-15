import React, { useContext, useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Animated, Alert, LayoutAnimation, StyleSheet, Platform, UIManager } from 'react-native';
import getStyles from '../../styles/SharedStyles';
import { ThemeContext } from '../../components/Theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useContractHandling } from './UseHomeScreen';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DropZone = ({ handleFileSelectDropZone, onFileSelected, selectedFile }) => {
    const { theme, toggleTheme, isDarkMode } = useContext(ThemeContext);
    const styles = getStyles();

    return (
        <TouchableOpacity style={styles.dropZone} onPress={() => handleFileSelectDropZone(onFileSelected)}>
            {selectedFile ? (
                <>
                    <MaterialCommunityIcons name="file-document-outline" size={100} color="black" />
                    <Text style={styles.buttonText}>{selectedFile.assets[0].name}</Text>
                </>
            ) : (
                <Text style={[styles.dropZoneText, { color: theme === 'dark' ? 'grey' : 'darkgrey' }]}>Tap to select a .docx / .pdf / .txt file</Text>
            )}
        </TouchableOpacity>
    );
};

const ContractItem = ({ contract, openContract, openShareContract, deleteContract, theme }) => {
    const [expanded, setExpanded] = useState(false);
    const styles = getStyles(theme);
    const animationController = useRef(new Animated.Value(0)).current;
    const isMounted = useRef(true);

    const opacityAnimation = useRef(new Animated.Value(1)).current; 
    const heightAnimation = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        return () => {
            isMounted.current = false;
            animationController.stopAnimation();
        };
    }, []);

    const toggleExpand = () => {
        if (!isMounted.current) return;

        setExpanded(!expanded);

        Animated.timing(animationController, {
            toValue: expanded ? 0 : 1,
            duration: 500,
            useNativeDriver: false,
        }).start(() => {
            if (!isMounted.current) {
                animationController.stopAnimation(); 
            }
        });
    };

    const initiateDeletion = () => {
        Alert.alert(
            "Delete Contract",
            "Are you sure you want to delete this contract?",
            [
                { text: "Cancel" },
                { text: "Delete", onPress: handleDeletionAnimation }, // Trigger animation here
            ],
            { cancelable: false }
        );
    };

    const handleDeletionAnimation = () => {
        Animated.parallel([
            Animated.timing(opacityAnimation, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true
            }),
            Animated.timing(heightAnimation, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false
            })
        ]).start(() => deleteContract(contract));
    };

    const animatedHeight = animationController.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 180],
    });

    return (
        <TouchableOpacity onPress={toggleExpand} style={styles.contractItemAnimation}>
            <View style={styles.contractHeader}>
                <Text style={{ color: theme === 'dark' ? 'white' : 'black' }}>{contract.contract_name}.sol</Text>
                <MaterialCommunityIcons name={expanded ? "chevron-up" : "chevron-down"} size={24} color={theme === 'dark' ? 'white' : 'black'} />
            </View>
            <Animated.View style={[styles.expandedSection, { height: animatedHeight, overflow: 'hidden' }]}>
                <TouchableOpacity onPress={() => openContract(contract.contract_name)} style={styles.smartContractButton}>
                    <MaterialCommunityIcons name="file-document-outline" size={24} color={theme === 'dark' ? 'white' : 'black'} />
                    <Text style={{ color: theme === 'dark' ? 'white' : 'black', marginLeft: 5 }}>Access Contract</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openShareContract(contract.contract_name)} style={styles.smartContractButton}>
                    <MaterialCommunityIcons name="share-outline" size={24} color="green" />
                    <Text style={{ color: 'green', marginLeft: 5 }}>Share Contract</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={initiateDeletion} style={styles.smartContractButton}>
                    <MaterialCommunityIcons name="delete-outline" size={24} color="red" />
                    <Text style={{ color: 'red', marginLeft: 5 }}>Delete Contract</Text>
                </TouchableOpacity>
            </Animated.View>
        </TouchableOpacity>
    );
};

const HomeScreen = ({ navigation }) => {
    const { theme, toggleTheme, isDarkMode } = useContext(ThemeContext);
    const styles = getStyles(theme);

    const {
        selectedFile,
        setSelectedFile,
        contractName,
        setContractName,
        employerAddress,
        setEmployerAddress,
        authAppAddress,
        setAuthAppAddress,
        tokenContractInterface,
        setTokenContractInterface,
        savedContracts,
        handleFileSelectDropZone,
        uploadContractData,
        openShareContract,
        openContract,
        fetchAndSyncContracts,
        handleDeleteContract,
    } = useContractHandling(navigation);



    useEffect(() => {
        fetchAndSyncContracts();
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: theme === 'dark' ? '#1A1A1A' : 'white' }}>
            <ScrollView style={styles.scrollView}>
                <KeyboardAvoidingView
                    style={styles.container}
                >
                    <Text style={styles.header}>Smart Contract Toolkit</Text>

                    {/* Contract Creation Section */}
                    <View style={styles.card}>
                        <Text style={styles.cardHeader}>Upload an Employment Contract</Text>
                        <DropZone handleFileSelectDropZone={handleFileSelectDropZone} onFileSelected={setSelectedFile} selectedFile={selectedFile} />
                        <TextInput style={styles.input} placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'} placeholder="Enter Contract Name" value={contractName} onChangeText={setContractName} />
                        <TextInput style={styles.input} placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'} placeholder="Set Employer's USDC Address" value={employerAddress} onChangeText={setEmployerAddress} />
                        <TextInput style={styles.input} placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'} placeholder="Set AuthApp's Address" value={authAppAddress} onChangeText={setAuthAppAddress} />
                        <TextInput style={styles.input} placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'} placeholder="Set USDC's Token Contract Interface" value={tokenContractInterface} onChangeText={setTokenContractInterface} />
                        <TouchableOpacity style={styles.button} onPress={uploadContractData}>
                            <Text style={styles.buttonText}>Create Contract</Text>
                        </TouchableOpacity>
                    </View>

                    {/* User's Smart Contracts */}
                    <View style={styles.card}>
                        <Text style={styles.cardHeader}>My Smart Contracts</Text>
                        {savedContracts.length === 0 ? (
                            <Text style={styles.noContractsText}>No saved contracts yet</Text>
                        ) : (
                            savedContracts.map((contract, index) => (
                                <ContractItem 
                                key={index} 
                                contract={contract} 
                                openContract={openContract} 
                                openShareContract={openShareContract} 
                                deleteContract={handleDeleteContract} 
                                theme={theme} />
                            ))
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
                </KeyboardAvoidingView>
            </ScrollView>

            {/* Separator Line */}
            <View style={{ height: 0.3, backgroundColor: theme === 'dark' ? 'grey' : 'darkgrey', bottom: 90, left: 0, right: 0 }} />

        </View >
    );
};

export default HomeScreen;
