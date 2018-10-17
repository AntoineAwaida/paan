import React from 'react'

import Page from '../../layouts/main'

import {Form, FormGroup, FormFeedback, Label, Input, Button} from 'reactstrap'


function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validatePassword(password){
    var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
    return re.test(String(password));
}

export default class Local extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            username:'',
            mail:'',
            password:'',
            passwordconf:'',
            invalidMail:false,
            invalidPassword:false,
            passwordnotMatch:false
        };
        this.handleSubmit=this.handleSubmit.bind(this)
        this.handleInputChange=this.handleInputChange.bind(this);
        this.formValidation=this.formValidation.bind(this);
        this.submitData=this.submitData.bind(this);
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

        this.setState({
            invalidMail:false,
            invalidPassword:false,
            passwordnotMatch:false
        })

        this.formValidation(this.state) == true ? 
            this.submitData(this.state)
        : ''
        event.preventDefault();

    }

    submitData(data){

        fetch('/auth/signup', {
            method: 'post',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })

       

    }

    formValidation(data){


        if (validatePassword(data.password) && data.password === data.passwordconf && validateEmail(data.mail)){

            return true;

        }

        else {

            if (!validatePassword(data.password)) {

                this.setState({
                    invalidPassword:true
                })

            }

            if (!(data.password === data.passwordconf)){

                this.setState({
                    passwordnotMatch:true
                })

            }

            if(!validateEmail(data.mail)){
                this.setState({
                    invalidMail:true
                })
            }


            return false;

        }

       


    }





    render(){

       
        return(
            <Page>
                <Form onSubmit={this.handleSubmit} >
                    <FormGroup>
                        <Label for="username">Nom d'utilisateur</Label>
                        <Input type="username" value={this.state.username} name="username" id="username" onChange={this.handleInputChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="mail">Adresse mail</Label>
                        <Input type="mail" invalid={this.state.invalidMail} value={this.state.mail} name="mail" id="mail" onChange={this.handleInputChange} />
                        <FormFeedback tooltip> Adresse mail invalide. </FormFeedback>
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Mot de passe</Label>
                        <Input type="password" invalid={this.state.invalidPassword} value={this.state.password} name="password" id="password" onChange={this.handleInputChange} />
                        <FormFeedback tooltip>Mot de passe incorrect. Il doit contenir au moins 8 caractères, des caractères majuscules et minuscules, des chiffres et des lettres.</FormFeedback>
                    </FormGroup>
                    <FormGroup>
                        <Label for="passwordconf">Répétez le mot de passe</Label>
                        <Input type="password" invalid={this.state.passwordnotMatch} value={this.state.passwordconf} name="passwordconf" id="passwordconf" onChange={this.handleInputChange} />
                        <FormFeedback tooltip>Les mots de passe ne correspondent pas.</FormFeedback>
                    </FormGroup>
                    <FormGroup>
                        <Button type="submit" value="Submit" color="success"> S'inscrire </Button>
                    </FormGroup>
                </Form>
            </Page>
        )
    }

}