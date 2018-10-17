import React from 'react'
import Page from '../../layouts/main'
import Link from 'next/link'

import {Alert, Button, Row, Container,Form,FormGroup,Label,Input} from 'reactstrap'

export default class Login extends React.Component{


    constructor(props){
        super(props);
        this.state = {
            email:'',
            password:'',
            flashMsg:''
        }
        this.handleSubmit=this.handleSubmit.bind(this);
        this.submitData=this.submitData.bind(this);
        this.handleInputChange=this.handleInputChange.bind(this);
    }

    handleInputChange(event){

        const target = event.target;
        const value = target.value;
        const name = target.name;


        this.setState({
            [name]: value
        })

    }

    handleSubmit(event){

        this.submitData(this.state);
        event.preventDefault();

    }

    submitData(data){
        fetch('/auth/signin', {
            method: 'post',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          }).then((response) =>  { 

            if (response.status === 200){
                response.text().then((text) => {
                    if (text=="connecté.") {
                        window.location = '/'
                    }
                    else {
                        console.log(text)
                        this.setState({flashMsg:text, email:'',password:''})
                    }
                })
            }
           
        }) 
        .catch((error) => {
            console.log('error: ' + error);
          });

    }

    render(){
        return(
            <Page>
                <Row>
                    <h1>Se connecter</h1>
                </Row>

                <Container>

                    {this.state.flashMsg &&

                    <Alert color="danger">
                        {this.state.flashMsg}
                    </Alert>

                    
                    
                    }
                   


                     <Form onSubmit={this.handleSubmit} >
                    <FormGroup>
                        <Label for="email">Adresse mail</Label>
                        <Input type="email" invalid={this.state.invalidMail} value={this.state.email} name="email" id="email" onChange={this.handleInputChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Mot de passe</Label>
                        <Input type="password" invalid={this.state.invalidPassword} value={this.state.password} name="password" id="password" onChange={this.handleInputChange} />
                    </FormGroup>
                    <FormGroup>
                        <Button type="submit" value="Submit" color="success"> Se connecter </Button>
                    </FormGroup>
                    </Form>

                     <Row>
                    <Link href="/auth/google">
                    <Button color="danger">Login avec Google</Button>
                    </Link>
                    </Row>
                    <br />
                    <Row>
                    <Link href="/auth/facebook">
                    <Button color="primary"> Login avec Facebook
                    </Button></Link>

                    </Row>


                </Container>
               

                
            </Page>
        )
    }

}