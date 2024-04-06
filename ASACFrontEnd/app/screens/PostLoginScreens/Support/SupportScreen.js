import React, { useState, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native';
import getGloballySharedStyles from '../../../styles/GloballySharedStyles';
import { ThemeContext } from '../../../components/Theme';
import getLocallySharedStylesSupportScreens from '../../../styles/LocalSharedStylesSupportScreens';


const SupportScreen = ({ navigation }) => {
    const { theme } = useContext(ThemeContext);
    const sharedStyles = getGloballySharedStyles(theme);
    const localStyles = getLocallySharedStylesSupportScreens(theme);
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
        <View style={[sharedStyles.container, localStyles.zeroBottomPadding]} >
            <Text style={sharedStyles.pageHeaderText}>Support Chat</Text>

            <ScrollView style={[localStyles.maxWidth, { flex: 1 }]}>
                {/* Message bubbles */}
                {messages.map((msg) => (
                    <View
                        key={msg.id}
                        style={[
                            sharedStyles.cardContainer, 
                            {
                                marginTop: '10%',
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
            
            <View style={[sharedStyles.separatorLine, { bottom: 713 }]} /> 

            {/* Separator Line */}
            <View style={sharedStyles.separatorLine} />
        </View>
    )
};

export default SupportScreen;
