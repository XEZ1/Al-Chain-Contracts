import React, { useState, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native';
import getStyles from '../../styles/SharedStyles';
import { ThemeContext } from '../../components/Theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SupportScreen = ({ navigation }) => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme); // Applying the theme to the styles
    const [message, setMessage] = useState('');

    // Dummy data for messages
    const messages = [
        { id: '1', text: 'Hi! How can I help you today?', isAssistant: true },
        // ... other messages
    ];

    // Handler for sending a message
    const handleSendMessage = () => {
        if (message.trim()) {
            // Here, you'd normally append the message to your messages state or send it to your backend
            console.log('Sending message:', message);
            setMessage(''); // Clear the input field after sending the message
        }
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container} 
            behavior="padding"
        >
            <Text style={styles.header}>Support Chat</Text>

            <ScrollView
                style={{ flex: 1, width: '100%' }}
                contentContainerStyle={{ padding: 10 }}
            >
                {/* Message bubbles */}
                {messages.map((msg) => (
                    <View
                        key={msg.id}
                        style={[
                            styles.card,
                            {
                                alignSelf: msg.isAssistant ? 'flex-start' : 'flex-end',
                                backgroundColor: msg.isAssistant ? styles.card.backgroundColor : styles.tabBar.activeTintColor,
                            },
                        ]}
                    >
                        <Text style={[styles.settingText, { color: theme === 'dark' ? '#FFF' : '#000' }]}>
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
                        styles.input,
                        {
                            flex: 1,
                            marginRight: 10,
                            marginTop: 18.5,
                            height: 50, 
                        }
                    ]}
                    multiline
                />
                <TouchableOpacity onPress={handleSendMessage} style={[styles.sendButton]}>
                    <Text style={styles.buttonText}>Send</Text>
                </TouchableOpacity>
            </View>  

            {/* Separator Line */}
            <View style={{ position: 'absolute', height: 0.3, backgroundColor: theme === 'dark' ? 'grey' : 'darkgrey', bottom: 90, left: 0, right: 0 }} />
        </KeyboardAvoidingView>
    )
};

export default SupportScreen;
