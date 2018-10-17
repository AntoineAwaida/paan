import Page from '../layouts/main'

import React from 'react'

import Router from 'next/router'

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
            <Page>
                {
                    this.state.user && this.state.user.username
                }
            </Page>
            
        )
    }

}


