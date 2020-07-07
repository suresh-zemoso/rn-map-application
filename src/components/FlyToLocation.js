import React from 'react'
import { View } from 'react-native'
import MapboxGL from '@react-native-mapbox-gl/maps';
import MarkIcon from '../assets/mapbox-icon.svg';


export default FlyToLocation = (props) => {

    const { coordinate } = props.route.params;
    MapboxGL.setAccessToken('pk.eyJ1Ijoic3VyZXNoLXplbW9zbyIsImEiOiJjazkweng5cXowNmd0M2Zyb2I0YjllMWFoIn0.uCF7DOpC6m3gvu3n2uoQ8A');
    console.debug(coordinate)
    return (
        <View style={{ flex: 1 }}>
            <MapboxGL.MapView
                // onRegionDidChange={this.onRegionDidChange}
                // ref={(c) => (this._map = c)}
                // onPress={this.onPress}
                style={{ flex: 1 }}>
                <MapboxGL.Camera
                    centerCoordinate={[coordinate.lng, coordinate.lat]}
                    zoomLevel={8}
                    animationMode={'flyTo'}
                    animationDuration={6000}
                />
                <MapboxGL.PointAnnotation
                    // key={id}
                    id='11'
                    coordinate={[coordinate.lng, coordinate.lat]}
                // title={title}
                // ref={(ref) => (this.annotationRef = ref)}
                >
                    <View >
                        <MarkIcon width={80} height={40} />
                    </View>
                </MapboxGL.PointAnnotation>
            </MapboxGL.MapView>
        </View>
    )
}
