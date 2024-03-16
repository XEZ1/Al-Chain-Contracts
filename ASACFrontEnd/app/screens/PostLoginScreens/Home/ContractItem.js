import React, { useContext, useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity,  Animated, Alert } from 'react-native';
import getStyles from '../../../styles/SharedStyles';
import { MaterialCommunityIcons } from '@expo/vector-icons';


export const ContractItem = ({ contract, openContract, openShareContract, deleteContract, theme }) => {
    const [expanded, setExpanded] = useState(false);
    const styles = getStyles(theme);
    const animationController = useRef(new Animated.Value(0)).current;
    const opacityAnimation = useRef(new Animated.Value(1)).current; 
    const heightAnimation = useRef(new Animated.Value(1)).current;
    const isMounted = useRef(true);

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
        ]).start(() => {
            if (!isMounted.current) {
                opacityAnimation.stopAnimation();
                heightAnimation.stopAnimation();
            }
            deleteContract(contract)
        });
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

export default ContractItem;