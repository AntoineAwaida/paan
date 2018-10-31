import React from 'react'

import {Form, FormGroup,Alert, Input, Button, ListGroup, ListGroupItem} from 'reactstrap'
import axios from 'axios';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faStar} from '@fortawesome/free-solid-svg-icons'

import styled from 'styled-components'



const globals = require('../../config/globals')

const Starstyle = styled.div`

    color: ${props => props.followed ? "orange": "grey"};
    float: right;
    cursor: pointer;

    :hover {
        color: orange;
    }


`;





export default class Commentaires extends React.Component {

    constructor(props){

        super(props);
        this.state = {mycommentary:'',user:null,commentarylist:null, submitted:null, submitError:null}

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.followUser = this.followUser.bind(this);

    }

    async retrieveUser(userid){

        let api = 'http://localhost:3000/retrieveuser/' + userid;
        let res = await fetch(api)
        let data = await res.json()

        return data;



    }

    async followed(commentaryuser, me){

        let api = globals.domain + 'isfollowed/' + me + '/' + commentaryuser;
        let res = await fetch(api);
        let data = await res.json();

        console.log(data)

        if (data){
            return true;
        }
        return false;

    }


    async componentDidMount(){

    
        let api = 'http://localhost:3000/retrievecommentaries/' + this.props.article;
        let res = await fetch(api)
        let data = await res.json()


        
        let user = null;
        let followed = false;

        let commentaires=[]


       await Promise.all(data.map(async (commentaire) => {

            user = await this.retrieveUser(commentaire.user)
            commentaire.completeuser = user
            commentaires.push(commentaire)
        

        }));

        //Pour une raison que j'ignore, map réordonne ici les commentaires.

        commentaires.sort((a,b) => (a.date > b.date) ? -1 : ((b.date > a.date) ? 1 : 0));


        this.setState({
            commentarylist: commentaires
        })


    
        
    

    }


    async componentDidUpdate(){

        let api = 'http://localhost:3000/retrievecommentaries/' + this.props.article;
        let res = await fetch(api)
        let data = await res.json()

        if(data.length != this.state.commentarylist.length){

            let user = null;

            let commentaires=[]
    
    
           await Promise.all(data.map(async (commentaire) => {
    
                user = await this.retrieveUser(commentaire.user)
                commentaire.completeuser = user
                commentaires.push(commentaire)
            
    
            }));

            commentaires.sort((a,b) => (a.date > b.date) ? -1 : ((b.date > a.date) ? 1 : 0));
    
            this.setState({
                commentarylist: commentaires
            })


        }

        
       
            

    }

    followUser(userid){

        let data = {follower: this.props.user._id, following: userid}
        axios.post('/follow', data).
        then( (response) => {
            this.setState({
                submitted:response.data
            })
        })
        .catch(error => {
            this.setState({
                submitError:error.response.data
            })
        })


    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;


        this.setState({
            [name]: value,
            submitted:false,
            submitError:false,
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
           this.setState({
               mycommentary:'',
               submitted:response.data
           })
        })
        .catch(error => {
            this.setState({
                submitError:error.response.data
            })
        })

        e.preventDefault();

    }


    render(){
        return(
           
            <React.Fragment>
                {
                    this.state.commentarylist && this.state.commentarylist.length != 0 &&
                    <React.Fragment>
                        <h1>Commentaires</h1>
                
                        <ListGroup>
                            {this.state.commentarylist.map((commentaire) => (
                                commentaire.completeuser && 
                                <ListGroupItem key={commentaire._id}>
                                    <h3><img src={commentaire.completeuser.photoURL} style={globals.profilepicture}></img>
                                    &nbsp;
                                        {
                                            commentaire.completeuser.username
                                        }
                                
                                    {
                                        //il faut qu'on soit connecté, et qu'on soit pas l'auteur du commentaire, pour pouvoir s'abonner...
                                        (this.props.user && this.props.user._id != commentaire.completeuser._id) ?
                                            //l'utilisateur est-il déjà abonné à ce gars?
                                            this.props.user.following.includes(commentaire.completeuser._id) ?
                                            <Starstyle followed>
                                            <FontAwesomeIcon icon={faStar} />
                                            </Starstyle>
                                            
                                            :
                                            <Starstyle>
                                             <FontAwesomeIcon icon={faStar} onClick={() => this.followUser(commentaire.completeuser._id)} />
                                            </Starstyle> 
                                           
                                        : ''
                                    }
                                    
                                    </h3>
                                    
                                    {
                                        commentaire.content
                                    }
                                </ListGroupItem>
                            

                            ))
                        }
                        </ListGroup>
                    </React.Fragment>


                }
                
                {
                    this.props.user &&

                    <React.Fragment>
                    <h3>Ecrire un commentaire...</h3>
                    <Form onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <Input type="textarea" value={this.state.mycommentary} name="mycommentary" id="mycommentary" placeholder="Mon commentaire..." onChange={this.handleChange}></Input>
                        </FormGroup>
                        
                        <FormGroup>
                            <Button type="submit" value="Submit" color="danger">Ajouter un commentaire</Button>
                        </FormGroup>
                    </Form>

                    <Alert isOpen={this.state.submitted? true : false} color="success">
                
                    {
                        this.state.submitted
                    }
                    
                    </Alert>


                    
                    <Alert isOpen={this.state.submitError ? true : false} color="danger">
                    
                    {
                        this.state.submitError
                    }
                    
                    </Alert>
                    Note:pas vulnérable aux failles XSS grâce à react..
                    </React.Fragment>

                    

               
                }
                
                
            </React.Fragment>
            
        )
    }



}