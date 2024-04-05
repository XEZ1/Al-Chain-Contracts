import React, { useState, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native';
import getStyles from '../../../styles/SharedStyles';
import { ThemeContext } from '../../../components/Theme';
import getLocalStyles from './LocalSharedStyles';


const SupportScreen = ({ navigation }) => {
    const { theme } = useContext(ThemeContext);
    const sharedStyles = getStyles(theme);
    const localStyles = getLocalStyles(theme);
    const [message, setMessage] = useState('');

    const messages = [
        { id: '1', text: 'Hi! How can I help you today?', isAssistant: true },
       
    ];
   
    const handleSendMessage = () => {
        if (message.trim()) {
            console.log('Sending message:', message);
            setMessage('');
        }
    };

    return (
        <KeyboardAvoidingView 
            style={sharedStyles.container} 
            behavior="padding"
        >
            <Text style={sharedStyles.pageHeaderText}>Support Chat</Text>

            <ScrollView
                style={[localStyles.maxWidth, { flex: 1 }]}
                contentContainerStyle={localStyles.smallPading}
            >
                {/* Message bubbles */}
                {messages.map((msg) => (
                    <View
                        key={msg.id}
                        style={[
                            sharedStyles.cardContainer,
                            {
                                alignSelf: msg.isAssistant ? 'flex-start' : 'flex-end',
                                backgroundColor: msg.isAssistant ? sharedStyles.cardContainer.backgroundColor : sharedStyles.tabBar.activeTintColor,
                            },
                        ]}
                    >
                        <Text style={[sharedStyles.generalText, sharedStyles.bigFont]}>
                            {msg.text}
                        </Text>
                    </View>
                ))}
            </ScrollView>
       
            {/* Input area */}
            <View style={localStyles.inputAreaContainer}>
                <TextInput
                    value={message}
                    onChangeText={setMessage}
                    placeholder='Type your message here...'
                    placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                    style={[sharedStyles.inputField, localStyles.inputFieldLocalContainer]}
                    multiline
                />
                <TouchableOpacity onPress={handleSendMessage} style={[sharedStyles.button, localStyles.localButtonContainer]}>
                    <Text style={[sharedStyles.generalText, sharedStyles.boldMediumText]}>Send</Text>
                </TouchableOpacity>
            </View>  

            {/* Separator Line */}
            <View style={sharedStyles.separatorLine} />
        </KeyboardAvoidingView>
    )
};

export default SupportScreen;
