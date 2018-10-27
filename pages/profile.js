import Page from '../layouts/main'

import React from 'react'

import Router from 'next/router'

import axios from 'axios';


import {Row, Form, FormGroup, Label,Input, Button} from 'reactstrap';
export default class Profile extends React.Component{


    constructor(props){

        super(props);
        this.state = {user:null, profilepicture:null};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }

    handleChange(e){
        this.setState({profilepicture:e.target.files[0]})
    }

    handleSubmit(event){


        event.preventDefault();
        const data = new FormData();
        data.append('profilePicture',this.state.profilepicture);
        data.append('userid',this.state.user._id);
        axios.post('/uploadpp/' + this.state.user._id, data).then((response) => {
            response.status === 500 ?
            console.log("échec de l'envoi.")
            :
            console.log("ok!")
        })
        
        


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
                <img src={this.state.user.photoURL} style={{borderRadius:"50%", height:"50px", width:"50px"}}></img>
                {
                   
                    <h1>{
                        this.state.user.username
                    }</h1>
                }
                </Row>

            <Form onSubmit={this.handleSubmit} encType="multipart/form-data">
                <FormGroup>
                    <Label for="profilePicture">
                        Changer ma photo de profil
                    </Label>
                    <Input type="file" name="file" id="profilePicture" onChange = {this.handleChange} />
                    
                </FormGroup>
                <FormGroup>
                        <Button type="submit" value="Submit" color="danger"> Modifier </Button>
                </FormGroup>


            
            </Form>

            
            
                
            </Page>
            :
            <Page>
            </Page>
            
        )
    }

}


