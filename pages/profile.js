import Page from '../layouts/main'

import React from 'react'

import Router from 'next/router'

import axios from 'axios';


import {Alert, Row, Form, FormGroup, Label,Input, Button, FormFeedback, ListGroupItem, ListGroup} from 'reactstrap';


function validatePassword(password){
    var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
    return re.test(String(password));
}
export default class Profile extends React.Component{


    constructor(props){

        super(props);
        this.state = {user:null, profilepicture:null, submitErrorMsg:null, isSubmitted:null, newName: null, newPassword:null,
            newPasswordConf:null,  
            passwordnotMatch:false,
            invalidPassword:false};
        this.handlePictureSubmit = this.handlePictureSubmit.bind(this);
        this.handlePictureChange = this.handlePictureChange.bind(this);
        this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);
        this.handleNameSubmit = this.handleNameSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }

    


    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;


        this.setState({
            [name]: value,
            invalidPassword:false,
            passwordnotMatch:false
        })

        


    }

    formPasswordValidation(data){

        if (validatePassword(data.newPassword) && data.newPassword === data.newPasswordConf){

            return true;

        }

        else {

            if (!validatePassword(data.newPassword)) {

                this.setState({
                    invalidPassword:true
                })

            }

            if (!(data.newPassword === data.newPasswordConf)){

                this.setState({
                    passwordnotMatch:true
                })

            }

            return false;

        }

    }

    handlePasswordSubmit(event){

    
        event.preventDefault();

        const data = {name: this.state.newPassword}

     

        
        if (this.formPasswordValidation(this.state) ==true){

            axios.put('/newpassword/' + this.state.user._id, data)
            .then( (response) => {
                this.setState({
                    isSubmitted: response.data,
                    newPassword:null
                })
            })
            .catch(error => {
                this.setState({
                    submitErrorMsg: error.response.data
                })
            })


        }
        
        
        

    }

    handleNameSubmit(event){

    
        event.preventDefault();

        const data = {name: this.state.newName}


        // à changer
        if (this.state.newName.length > 3){


            axios.put('/newname/' + this.state.user._id, data)
            .then( (response) => {
                this.setState({
                    isSubmitted: response.data,
                    newName:null
                })
            })
            .catch(error => {
                this.setState({
                    submitErrorMsg: error.response.data
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
                        <Input type="password" invalid={this.state.invalidPassword} name="newPassword" id="newPassword" onChange={this.handleChange} />
                        <FormFeedback tooltip>Mot de passe incorrect. Il doit contenir au moins 8 caractères, des caractères majuscules et minuscules, des chiffres et des lettres.</FormFeedback>
                        
                </FormGroup>
                <FormGroup>
                        <Label for="passwordconf">Répétez le mot de passe</Label>
                        <Input type="password" invalid={this.state.passwordnotMatch} name="newPasswordConf" id="newPasswordConf" onChange={this.handleChange} />
                        <FormFeedback tooltip>Les mots de passe ne correspondent pas.</FormFeedback>
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

            <h1>Mes abonnements</h1> 
            

            <ListGroup>
                {
                    this.state.user.following.map((user_followed) => {
                        <ListGroupItem>
                            {user_followed}
                        </ListGroupItem>
                    })
                }
            </ListGroup>




            
            
                
            </Page>
            :
            <Page>
                Retrieving data... (loading spin après)
            </Page>
            
        )
    }

}


