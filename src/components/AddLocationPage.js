import { View, Text, StyleSheet, Button, TouchableHighlight, TouchableOpacity, TextInput, FlatList, ActivityIndicator } from 'react-native';
import React, { Component } from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
// import SearchableDropdown from 'react-native-searchable-dropdown';
import axios from 'axios';


class AddLocationPage extends Component {
    constructor(props) {
        super(props);

        this.isAndroid = Platform.OS === 'android';
        this.shape = {
            'type': 'FeatureCollection',
            'features': [
            ]
        };

        this.state = {
            selectedItems: [],
            suggestedLocations: [],
            circleCoordinate: [],
            coordinates: [],
            showUserLocation: true,
            isFetchingAndroidPermission: this.isAndroid,
            isAndroidPermissionGranted: false,
            visibleCurrentLocation: false,
            mapMode: 'Street',
            text: '',
            searchedCoordinate: [75, 32],
            showMarker: false,
            isFetching: false,
            addCircleMode: false
        };
        AsyncStorage.setItem(
            'access_token',
            'fake-access-token'
        );
        this.accessToken = 'pk.eyJ1Ijoic3VyZXNoLXplbW9zbyIsImEiOiJjazkweng5cXowNmd0M2Zyb2I0YjllMWFoIn0.uCF7DOpC6m3gvu3n2uoQ8A';
        MapboxGL.setAccessToken(this.accessToken);
        this.props.navigation.setOptions({
            headerRight: () => (
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                }}>
                    <TouchableOpacity
                        disabled={this.state.coordinates.length == 0}
                        onPress={() => this.props.navigation.navigate('AddLocationModal', { coordinate: this.state.coordinates[0] })}>
                        <Icon
                            style={styles.icon}
                            color={this.state.coordinates.length ? 'black' : 'grey'}
                            name="plus"
                            size={25} />
                    </TouchableOpacity>
                </View>
            )
        });
    }


    componentDidMount() {
        // MapboxGL.locationManager.start();
        this.props.navigation.addListener('blur', () => {
            this.setState({ coordinates: [] })
        });
    }
    componentWillUnmount() {
        this.props.navigation.removeListener('blur', () => {
        });
        MapboxGL.locationManager.stop();

    }
    componentDidUpdate() {

        this.props.navigation.setOptions({
            headerRight: () => (
                // <Icon style={styles.icon} onPress={() => this.props.navigation.navigate('BottomTabs')} color='green' name="info-circle" size={30} />
                <TouchableOpacity
                    disabled={this.state.coordinates.length == 0}
                    onPress={() => this.props.navigation.navigate('AddLocationModal', { coordinate: this.state.coordinates[0] })}>
                    {/* <Text style={styles.icon}>Add</Text>  */}
                    <Icon
                        style={styles.icon}
                        color={this.state.coordinates.length ? 'black' : 'grey'}
                        name="plus"
                        size={25} />
                </TouchableOpacity>
                // <Button onPress={() => this.props.navigation.navigate('AddLocationModal')} title="Add" />
            )
        });
    }
    onPress = (feature) => {
        const coords = [];
        // console.log("Coordinates are", feature.geometry.coordinates)
        coords.push(feature.geometry.coordinates);
        this.setState({ coordinates: coords });
    }

    renderAnnotations = () => {

        if (this.state.coordinates.length === 0)
            return;

        const coordinate = this.state.coordinates[0];

        if (this.state.addCircleMode) {
            const feature = {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': coordinate
                }
            }
            this.shape.features = []
            this.shape.features.push(feature)
            return <MapboxGL.ShapeSource id='line1' shape={this.shape}>
                <MapboxGL.CircleLayer
                    id='sfCircleFill'
                    sourceLayerID='sf2010'
                    style={{
                        visibility: 'visible',
                        circleRadius: 40,
                        circleColor: '#A9A9A9',
                        circleStrokeColor: '#A9A9A9',
                        circleStrokeWidth: 5,
                        circleOpacity: 0.0
                    }}
                />
            </MapboxGL.ShapeSource>
        }
        else {
            const title = `Lon: ${coordinate[0]} Lat: ${coordinate[1]}`;
            const id = `pointAnnotation0`;
            return <MapboxGL.PointAnnotation
                // key={id}
                id={id}
                coordinate={coordinate}
                title={title}
                ref={(ref) => (this.annotationRef = ref)}
            >
                <View style={styles.annotationContainer} >
                    <Entypo onLoad={() => this.annotationRef.refresh()} size={40} name="location-pin" />
                </View>
            </MapboxGL.PointAnnotation>
        }
    }

    getCurrentLocation = async () => {
        if (this.isAndroid) {
            const isGranted = await MapboxGL.requestAndroidLocationPermissions();
            this.setState({
                isAndroidPermissionGranted: isGranted,
                isFetchingAndroidPermission: false,
                visibleCurrentLocation: true
            });
        }
    }

    onUpdateUserLocation = (location) => {
        console.debug('Current Location is', location)
        this.setState({ location: location });
    }

    centerMap = () => {
        this.getCurrentLocation().then(() => {
            console.debug('Current Location Coordinate are', this.state.location)
            if (this.state.location) {
                const { longitude, latitude } = this.state.location.coords
                this._camera.flyTo([longitude, latitude], 2000)
            }
        })
    }

    fetchLocations = (text) => {
        if (text == "") {
            console.debug("Yes it is empty now")
            this.setState({ suggestedLocations: [], searchText: text });
        }
        else {
            this.setState({ searchText: text, isFetching: true })
            axios({
                method: 'get',
                url: `https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?access_token=${this.accessToken}`,
            }).then(response => {
                console.debug(response.data);
                const features = response.data.features;
                // const locations = features.map((value, index) => {
                //     value.name = value.place_name;
                //     return value;
                // })
                this.setState({ suggestedLocations: features, isFetching: false })
            }, error => {
                this.setState({ suggestedLocations: [], isFetching: false })
                console.warn(error)
            })
        }
    }
    moveToLocation(item) {
        this.setState({
            searchText: item.place_name,
            suggestedLocations: [],
            searchedCoordinate: item.geometry.coordinates,
            showMarker: true
        })
        console.debug("Geometry", item.geometry)
        this._camera.flyTo(item.geometry.coordinates, 2000)
    }

    addCircleLayer = () => {
        this.setState((state) => {
            if (state.addCircleMode == false)
                return { addCircleMode: true }
            else
                return { addCircleMode: false, coordinates: [] }
        })
    }

    render() {
        const { mapMode } = this.state;
        console.debug("New state is", this.state.suggestedLocations)
        console.debug("Searched coordinate are", this.state.searchedCoordinate)
        return (
            <View style={{ flex: 1 }}>
                {/* <NavigationEvents
                    onWillFocus={() => {
                        this.setState({ coordinates: [] })
                    }}
                /> */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchSection}>
                        <FontAwesomeIcon style={styles.searchIcon} size={17} color='black' name='search' />
                        <TextInput
                            style={styles.input}
                            placeholder="Search Places"
                            onChangeText={(text) => this.fetchLocations(text)}
                            value={this.state.searchText}
                        />
                    </View>

                    <View style={styles.suggestionContainer} >
                        <FlatList
                            data={this.state.suggestedLocations}
                            renderItem={({ item }) =>
                                <Text onPress={() => this.moveToLocation(item)} style={styles.item}>{item.place_name}</Text>}
                        />
                    </View>
                </View>

                <View style={styles.locationIcon}>
                    <TouchableOpacity onPress={this.addCircleLayer} style={styles.button}>
                        <Text style={styles.buttonText}>
                            {this.state.addCircleMode ? 'Reset' : 'Add Circle'}
                        </Text>
                    </TouchableOpacity>
                    {
                        mapMode == "Street" ?
                            <MaterialIcon onPress={() => this.setState({ mapMode: "Satellite" })} size={30} color='#188038' style={{ margin: 10 }} name='satellite' />
                            : <FontAwesomeIcon onPress={() => this.setState({ mapMode: "Street" })} size={30} color='#188038' style={{ margin: 10 }} name='street-view' />
                    }
                    <MaterialIcon onPress={this.centerMap} color='#188038' style={{ margin: 10 }} size={30} name="gps-fixed" />
                </View>

                <MapboxGL.MapView
                    ref={(c) => (this._map = c)}
                    zoomLevel={10}
                    onPress={this.onPress}
                    showUserLocation={true}
                    styleURL={mapMode == "Street" ? MapboxGL.StyleURL.Street : MapboxGL.StyleURL.Satellite}
                    // onUpdateUserLocation={this.onUpdateUserLocation}
                    style={{ flex: 1 }}>
                    <MapboxGL.Camera
                        ref={(c) => (this._camera = c)}
                        animationMode={'flyTo'}
                        animationDuration={6000}
                        zoomLevel={5}
                        followUserMode='normal'
                    // followZoomLevel={12}
                    // followUserLocation
                    // centerCoordinate={[-25, 74]}
                    />
                    <MapboxGL.UserLocation
                        visible={this.state.visibleCurrentLocation}
                        androidRenderMode='normal'
                        onUpdate={this.onUpdateUserLocation}
                    />
                    {this.renderAnnotations()}
                    <MapboxGL.PointAnnotation
                        id="pointAnnotation1" coordinate={this.state.searchedCoordinate}>
                        <View style={styles.annotationContainer}>
                            <Entypo color="red" size={40} name="location-pin" />
                        </View>
                    </MapboxGL.PointAnnotation>

                </MapboxGL.MapView>
                {this.state.isFetching && <ActivityIndicator style={styles.activityIndicator} size="small" color="black" />}
            </View>
        );
    }
}


const ANNOTATION_SIZE = 50;

const styles = StyleSheet.create({
    annotationContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    annotationFill: {
        width: ANNOTATION_SIZE - 3,
        height: ANNOTATION_SIZE - 3,
        borderRadius: (ANNOTATION_SIZE - 3) / 2,
        backgroundColor: 'orange',
        transform: [{ scale: 0.6 }],
    },
    icon: {
        padding: 20
    },
    locationIcon: {
        display: 'flex',
        flexDirection: 'row',
        position: 'absolute',
        bottom: 10,
        right: 15,
        zIndex: 2
    },
    input: {
        height: 36,
        width: 200,
        paddingVertical: 6,
        paddingHorizontal: 35,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: 'white',
        color: '#000000bf'
    },
    item: {
        padding: 10,
        marginTop: 2,
        width: 200,
        backgroundColor: 'white',
        borderColor: '#bbb',
        borderWidth: 1,
        borderRadius: 5,
    },
    suggestionContainer: {
        minHeight: 0
    },
    searchContainer: {
        position: 'absolute',
        top: 30,
        left: 10,
        zIndex: 3,
    },
    // searchSection: {
    //     display: 'flex',
    //     flexDirection: 'row',
    //     justifyContent: 'center'
    // }
    searchIcon: {
        position: 'absolute',
        top: 9,
        left: 10,
        zIndex: 3,
    },
    activityIndicator: {
        position: 'absolute',
        top: 40,
        left: 180,
        zIndex: 3,
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
});

// const tyles = MapboxGL.StyleSheet.create({
//     circles: {
//         visibility: 'visible',
//         circleRadius: 40,
//         circleColor: '#A9A9A9',
//         circleStrokeColor: '#A9A9A9',
//         circleStrokeWidth: 5,
//         circleOpacity: 0.0
//     },
// });


export default AddLocationPage;