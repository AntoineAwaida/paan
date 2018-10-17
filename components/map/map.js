import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import React from 'react' 

import {geolocated} from 'react-geolocated';

import Page from '../../layouts/main'


const style = {
  width: '800px',
  height: '600px',
  'marginLeft': 'auto',
  'marginRight': 'auto',
  'marginTop': '30px',
  'borderRadius': '30px'
}




export class MapContainer extends React.Component {

  constructor(props) {
    super(props);
  }

  
  render() {
    const points = [
      { lat: 49, lng: 2.2 },
      { lat: 49, lng: 2.4 },
      { lat: 48.5, lng: 2.2 },
      { lat: 48.5, lng: 2.4 }
    ]
    const bounds = new this.props.google.maps.LatLngBounds();
    for (var i = 0; i < points.length; i++) {
    bounds.extend(points[i]);
    }
    let coords = null;

    this.props.coords ? coords = this.props.coords : coords = {latitude: 48.853, longitude: 2.35}
    return (

         
      
        <Map coords={coords} xs={5} style = {style} google={this.props.google} zoom={14}
      initialCenter={{
        lat: coords.latitude,
        lng: coords.longitude 
      }}>
 
        <Marker icon={{url:'../../static/facebook.png', scaledSize: new google.maps.Size(64,64)}} onClick={this.onMarkerClick} 
                />
 
        <InfoWindow onClose={this.onInfoWindowClose}>
            <div>
              <h1></h1>
            </div>
        </InfoWindow>
      </Map>
   
    );

  }
}

/**export default GoogleApiWrapper(({
  apiKey: "AIzaSyD7K54GCHqFa8Yn9C9MDdQFmwgDSgLGGgw"
}))(geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(MapContainer))**/


export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(GoogleApiWrapper(({
    apiKey: "AIzaSyD7K54GCHqFa8Yn9C9MDdQFmwgDSgLGGgw"
  }))(MapContainer))
 

