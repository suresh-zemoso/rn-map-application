import { View, Text, StyleSheet, Button } from 'react-native';
import React, { Component } from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import Icon from 'react-native-vector-icons/FontAwesome';


class AddLocationPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coordinates: []
        };
        MapboxGL.setAccessToken('pk.eyJ1Ijoic3VyZXNoLXplbW9zbyIsImEiOiJjazkweng5cXowNmd0M2Zyb2I0YjllMWFoIn0.uCF7DOpC6m3gvu3n2uoQ8A');
        this.props.navigation.setOptions({
            title: 'Add Location',
            headerRight: () => (
                // <Icon style={styles.icon} onPress={() => this.props.navigation.navigate('BottomTabs')} color='green' name="info-circle" size={30} />
                <Button onPress={() => this.props.navigation.navigate('AddLocationModal')} title="Add" />
            )
        });
    }

    onPress = (feature) => {
        const coords = Object.assign([], this.state.coordinates);
        console.log("Coordinates are", feature.geometry.coordinates)
        if (coords.length === 0) {
            coords.push(feature.geometry.coordinates);
            this.setState({ coordinates: coords });
        }
    }

    renderAnnotations = () => {

        if (this.state.coordinates.length === 0)
            return;

        const coordinate = this.state.coordinates[0];

        const title = `Lon: ${coordinate[0]} Lat: ${coordinate[1]}`;
        const id = `pointAnnotation0`;
        return <MapboxGL.PointAnnotation
            key={id}
            id={id}
            coordinate={coordinate}
            title={title}>
            <View style={styles.annotationContainer} />
            <MapboxGL.Callout title={`${coordinate[0].toFixed(2)}, ${coordinate[1].toFixed(2)}`} />
        </MapboxGL.PointAnnotation>
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <MapboxGL.MapView
                    // onRegionDidChange={this.onRegionDidChange}
                    ref={(c) => (this._map = c)}
                    onPress={this.onPress}
                    style={{ flex: 1 }}>
                    <MapboxGL.Camera
                        zoomLevel={9}
                        centerCoordinate={[-73.970895, 40.723279]}
                    />
                    {this.renderAnnotations()}
                </MapboxGL.MapView>
            </View>
        );
    }
}


const ANNOTATION_SIZE = 45;

const styles = StyleSheet.create({
    annotationContainer: {
        width: ANNOTATION_SIZE,
        height: ANNOTATION_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: ANNOTATION_SIZE / 2,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgba(0, 0, 0, 0.45)',
        overflow: 'hidden',
    },
    annotationFill: {
        width: ANNOTATION_SIZE - 3,
        height: ANNOTATION_SIZE - 3,
        borderRadius: (ANNOTATION_SIZE - 3) / 2,
        backgroundColor: 'orange',
        transform: [{ scale: 0.6 }],
    },
    icon: {
        justifyContent: 'center'
    }
});

export default AddLocationPage;