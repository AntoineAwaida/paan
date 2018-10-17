import NavBar from '../components/navbar'
import { Container, Row, Col } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import SideBar from '../components/sidebar'
import lifecycle from 'react-pure-lifecycle';
import React from 'react'

const styleSidebar = {
  flex: "0 0 25%",
  maxWidth: "25%",
  minHeight: "100%",
  height: "100%",
  width: "100%",
  position: "absolute",
  top: "85px",
  left: "0",
  display: "inline-block",
  padding:"0"
}

  

//pb: cette page est re construite à chaque fois => user revient à null...



export default class Main extends React.Component {

  constructor(props){
    super(props);
    this.state = {user:null}
  }

  async componentDidMount(){

    const api = 'http://localhost:3000/retrieveuser'
    const res = await fetch(api)
    if (res.status === 200){


      const data = await res.json()
      this.setState({
        user:data
      })
    }
    

    this.setState({
      ready:true
    })
    


}

  render(){

    return(

      <div>
    <NavBar user={this.state.user}/>
    
      <Col xs="3" style={styleSidebar}>
      <SideBar/>
      </Col>
      <Col sm="12" md={{ size: 8, offset: 3 }}>

      {this.props.children}
      </Col>
    </div>
    )

  }
  
}
