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
                style={{ flex: 1, width: '100%' }}
                contentContainerStyle={{ padding: 10 }}
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
                        <Text style={[localStyles.settingText, { color: theme === 'dark' ? '#FFF' : '#000' }]}>
                            {msg.text}
                        </Text>
                    </View>
                ))}
            </ScrollView>
       
            {/* Input area */}
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 85 }}>
                <TextInput
                    value={message}
                    onChangeText={setMessage}
                    placeholder='Type your message here...'
                    placeholderTextColor={theme === 'dark' ? 'grey' : 'darkgrey'}
                    style={[
                        localStyles.input,
                        {
                            flex: 1,
                            marginRight: 10,
                            marginTop: 18.5,
                            height: 50, 
                        }
                    ]}
                    multiline
                />
                <TouchableOpacity onPress={handleSendMessage} style={[localStyles.sendButton]}>
                    <Text style={localStyles.buttonText}>Send</Text>
                </TouchableOpacity>
            </View>  

            {/* Separator Line */}
            <View style={sharedStyles.separatorLine} />
        </KeyboardAvoidingView>
    )
};

export default SupportScreen;
