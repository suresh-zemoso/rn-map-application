import { View, Text, TextInput, StyleSheet, TouchableHighlight } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React from 'react';
import { getItem } from '../utils/tokenUtils';
import axios from 'axios';

class AddLocationModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            coordinate: this.props.route.params.coordinate
        };
    }

    // getDerivedStateFromProps(props, state) {
    //     this.setState({ coordinate: props.route.params.coordinate });
    // }
    addLocation = (coordinate) => {

        const data = {
            lng: coordinate[0].toFixed(6),
            lat: coordinate[1].toFixed(6)
        }
        getItem('access_token')
            .then((token) => {
                axios({
                    method: 'post',
                    url: 'http://192.168.43.129:3001/locations',
                    data,
                    headers: {
                        'Authorization': token
                    }
                })
                    .then(data => {
                        this.props.navigation.navigate('MainStackScreen', {
                            screen: 'BottomTabs',
                            params: {
                                screen: 'LocationListStackScreen',
                                params: {
                                    screen: 'LocationList'
                                }
                            }
                        });
                    }, error => {
                        console.warn(error);
                    })
            })
            .catch(error => console.warn(error));


    }
    render() {
        const { coordinate } = this.state;
        return (
            <KeyboardAwareScrollView contentContainerStyle={styles.container}>
                <View style={styles.viewContainer} >
                    <Text style={styles.locationText}>Location with Longtitue {coordinate[0].toFixed(2)} and Latitude {coordinate[1].toFixed(2)}</Text>
                    <View>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Location Name"
                            onChangeText={(text) => { this.setState({ name: text }) }}
                            value={this.state.name}
                        />
                        <TouchableHighlight
                            style={styles.button}
                            onPress={() => this.addLocation(coordinate)}
                        >
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableHighlight>
                    </View>
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
        width: 200,
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
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewContainer: {
        height: '25%',
        justifyContent: 'space-between'
        // alignItems: 'center'
    },
    locationText: {
        fontSize: 15,
        // top: 0,
        // position: 'absolute'
    }
})
export default AddLocationModal;