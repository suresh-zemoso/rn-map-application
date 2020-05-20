import React, { Component, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const LocationList = () => {

    const locations = [{ id: 0, lng: '34', lat: '45' }, { id: 1, lng: '32', lat: '60' }, { id: 2, lng: '11', lat: '84' }]
    useEffect(() => {

    }, [])
    return (
        <View>
            <FlatList
                data={locations}
                renderItem={({ item }) => <Text style={styles.item}>{item.id + 1}. Longtitude {item.lng} and Latitude {item.lat}</Text>}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        fontSize: 20,
        padding: 20,
        margin: 1,
        // borderColor: 'grey',
        // borderBottomWidth: 1,
        elevation: 2,
        // backgroundColor: 'white'
    }
})

export default LocationList;
