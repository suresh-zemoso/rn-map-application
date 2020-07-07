import React, { Component, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableHighlight, Linking } from 'react-native';
import { getItem } from '../utils/tokenUtils';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { useLinkTo } from '@react-navigation/native';

const LocationList = ({ navigation }) => {

    const [locationList, setlocationList] = useState([]);

    const isFocused = useIsFocused();
    const linkTo = useLinkTo();

    useEffect(() => {
        getItem('access_token').then((token) => {
            console.debug('token is', token)
            axios({
                method: 'get',
                url: 'http://192.168.43.129:3001/locations',
                headers: { 'Authorization': token }
            }).then(response => {
                // console.debug(data)
                setlocationList(response.data)
            }, error => {
                console.warn(error)
            })
        }).catch(error => console.warn(error));
    }, [isFocused])

    useEffect(() => {
        // let user = await AsyncStorage.getItem('access_token');  
        getItem('access_token').then((token) => {
            console.debug('token is', token)
            axios({
                method: 'get',
                url: 'http://192.168.43.129:3001/locations',
                headers: { 'Authorization': token }
            }).then(response => {
                // console.debug(data)
                setlocationList(response.data)
            }, error => {
                console.warn(error)
            })
        }).catch(error => console.warn(error));

    }, [])

    function openLocation(item) {
        navigation.navigate('FlyToLocation', { coordinate: item })
    }
    return (
        <View>
            <FlatList
                data={locationList}
                renderItem={({ item }) => <View>
                    <Text
                        style={styles.item}>
                        {item.id}. Longtitude {item.lng.toFixed(3)} and Latitude {item.lat.toFixed(3)}</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableHighlight
                            style={styles.button}
                            onPress={() => Linking.openURL(`mychat://location/${item.lng}/${item.lat}`)}>
                            <Text style={styles.buttonText}>In New App</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={styles.button}
                            onPress={() => openLocation(item)}
                        >
                            <Text style={styles.buttonText}>Here</Text>
                        </TouchableHighlight>
                    </View>
                </View>}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        fontSize: 15,
        padding: 20,
        margin: 1,
        // borderColor: 'grey',
        // borderBottomWidth: 1,
        elevation: 2,
        // backgroundColor: 'white'
    },
    button: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 20,
        width: 'auto',
        padding: 5,
        backgroundColor: 'blue',
        margin: 5,
        borderRadius: 5
    },
    buttonText: {
        fontSize: 10,
        color: 'white'
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        paddingHorizontal: 25
    }
})

export default LocationList;
