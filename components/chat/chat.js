import React from 'react';
import {Card, CardTitle,CardSubtitle, CardBody,CardText, Form, Input,ListGroup, ListGroupItem, Button} from 'reactstrap';
import Message from './message';


import {FaWindowClose} from 'react-icons/fa';

import io from "socket.io-client";


const card = {
    position:"fixed",
    bottom:"0",
    right:"30px",
    zIndex:"100",
    width:"400px",
    height:"400px",
    marginRight:"10px",
    marginBottom:"20px",

}

const cardBody= {
    overflowY:"scroll",
}

const chatinput = {
    bottom: "0",
    width:"380px",
}


export default class Chat extends React.Component {


    constructor(props){
        super(props);
        this.textChangeHandler = this.textChangeHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.userChangeHandler = this.userChangeHandler.bind(this);
        this.userSelectedHandler = this.userSelectedHandler.bind(this);
        this.markConversationAsRead = this.markConversationAsRead.bind(this);
        
        this.state = {
            chatInput:'', messages:[], userlist:null,userlist_selected:null,user_selected:null,ready:false
        }
        if(this.props.userTo){
            this.state.user_selected = this.props.userTo
        }
        this.socket = io('localhost:3000');
      
    }


    userChangeHandler(event){
        const value=event.target.value;
        let userlist_selected = [];
        this.state.userlist.map((user) =>(
            this.filterSearch(user.username,value) &&
            userlist_selected.push(user)
        ))
    
        this.setState({
            userlist_selected:userlist_selected
        })
    }

    filterSearch(user_search,value){

        const TabSpec = {"à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","è":"e","é":"e","ê":"e","ë":"e","ç":"c","ì":"i","í":"i","î":"i","ï":"i","ù":"u","ú":"u","û":"u","ü":"u","ÿ":"y","ñ":"n","-":" ","'":" "}; 
 
        const reg=/[àáäâèéêëçìíîïòóôõöøùúûüÿñ'-]/gi; 
        user_search = user_search.replace(reg,function(){ return TabSpec[arguments[0].toLowerCase()];}).toLowerCase();
        value = value.replace(reg,function(){ return TabSpec[arguments[0].toLowerCase()];}).toLowerCase();
        
        return user_search.match(value) &&
        user_search.match(value)[0].length > 1 && value!='';

    }

   static getDerivedStateFromProps(props,state){

        if (props.newMsg){

            const newMsg = {fromMe:false,content:props.newMsg.content}
            props.toggleNewMsg();
            return({
                messages: [...state.messages, newMsg]
            })
        }

        return null;


    }

    async componentDidMount(){


        let api =''

        this.state.user_selected?

            
            this.retrieveConversation(this.state.user_selected)


    
        :
            api = 'http://localhost:3000/retrieveusers';
            let res = await fetch(api)
            let data = await res.json()

            this.setState({
                userlist: data
            });

    



    }

    async markConversationAsRead(){

        fetch('/markconversationasread/'+this.state.user_selected._id+ '/' +this.props.user._id,{
            method: 'put',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({read:true})
        })
        this.props.toggleNewMsg();        


    }

 

    async retrieveConversation(user_to){

        

        let api = '';
        let res = '';

        this.setState({
            messages:[]
        })

        


        //2 manières d'écrire les requêtes:

        // 1. avec le mot clé then


        //ici messages envoyés par l'utilisateur

        /*

            api = `http://localhost:3000/getconversationfrom/${this.props.user._id}/${user_to._id}`;
            fetch(api).then(
                (response) => {
                    return response.json();
                }

            ).then((jsonData) => {

                console.log(jsonData)
                jsonData.map((message) => {

                let chatmessage = {fromMe:true,content:message.content,date:message.date}
            
                   this.setState({
                       messages: [...this.state.messages, chatmessage]
                   })

                })
    
            })
           

        */

        



            
        
        // 2. avec le mot clé await

        //ici messages reçus par l'utilisateur

            api = `http://localhost:3000/getconversationfrom/${user_to._id}/${this.props.user._id}`;
            res = await fetch(api)
            const data = await res.json()



            data.map((message) => {

                let fromMe=false;

                if (message.from == this.props.user._id){

                    fromMe=true;

                }

                 let chatmessage = {fromMe:fromMe,content:message.content}
            
                   this.setState({
                       messages: [...this.state.messages, chatmessage]
                   })
            })
            


            
    
    }


    userSelectedHandler(user){


        this.setState({
            user_selected:user
        }) 
        this.retrieveConversation(user);



    }


    textChangeHandler(event)  {
        this.setState({ chatInput: event.target.value });
      }

    //submitting the message
    submitHandler(event) {
        // Stop the form from refreshing the page on submit
        event.preventDefault();


        const message = {
            from:this.props.user._id,
            to:this.state.user_selected._id,
            content:this.state.chatInput
        }


        fetch('/addmessage', {
            method: 'post',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
          })

        this.socket.emit('SEND_CHATMESSAGE',{
            from:this.props.user._id,
            to: this.state.user_selected._id,
            content: this.state.chatInput
        })

        this.state.messages.push({fromMe:true, content:this.state.chatInput})



        // Clear the input box
        this.setState({ chatInput: '' });
        
      }

      



    render(){

        
        return(
            <Card style={card}>
             <FaWindowClose onClick={this.props.closeChatBox} style={{float:"right"}} />
            <CardTitle>
            { !this.state.user_selected ?


                <React.Fragment>

                <Form>

                <Input type="search" name="search" autoComplete="off"  onChange={this.userChangeHandler} 
                value={this.state.userInput}
                placeholder="A qui écrivez-vous?" />

                </Form>

                <ListGroup>

                    {this.state.userlist_selected && this.state.userlist_selected.map(user =>(
                
                        <ListGroupItem key={user._id} >
                            <Button value={user} onClick={() => this.userSelectedHandler(user)}>
                            
                            
                        {user.photoURL && <img src={user.photoURL} style={{borderRadius:"30px"}} />}
                        {user.username}
                            </Button>
                        </ListGroupItem>
                            
                    ))}

                </ListGroup>

                </React.Fragment>


                : 


                (
                this.state.user_selected.photoURL?

                <React.Fragment>
                    {
                    <img src={this.state.user_selected.photoURL} style={{borderRadius:"30px"}} />
                  
                
                    }
                    {this.state.user_selected.username}


                </React.Fragment>

                

                :
                <React.Fragment>
                     {this.state.user_selected.username}

                </React.Fragment>
               
                )

                }
               
               
               
            </CardTitle>

            { this.state.user_selected &&

            <React.Fragment>
            <CardBody style = {cardBody}>
        

                    {
                    
                        this.state.messages.length != 0 &&

                        this.state.messages.map((message,i) => (
                        
                        <Message key={i} fromMe={message.fromMe} message={message.content} />
                    ))
                    }
            
            </CardBody>


            <div id="chatinput" style={chatinput}>
                <Form className="chat-input" onSubmit={this.submitHandler}>
                <Input type="text" onClick={this.markConversationAsRead}
                onChange={this.textChangeHandler}
                value={this.state.chatInput}
                placeholder="Write a message..."
                required />
                </Form>
            </div>


           

            

            </React.Fragment>

            }

            </Card>

        


           
        )
    }


}