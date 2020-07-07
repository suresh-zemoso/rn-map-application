import React from 'react';
import { Text, View, TouchableHighlight, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';



const About = (props) => {

    function logout() {
        AsyncStorage.setItem(
            'access_token',
            ''
        );
        props.navigation.navigate('LoginPage')
    }
    return (
        <View style={styles.container}>
            <TouchableHighlight
                style={styles.button}
                onPress={() => logout()}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableHighlight>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        display: 'flex',
        height: 30,
        width: 100,
        padding: 5,
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        borderRadius: 5
    },
    buttonText: {
        fontSize: 17,
        color: 'white'
    },
})
export default About;
