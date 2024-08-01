import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import getGloballySharedStyles from '../../../styles/GloballySharedStyles';
import getLocallySharedStylesHomeScreens from '../../../styles/LocallySharedStylesHomeScreens';


/**
 * ContractItem component to display and manage individual contract items.
 * @param {object} contract - The contract data to display.
 * @param {function} openContract - Function to open the contract.
 * @param {function} openShareContract - Function to share the contract.
 * @param {function} deleteContract - Function to delete the contract.
 * @param {string} theme - The current theme (light or dark).
 * @returns {JSX.Element} - The ContractItem component.
 */
export const ContractItem = ({ contract, openContract, openShareContract, deleteContract, theme }) => {
    const sharedStyles = getGloballySharedStyles(theme);
    const localStyles = getLocallySharedStylesHomeScreens(theme); 

    // State to manage the expanded state of the contract item
    const [expanded, setExpanded] = useState(false);
    const animationController = useRef(new Animated.Value(0)).current;
    const opacityAnimation = useRef(new Animated.Value(1)).current; 
    const heightAnimation = useRef(new Animated.Value(1)).current;
    const isMounted = useRef(true);

    /**
     * Cleanup function to stop animations when the component unmounts.
     */
    useEffect(() => {
        return () => {
            isMounted.current = false;
            animationController.stopAnimation();
        };
    }, []);

    /**
     * Toggle the expansion of the contract item.
     */
    const toggleExpand = () => {
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

    /**
     * Initiate the deletion process of the contract with a confirmation alert.
     */
    const initiateDeletion = () => {
        Alert.alert(
            "Delete Contract",
            "Are you sure you want to delete this contract?",
            [
                { text: "Cancel" },
                { text: "Delete", onPress: handleDeletionAnimation },
            ],
            { cancelable: false }
        );
    };

    /**
     * Handle the deletion animation before actually deleting the contract.
     */
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
            // Call the deleteContract function passed as a prop
            deleteContract(contract)
        });
    };

    // Interpolated height animation for the expanded view
    const animatedHeight = animationController.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 180],
    });

    return (
        <TouchableOpacity onPress={toggleExpand} style={localStyles.contractItemContainer} testID='chevronTestID'>
            <View style={sharedStyles.rowCenteredContainer}>
                <Text style={sharedStyles.generalText}>{contract.contract_name}.sol</Text>
                <MaterialCommunityIcons name={expanded ? "chevron-up" : "chevron-down"} size={24} color={theme === 'dark' ? 'white' : 'black'} />
            </View>
            <Animated.View style={[localStyles.mediumTopPadding, { height: animatedHeight, overflow: 'hidden' }]}>
                <TouchableOpacity onPress={() => openContract(contract.contract_name)} style={localStyles.smartContractButton}>
                    <MaterialCommunityIcons name="file-document-outline" size={24} color={theme === 'dark' ? 'white' : 'black'} />
                    <Text style={[sharedStyles.generalText, localStyles.smallLeftMargin]}>Access Contract</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openShareContract(contract.contract_name)} style={localStyles.smartContractButton}>
                    <MaterialCommunityIcons name="share-outline" size={24} color="green" />
                    <Text style={[sharedStyles.generalText, localStyles.smallLeftMargin, {color: 'green'}]}>Share Contract</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={initiateDeletion} style={localStyles.smartContractButton}>
                    <MaterialCommunityIcons name="delete-outline" size={24} color="red" />
                    <Text style={[sharedStyles.generalText, localStyles.smallLeftMargin, {color: 'red'}]}>Delete Contract</Text>
                </TouchableOpacity>
            </Animated.View>
        </TouchableOpacity>
    );
};
