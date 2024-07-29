import React, { useCallback, useRef, useState, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { useKeyboard } from '../../../components/Keyboard';
import { useFocusEffect } from '@react-navigation/native';
import { ThemeContext } from '../../../components/Theme';
import getGloballySharedStyles from '../../../styles/GloballySharedStyles';
import getLocallySharedStylesSupportScreens from '../../../styles/LocallySharedStylesSupportScreens';


const SupportScreen = ({ navigation }) => {
    const { theme } = useContext(ThemeContext);
    const sharedStyles = getGloballySharedStyles(theme);
    const localStyles = getLocallySharedStylesSupportScreens(theme);
    const [message, setMessage] = useState('');
    const viewRef = useRef(null);

    //const scrollViewPaddingBottom = '120%'; //keyboardHeight > 0 ? '0%' : '120%';
    const { keyboardHeight, registerScrollViewRef, unregisterScrollViewRef } = useKeyboard();

    const [messages, setMessages] = useState([
        { id: '1', text: 'Hi! How can I help you today?', isAssistant: true },
    ]);

    const handleSendMessage = () => {
        if (message.trim()) {
            const newMessage = { id: String(messages.length + 1), text: message, isAssistant: false };
            setMessages([...messages, newMessage]);
            setMessage('');
        }
    };

    useFocusEffect(
        useCallback(() => {
            const id = "SupportScreen";
            registerScrollViewRef(id, viewRef);

            return () => {
                unregisterScrollViewRef(id);
            };
        }, [registerScrollViewRef, unregisterScrollViewRef])
    );


    return (
        <View style={[sharedStyles.container, localStyles.zeroPadding, { paddingBottom: keyboardHeight }]} >
            <Text style={sharedStyles.pageHeaderText}>Support Chat</Text>

            <ScrollView style={[localStyles.maxWidth, { flex: 1 }]} showsVerticalScrollIndicator={false}>
                {/* Message bubbles */}
                {messages.map((msg, index) => (
                    <View
                        key={msg.id}
                        testID={`messageView-${index}`}
                        style={[
                            sharedStyles.cardContainer,
                            {
                                marginTop: '10%',
                                padding: '5%',

                                alignSelf: msg.isAssistant ? 'flex-start' : 'flex-end',
                                //backgroundColor: msg.isAssistant ? sharedStyles.cardContainer.backgroundColor : sharedStyles.tabBar.activeTintColor,
                            },
                        ]}
                    >
                        <Text style={[sharedStyles.generalText, sharedStyles.bigFont]}>
                            {msg.text}
                        </Text>
                    </View>
                ))}
            </ScrollView>
            
            <View style={[sharedStyles.separatorLine, { bottom: keyboardHeight + 177.6 }]} />
            {/* Input area */}
            <View ref={viewRef} style={[localStyles.inputAreaContainer, sharedStyles.mediumMarginBottom, { marginTop: 0 }]} testID="viewTestID">
                <TextInput
                    testID='inputTextFieldTestID'
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
            <View style={[sharedStyles.separatorLine, { bottom: keyboardHeight + 90 }]} />
        </View>
    )
};

export default SupportScreen;
