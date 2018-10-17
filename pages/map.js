
import React from 'react' 
import Map from '../components/map/map2.js'
import Page from '../layouts/main'

import {geolocated} from 'react-geolocated'


import {Container} from 'reactstrap'
export default class MapContainer extends React.Component {

    

    constructor(props){
        super(props);
    }
  render(){
      return(
      
            <Page>
            <Container>
                
               <Map />
            </Container>
            </Page>
       
      )
  }
}


