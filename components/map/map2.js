
import {geolocated} from 'react-geolocated';
const fetch = require("isomorphic-fetch");
const { compose, withProps, withHandlers, withStateHandlers } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} = require("react-google-maps");
const { MarkerWithLabel } = require("react-google-maps/lib/components/addons/MarkerWithLabel");
const { InfoBox } = require("react-google-maps/lib/components/addons/InfoBox");
const MyMap = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyD7K54GCHqFa8Yn9C9MDdQFmwgDSgLGGgw&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `600px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  
  withStateHandlers(() => ({
    isOpen: false,
    infoIndex: null
  }), {
  onToggleOpen: ({ isOpen }) => () => ({
    isOpen: !isOpen,
  }),
    showInfo: ({ isOpen,infoIndex }) => (index) => ({
        isOpen: infoIndex !== index || !isOpen,
        infoIndex: index
    })
  }),
  withScriptjs,
  withGoogleMap
)(props =>
  <GoogleMap
    defaultZoom={14}
    defaultCenter={{ lat: props.coords.latitude, lng: props.coords.longitude }}
  >


    {props.reviewlist.map(marker => (
        <Marker
          key={marker._id}
          position={{ lat: marker.position[0].latitude, lng: marker.position[0].longitude }}
            onClick={() => props.showInfo(marker._id)}>
           { (props.isOpen && props.infoIndex === marker._id ) && 
          <InfoWindow  onCloseClick={props.showInfo}>
            <div>
              <div>{marker.title}</div>
            </div>
          </InfoWindow>}
        </Marker>
      ))}

    </GoogleMap>
    
  
);

export class Map extends React.PureComponent {

  constructor(props){
      super(props);
      this.state = {reviewlist: null}
  }


  async componentDidMount() {

    const api = 'http://localhost:3000/review';
    const res = await fetch(api)
    const data = await res.json()
    this.setState({
        reviewlist:data
    })


  }

  


  render() {
    let coords = ''
    this.props.isGeolocationAvailable && this.props.isGeolocationEnabled ? coords = this.props.coords
    : 
    coords = {
            latitude: 48.86,
            longitude: 2.345
        }
    return (
        this.props.coords && 
        <MyMap coords={coords} reviewlist={this.state.reviewlist} />
    )
  }
}


export default geolocated({
    positionOptions: {
      enableHighAccuracy: true,
    },
    userDecisionTimeout: 5000,
  })(Map);