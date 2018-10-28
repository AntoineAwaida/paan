import React from 'react'

import {Form, FormGroup, Input, Button, ListGroup, ListGroupItem} from 'reactstrap'
import axios from 'axios';


export default class Commentaires extends React.Component {

    constructor(props){

        super(props);
        this.state = {mycommentary:null,user:null,commentarylist:null}

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }


    async componentDidMount(){

        const api = 'http://localhost:3000/retrievecommentaries/' + this.props.article;
        const res = await fetch(api)
        const data = await res.json()
    
        this.setState({
            commentarylist: data
        })
    

    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;


        this.setState({
            [name]: value,
        })

        


    }

    handleSubmit(e){


        const commentaire = {

            article: this.props.article,
            user: this.props.user._id,
            content: this.state.mycommentary

        }

        axios.post('/addcommentary',commentaire)
        .then( (response) => {
           console.log(response);
           this.setState({
               mycommentary:null
           })
        })
        .catch(error => {
            console.log(error);
        })

        e.preventDefault();

    }


    render(){
        return(
            <React.Fragment>
                <h1>Commentaires</h1>
                <ListGroup>
                    {this.state.commentarylist && this.state.commentarylist.map((commentaire) => (
                        <ListGroupItem key={commentaire._id}>
                            <h3>test</h3>
                            {
                                 commentaire.content
                            }
                        </ListGroupItem>
                       

                    ))
                }
                </ListGroup>
                <h3>Ecrire un commentaire...</h3>
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Input type="textarea" name="mycommentary" id="mycommentary" placeholder="Mon commentaire..." onChange={this.handleChange}></Input>
                    </FormGroup>
                    
                    <FormGroup>
                        <Button type="submit" value="Submit" color="danger">Ajouter un commentaire</Button>
                    </FormGroup>
                </Form>

                ATTENTION JE SUIS VULNERABLE AUX FAILLES XSS ICI!!
                
            </React.Fragment>
            
        )
    }



}