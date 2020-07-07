import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableHighlight } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
// import * as SecureStore from 'expo-secure-store';

class LoginPage extends Component {

    state = {
        username: '',
        password: ''
    };

    submitForm = () => {

        const data = {
            username: this.state.username,
            password: this.state.password
        }
        axios({
            method: 'post',
            url: 'http://192.168.43.129:3001/login',
            data,
            headers: { 'Content-Type': 'application/json' }
        })
            .then(data => {
                // console.log('Response from Api', data)
                AsyncStorage.setItem(
                    'access_token',
                    data.data.access_token
                );
                this.setState({ username: '', password: '' })
                this.props.navigation.navigate('BottomTabs');
            },
                error => {
                    console.warn(error)
                })
    }

    render() {
        return (
            <KeyboardAwareScrollView contentContainerStyle={styles.container}>
                <View >
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Username"
                        onChangeText={(text) => { this.setState({ username: text }) }}
                        value={this.state.username}
                    />
                    <TextInput
                        style={styles.input}
                        secureTextEntry={true}
                        placeholder="Enter Password"
                        onChangeText={(text) => { this.setState({ password: text }) }}
                        value={this.state.password}
                    />
                    <TouchableHighlight
                        style={styles.button}
                        onPress={this.submitForm}
                    >
                        <Text style={styles.buttonText}>Sign In</Text>
                    </TouchableHighlight>
                </View>
            </KeyboardAwareScrollView>
        );
    }
}

const styles = StyleSheet.create({
    input: {
        marginBottom: 30,
        padding: 10,
        paddingHorizontal: 20,
        fontSize: 16,
        color: 'black',
        borderBottomWidth: 1,
        borderColor: 'blue',
        // backgroundColor: 'grey',
        width: 180,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        height: 35,
        backgroundColor: 'blue',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    buttonText: {
        fontSize: 15,
        textAlign: 'center',
        color: 'white'
    }
})
export default LoginPage;