import React from 'react';
import { ImageBackground, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const loginHandler = async () => {
    const [user, setUser] = useContext(userContext);

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    const [errors, setErrors] = useState({});

    var response = await login(username, password, user, setUser);
    if (response.status == "Error") {
        Alert.alert("Error", response.body["message"]);
    } else if (response.status == 400 && response.body) {
        setErrors(response.body);

        if (response.body["non_field_errors"]) {
            Alert.alert("Error", "Login Error");
        }
    } else {
        console.log("Login Successful")
        await sendLogInNotification();
    }

    
};

