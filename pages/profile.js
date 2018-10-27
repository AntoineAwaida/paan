import Page from '../layouts/main'

import React from 'react'

import Router from 'next/router'


import {Row} from 'reactstrap';
export default class Profile extends React.Component{


    constructor(props){

        super(props);
        this.state = {user:null};

    }


    async componentDidMount(){

        
    const api = 'http://localhost:3000/retrieveuser'
    const res = await fetch(api)

    if (res.status === 204){

        Router.push('/auth/login')

    }

    if (res.status === 200){



      const data = await res.json()
      this.setState({
        user:data
      })
    }
    
    }

    render(){
        return(
            this.state.user?
            <Page>
                <Row style={{justifyContent:"center"}}>
                <img src={this.state.user.photoURL} style={{borderRadius:"50%"}}></img>
                {
                   
                    <h1>{
                        this.state.user.username
                    }</h1>
                }
                </Row>

            Changer ma photo de profil
                
            </Page>
            :
            <Page>
            </Page>
            
        )
    }

}


