import Page from '../layouts/main'

import React from 'react'

import Router from 'next/router'

import axios from 'axios';


import {Alert, Row, Form, FormGroup, Label,Input, Button} from 'reactstrap';
export default class Profile extends React.Component{


    constructor(props){

        super(props);
        this.state = {user:null, profilepicture:null, submitErrorMsg:null, isSubmitted:null, newName: null, newPassword:null};
        this.handlePictureSubmit = this.handlePictureSubmit.bind(this);
        this.handlePictureChange = this.handlePictureChange.bind(this);
        this.handleNameSubmit = this.handleNameSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }


    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;


        this.setState({
            [name]: value
        })

        


    }

    handlePasswordSubmit(event){

    
        event.preventDefault();

        const data = {name: this.state.newPassword}

        // à changer
        if (this.state.newPassword.length > 3){

            axios('/newpassword/' + this.state.user._id, {
                method: 'put',
                headers: {
                  'Accept': 'application/json, text/plain, */*',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
              }).then((response) => {
                  this.setState({
                      isSubmitted: response.data,
                      newPassword:null
                  })
              })


        }
        
        

    }

    handleNameSubmit(event){

    
        event.preventDefault();

        const data = {name: this.state.newName}

        // à changer
        if (this.state.newName.length > 3){

            axios('/newname/' + this.state.user._id, {
                method: 'put',
                headers: {
                  'Accept': 'application/json, text/plain, */*',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
              }).then((response) => {
                  this.setState({
                      isSubmitted: response.data,
                      newName:null
                  })
              })


        }
        
        

    }

    handlePictureChange(e){
        this.setState({profilepicture:e.target.files[0]})
    }

    handlePictureSubmit(event){

        this.setState({
            isSubmitted:null,
            submitErrorMsg:null
        })


        event.preventDefault();
        const data = new FormData();
    
        data.append('profilePicture',this.state.profilepicture);
        data.append('userid',this.state.user._id);
        this.state.profilepicture && axios.post('/uploadpp/' + this.state.user._id, data).then((response) => {
            this.setState({
                isSubmitted: response.data
            })
        })
        .catch(error => {
            this.setState({
                submitErrorMsg: error.response.data
            })
        });

        this.setState({
            profilepicture:null
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

        
            <Form onSubmit={this.handleNameSubmit}>
                <FormGroup>
                        <Label for="name">
                            Changer mon nom d'utilisateur
                        </Label>
                        <Input type="text" name="newName" id="newName" onChange={this.handleChange} />
                        
                </FormGroup>
                <FormGroup>
                        <Button type="submit" value="Submit" color="danger"> Modifier </Button>
                </FormGroup>
            
            </Form>

            <Form onSubmit={this.handlePasswordSubmit}>
                <FormGroup>
                        <Label for="password">
                            Changer mon mot de passe
                        </Label>
                        <Input type="text" name="newPassword" id="newPassword" onChange={this.handleChange} />
                        
                </FormGroup>
                <FormGroup>
                        <Button type="submit" value="Submit" color="danger"> Modifier </Button>
                </FormGroup>
            
            </Form>

            <Form onSubmit={this.handlePictureSubmit} encType="multipart/form-data">
                
                <FormGroup>
                    <Label for="profilePicture">
                        Changer ma photo de profil
                    </Label>
                    <Input type="file" name="file" id="profilePicture" onChange = {this.handlePictureChange} />
                    
                </FormGroup>
                <FormGroup>
                        <Button type="submit" value="Submit" color="danger"> Modifier </Button>
                </FormGroup>


            
            </Form>

            <Alert isOpen={this.state.isSubmitted? true : false} color="success">
            
            {
                this.state.isSubmitted
            }
            
            </Alert>


            
            <Alert isOpen={this.state.submitErrorMsg ? true : false} color="danger">
            
            {
                this.state.submitErrorMsg
            }
            
            </Alert>
           

            
            
                
            </Page>
            :
            <Page>
            </Page>
            
        )
    }

}


