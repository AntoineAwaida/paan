import React from 'react';
import { Collapse,Card,CardBody, CardTitle,CardText, ListGroup, ListGroupItem, Navbar, Nav, Button, Glyphicon, NavbarToggler, NavItem, NavbarBrand, Form, FormGroup, Input } from 'reactstrap';

import MediaQuery from 'react-responsive';

import Link from 'next/link'

import UserInfo from './userinfo'

import Chat from './chat/chat'

import io from "socket.io-client";

const globalstyle = require('../config/globalstyle');



import fetch from 'isomorphic-unfetch'
const imgStyle= {

    marginLeft: 10,
    height: 40

}

const btnStyle = {
    height: 20
}

const searchstyle = {
    right:"15px",
    width: "300px",
    marginTop: "9px",
    borderRadius: "4px",
    display:"block",
    position:"absolute",
    zIndex:"3",
    backgroundColor:"#fef4ff",
    fontSize: "20",
    lineHeight: "16px"
}

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

const listgroupitem = {

    backgroundColor:"#fef4ff"

}

const searchcaret = {
    position: "absolute",
    top: "-10px",
    left: "12px",
    width: "18px",
    height: "10px",
    float: "left",
    overflow: "hidden"
}


const navbar = {
    backgroundColor: '#f2f6fc',
    Color: 'white',
    borderBottom:'4px solid black'
}

const style = {
    marginLeft: 30
}

const search = {
    borderRadius: '30px'
}

const reddot= {
    height:"10px",
    width:"10px",
    borderRadius:"50%",
    backgroundColor:"red",
    position:"absolute",
    zIndex:"10"
}


export default class NavBar extends React.Component {

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.toggleMsg = this.toggleMsg.bind(this);
        this.toggleChatBox = this.toggleChatBox.bind(this);
        this.toggleisNewMsg = this.toggleisNewMsg.bind(this);
        this.onNewMsg = this.onNewMsg.bind(this);
        this.onUserMsg = this.onUserMsg.bind(this);
        this.closeChatBox = this.closeChatBox.bind(this);
        this.state = {
            isOpen: false, isMsgOpen:false, isChatBoxOpen:false, reviewlist:null, selected_reviews:null, newMessage:null, unreadMsg:null, firstRender:true, lastMsgs:null,
            userChat: null
        };

        this.socket = io('localhost:3000');
        this.socket.on('RECEIVE_CHATMESSAGE', function(data){
            addNotification(data);
        });

        const addNotification = (data) => {

            if (this.props.user && data.to == this.props.user._id){

                this.setState({
                    newMessage:data
                })


            }
        }
    }

    
        
    

    async componentDidMount(){





      

        

        let api = 'http://localhost:3000/review';
        let res = await fetch(api)
        let data = await res.json()

        this.setState({
            reviewlist: data
        });




    }

    async retrieveUser(userid){

        let api = 'http://localhost:3000/retrieveuser/' + userid;
        let res = await fetch(api)
        let data = await res.json()

        return data;



    }


    async retrieveMsg(){


        //retrouver les derniers messages de chaque conversation avec un utilisateur
        let api = 'http://localhost:3000/retrievelast/' + this.props.user._id;
        let res = await fetch(api)
        let data = await res.json()

        let conversations = []

        
        
        data.map((conversation) => {

            this.retrieveUser(conversation.from).then((user) => (
                conversation.user = user )).then(
                    conversations.push(conversation)
            
            )
                
            

            

            
        })

       

        
        
        this.setState({
            lastMsgs:conversations
        })

        

        //retrouver les messages non lus, et leur nombre.
        api = 'http://localhost:3000/retrieveunread/' + this.props.user._id;
        res = await fetch(api)
        data = await res.json()

        this.setState({
            unreadMsg:data,
            firstRender:false
        })


    }


   

    filterSearch(review_title,value){

        const TabSpec = {"à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","è":"e","é":"e","ê":"e","ë":"e","ç":"c","ì":"i","í":"i","î":"i","ï":"i","ù":"u","ú":"u","û":"u","ü":"u","ÿ":"y","ñ":"n","-":" ","'":" "}; 
 
        const reg=/[àáäâèéêëçìíîïòóôõöøùúûüÿñ'-]/gi; 
        review_title = review_title.replace(reg,function(){ return TabSpec[arguments[0].toLowerCase()];}).toLowerCase();
        value = value.replace(reg,function(){ return TabSpec[arguments[0].toLowerCase()];}).toLowerCase();
        
        return review_title.match(value) &&
        review_title.match(value)[0].length > 2 && value!='';

    }

    onUserMsg(message){
        this.setState({
            userChat:message.user
        }, () => {
            this.onNewMsg();
        });
       

    }

    onNewMsg() {

        this.toggleChatBox();
        this.toggleMsg();

    }

    handleInputChange(event){

        

        const value=event.target.value;
        let selected_reviews = [];
        this.state.reviewlist.map((review) =>(
            this.filterSearch(review.title,value) &&
            selected_reviews.push(review)
        ))
    
        this.setState({
            selected_reviews:selected_reviews
        })

    }

    toggleisNewMsg(){

            this.retrieveMsg();
            this.setState({
                newMessage: null
             })
      

    }

    closeChatBox(){
        this.toggleChatBox();
        this.setState({
            userChat: null
        })
    }

    toggleChatBox() {
        this.setState({
            isChatBoxOpen: !this.state.isChatBoxOpen,
        })
    }
    
    toggleMsg() {
       
        this.setState({
            isMsgOpen: !this.state.isMsgOpen
        })
       
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    render() {
        this.props.user && this.state.firstRender == true && this.retrieveMsg();
        return (

            <React.Fragment>

            

            {
    
            this.state.isChatBoxOpen && this.props.user &&


            <Chat user={this.props.user} userTo={this.state.userChat} newMsg={this.state.newMessage} toggleNewMsg={this.toggleisNewMsg} closeChatBox={this.closeChatBox} />

            }
                
            <div>
                <Navbar style={navbar} expand="md">
                    <Nav navbar>
                        { this.props.user? 
                        <NavItem style={{display:"flex"}}>
                        <UserInfo user={this.props.user} />
                    </NavItem>

                    :

                    <NavItem>
                        <UserInfo />
                    </NavItem>

                        
                    }
                        
                    </Nav>
                    {/*<NavbarBrand className="mx-auto"  href="/"> 
                        <div style={style}>
                            PAAN
                        </div>
                    </NavbarBrand>
                     <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                    </Collapse>
                    */}
                    <Nav className="ml-auto" navbar>




                        
                        {this.props.user &&

                        <NavItem>
                            { (this.state.newMessage || (this.state.unreadMsg && this.state.unreadMsg.length > 0) ) &&
                            
                            <div style={reddot}></div>

                            }
                            <Button className="rcw-launcher" style={{marginTop:"0px"}} onClick={this.toggleMsg}>
                                <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzRweCIgaGVpZ2h0PSIzMnB4IiB2aWV3Qm94PSIwIDAgMzQgMzIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDQ1LjEgKDQzNTA0KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5pY19idXR0b248L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iRGVza3RvcC1IRCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEyOTkuMDAwMDAwLCAtNzQ4LjAwMDAwMCkiIGZpbGwtcnVsZT0ibm9uemVybyIgZmlsbD0iI0ZGRkZGRiI+CiAgICAgICAgICAgIDxnIGlkPSJHcm91cC0yIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMjg5LjAwMDAwMCwgNzM1LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9ImljX2J1dHRvbiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTAuMjA2OTMzLCAxMy42MDc4MjUpIj4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjUuNzg2NTM5OCw3LjM3MDUxODYzIEMyNS43ODY1Mzk4LDguNDA4MDMxMTggMjUuMDQzMjAyNiw5LjAzOTAxMDkgMjQuNTAwNDE2MSw5LjUwMjA1NjQyIEMyNC4yOTQ4NTE3LDkuNjc3NDQzODggMjMuOTEyMjI3MSw5Ljk5NzQ2MjMgMjMuOTEzMjQ4NCwxMC4xMTY5OTc1IEMyMy45MTY5NjIzLDEwLjU4NTg5MjQgMjMuNTQ1OTQzNiwxMC45NjAzNDc5IDIzLjA4NDM5ODYsMTAuOTYwMzQ3OSBDMjMuMDgyMDc3NSwxMC45NjAzNDc5IDIzLjA3OTc1NjMsMTAuOTYwMzQ3OSAyMy4wNzc0MzUxLDEwLjk2MDM0NzkgQzIyLjYxOTEzOTgsMTAuOTYwMzQ3OSAyMi4yNDU3MDcxLDEwLjU5NzQwMjUgMjIuMjQxOTkzMiwxMC4xMzA4NjYyIEMyMi4yMzQ2NTgyLDkuMjExMjg0OTcgMjIuODk1MDgyNiw4LjY2MDU5Mjg5IDIzLjQyNTc5ODksOC4yMDc4MzA5OCBDMjMuODQyMjIsNy44NTI1Mjc1MSAyNC4xMTUyODQ2LDcuNjAyNTEzMTEgMjQuMTE1Mjg0Niw3LjM3MzcyNjM2IEMyNC4xMTUyODQ2LDYuOTEwNTg2NDkgMjMuNzQ0NDUxNiw2LjUzMzc3MjM1IDIzLjI4ODY2MzIsNi41MzM3NzIzNSBDMjIuODMyNjg5LDYuNTMzNzcyMzUgMjIuNDYxNzYzMiw2LjkxMDU4NjQ5IDIyLjQ2MTc2MzIsNy4zNzM3MjYzNiBDMjIuNDYxNzYzMiw3Ljg0MjcxNTYyIDIyLjA4NzY4MDYsOC4yMjI4MzE4NCAyMS42MjYxMzU2LDguMjIyODMxODQgQzIxLjE2NDU5MDYsOC4yMjI4MzE4NCAyMC43OTA1MDgsNy44NDI3MTU2MiAyMC43OTA1MDgsNy4zNzM3MjYzNiBDMjAuNzkwNTA4LDUuOTc0MjExODMgMjEuOTExMDg0Niw0LjgzNTU2MTM4IDIzLjI4ODQ3NzUsNC44MzU1NjEzOCBDMjQuNjY1OTYzMiw0LjgzNTQ2NzAzIDI1Ljc4NjUzOTgsNS45NzA5MDk3NiAyNS43ODY1Mzk4LDcuMzcwNTE4NjMgWiBNMjMuMTAwNTU0MSwxMS43NDQxNjY2IEMyMi42MzkwMDkxLDExLjc0NDE2NjYgMjIuMjgzNDAzMSwxMi4xMjQyODI4IDIyLjI4MzQwMzEsMTIuNTkzMjcyMSBMMjIuMjgzNDAzMSwxMi41OTk3ODE5IEMyMi4yODM0MDMxLDEzLjA2ODc3MTIgMjIuNjM5MTAyLDEzLjQ0NTY3OTcgMjMuMTAwNTU0MSwxMy40NDU2Nzk3IEMyMy41NjIwMDYzLDEzLjQ0NTY3OTcgMjMuOTM2MTgxNywxMy4wNjIyNjE0IDIzLjkzNjE4MTcsMTIuNTkzMjcyMSBDMjMuOTM2MTgxNywxMi4xMjQyODI4IDIzLjU2MjA5OTEsMTEuNzQ0MTY2NiAyMy4xMDA1NTQxLDExLjc0NDE2NjYgWiBNNi4yNTcxNzk2LDE3LjY1ODk0MTEgQzUuNzk1NjM0NjIsMTcuNjU4OTQxMSA1LjQyMTU1MTk5LDE4LjAzOTA1NzMgNS40MjE1NTE5OSwxOC41MDgwNDY2IEM1LjQyMTU1MTk5LDE4Ljk3NzAzNTggNS43OTU2MzQ2MiwxOS4zNTcxNTIgNi4yNTcxNzk2LDE5LjM1NzE1MiBMNi4zMjY4MTUyNCwxOS4zNTcxNTIgQzYuNzg4MzYwMjMsMTkuMzU3MTUyIDcuMTYyNDQyODYsMTguOTc3MDM1OCA3LjE2MjQ0Mjg2LDE4LjUwODA0NjYgQzcuMTYyNDQyODYsMTguMDM5MDU3MyA2Ljc4ODM2MDIzLDE3LjY1ODk0MTEgNi4zMjY4MTUyNCwxNy42NTg5NDExIEw2LjI1NzE3OTYsMTcuNjU4OTQxMSBaIE05LjE2MTM1Njk3LDE3LjY1ODk0MTEgQzguNjk5ODExOTgsMTcuNjU4OTQxMSA4LjMyNTcyOTM1LDE4LjAzOTA1NzMgOC4zMjU3MjkzNSwxOC41MDgwNDY2IEM4LjMyNTcyOTM1LDE4Ljk3NzAzNTggOC42OTk4MTE5OCwxOS4zNTcxNTIgOS4xNjEzNTY5NywxOS4zNTcxNTIgTDkuMjMwODk5NzUsMTkuMzU3MTUyIEM5LjY5MjQ0NDc0LDE5LjM1NzE1MiAxMC4wNjY1Mjc0LDE4Ljk3NzAzNTggMTAuMDY2NTI3NCwxOC41MDgwNDY2IEMxMC4wNjY1Mjc0LDE4LjAzOTA1NzMgOS42OTI0NDQ3NCwxNy42NTg5NDExIDkuMjMwODk5NzUsMTcuNjU4OTQxMSBMOS4xNjEzNTY5NywxNy42NTg5NDExIFogTTMzLjcwMzY0NzMsNC4wOTY5MzM5NSBMMzMuNzAzNjQ3MywxMy42NTQxODIyIEMzMy43MDM2NDczLDE1LjkxNzA0ODMgMzEuOTE4MDAzOSwxNy43NTMyODYxIDI5LjY5MTA1NjMsMTcuNzUzMjg2MSBMMTguODU0MTczMSwxNy43NTMyODYxIEMxOC42NDIyOTUxLDE3Ljc1MzI4NjEgMTguNDY3ODM0NiwxNy43NTIwNTk2IDE4LjMyMTg3ODMsMTcuNzQ4OTQ2MyBDMTguMTY4OTU4NSwxNy43NDU3Mzg1IDE3Ljk5NjgxOTIsMTcuNzQ0NTEyIDE3LjkyOTY5MDQsMTcuNzUyMDU5NiBDMTcuODU5Nzc2MiwxNy43OTkyMzIyIDE3LjY4ODM3OTcsMTcuOTU4NzY5NyAxNy41MjMyMDQsMTguMTEzNDAxMiBDMTcuNDU3NzQ2NSwxOC4xNzQ2MzExIDE3LjM4MzY1NDIsMTguMjQxOTkzNSAxNy4zMDM3MTI1LDE4LjMxNjE0ODcgTDE0LjIzNzcwMTksMjEuMTU1NzQ2MSBDMTMuOTkzMTQxNSwyMS4zODI0NTczIDEzLjYzMTMxNDgsMjEuNDQxMTM5OSAxMy4zMjg0NDYyLDIxLjMwNTQ3MTcgQzEzLjAyNTU3NzYsMjEuMTY5NzA5MiAxMi44MTI5NTY4LDIwLjg2NDk3NDcgMTIuODEyOTU2OCwyMC41Mjg2MzQ2IEwxMi44MTI5NTY4LDExLjUyNjUxMjYgTDQuMDU5MjkzMjcsMTEuNTI2NTEyNiBDMi43NTM2NzE1NCwxMS41MjY1MTI2IDEuNjcxMjU1MjQsMTIuNjEzNjUwNiAxLjY3MTI1NTI0LDEzLjk0MDE0MjEgTDEuNjcxMjU1MjQsMjMuNDk3MzkwNCBDMS42NzEyNTUyNCwyNC44MjM5NzYyIDIuNzUzNzY0MzksMjUuODY2OTYwNyA0LjA1OTI5MzI3LDI1Ljg2Njk2MDcgTDE2LjE2NDE5NDksMjUuODY2OTYwNyBDMTYuMzcyNjM3NiwyNS44NjY5NjA3IDE2LjU2NzYxNzQsMjUuOTY0MjMwNSAxNi43MjE1NTg2LDI2LjEwNzA2ODkgTDE5LjIxOTQzNTIsMjguNDQ3MjAzNiBMMTkuMjE5NDM1MiwyMC4zNzcwMjIxIEMxOS4yMTk0MzUyLDE5LjkwODAzMjggMTkuNTkzNTE3OCwxOS41Mjc5MTY2IDIwLjA1NTA2MjgsMTkuNTI3OTE2NiBDMjAuNTE2NjA3OCwxOS41Mjc5MTY2IDIwLjg5MDY5MDUsMTkuOTA4MDMyOCAyMC44OTA2OTA1LDIwLjM3NzAyMjEgTDIwLjg5MDY5MDUsMzAuMzcxNzQ4NCBDMjAuODkwNjkwNSwzMC43MDgwODg1IDIwLjcwMTI4MTUsMzEuMDA4Mjk0NCAyMC4zOTgzMjAxLDMxLjE0NDA1NyBDMjAuMjg5OTY3LDMxLjE5MjY0NDcgMjAuMTgxMTQ5OCwzMS4yMTE3OTY3IDIwLjA2NzIyNTksMzEuMjExNzk2NyBDMTkuODYyNTg5OSwzMS4yMTE3OTY3IDE5LjY2MDczOTQsMzEuMTI2NDE0NCAxOS41MDM3MzQzLDMwLjk4MDc0NTcgTDE1Ljg0MDI1LDI3LjU2NTA3NzQgTDQuMDU5MjkzMjcsMjcuNTY1MDc3NCBDMS44MzIyNTI4MiwyNy41NjUwNzc0IDAsMjUuNzYwMjU2NSAwLDIzLjQ5NzI5NiBMMCwxMy45NDAxNDIxIEMwLDExLjY3NzI3NiAxLjgzMjI1MjgyLDkuODI4MzAxNjIgNC4wNTkyOTMyNyw5LjgyODMwMTYyIEwxMi44MTI5NTY4LDkuODI4MzAxNjIgTDEyLjgxMjk1NjgsNC4wOTY5MzM5NSBDMTIuODEyOTU2OCwxLjgzMzk3MzUgMTQuNjU5MjI5NiwwLjAxNjQxNjAzOTMgMTYuODg2MjcwMSwwLjAxNjQxNjAzOTMgTDI5LjY5MTE0OTEsMC4wMTY0MTYwMzkzIEMzMS45MTgwMDM5LDAuMDE2NDE2MDM5MyAzMy43MDM2NDczLDEuODMzOTczNSAzMy43MDM2NDczLDQuMDk2OTMzOTUgWiBNMzIuMDMyMzkyLDQuMDk2OTMzOTUgQzMyLjAzMjM5MiwyLjc3MDM0ODE2IDMwLjk5NjQ5MjMsMS43MTQ2MjcgMjkuNjkxMDU2MywxLjcxNDYyNyBMMTYuODg2MjcwMSwxLjcxNDYyNyBDMTUuNTgwNzQxMiwxLjcxNDYyNyAxNC40ODQyMTIsMi43NzAzNDgxNiAxNC40ODQyMTIsNC4wOTY5MzM5NSBMMTQuNDg0MjEyLDEwLjY4NTMzMjEgTDE0LjQ4NDIxMiwxOC42MDQwODk4IEwxNi4xNjQyODc4LDE3LjA2MTI2NTIgQzE2LjI0MjA5NCwxNi45ODkwOTEyIDE2LjMyOTI3NzgsMTYuOTIzMDQ5NyAxNi4zOTI4Nzg0LDE2Ljg2MzQyMzYgQzE3LjE2MDA3NzQsMTYuMTQ1MDgwMyAxNy4zNTYzNTcsMTYuMDMwMjYyNCAxOC4zNTcwNjc1LDE2LjA1MTIwNyBDMTguNDkzNTUzNCwxNi4wNTQxMzE3IDE4LjY1NjEyOTQsMTYuMDU1MTY5NSAxOC44NTQxNzMxLDE2LjA1NTE2OTUgTDI5LjY5MTA1NjMsMTYuMDU1MTY5NSBDMzAuOTk2NDkyMywxNi4wNTUxNjk1IDMyLjAzMjM5MiwxNC45ODA3NjggMzIuMDMyMzkyLDEzLjY1NDI3NjYgTDMyLjAzMjM5Miw0LjA5NjkzMzk1IFoiIGlkPSJTaGFwZSI+PC9wYXRoPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4="
                                className="rcw-open-launcher"></img>
                            </Button>
                        
                            { this.state.isMsgOpen &&


                                <ListGroup style={searchstyle}>
                                                                
                                                                    
                                                                
                                        
                                            <ListGroupItem style={listgroupitem} action>
                                                <Button onClick={ this.onNewMsg}> Nouveau message </Button>
                                           </ListGroupItem>

                                          

                                           {this.state.lastMsgs && this.state.lastMsgs.map((message) => (
                                                
                                                <ListGroupItem value={message} style={listgroupitem} onClick={() => (this.onUserMsg(message))} key={message.user._id} tag="a"  action>
                                                    
                                                    <strong>
                                                        <img style={globalstyle.profilepicture} src={message.user.photoURL}></img>
                                                        {
                                                            message.user.username
                                                        }
                                                    </strong>
                                                    <br />
                                                    {
                                                        message.message
                                                    }
                                                    
                                                    
                                                    
                                                </ListGroupItem>
                                                
                                                ))}
                                    



                                </ListGroup>
                            
                            
                            }
                            
                            
                        </NavItem>

                        }




                        <NavItem style={{marginTop:"10px"}}>
                            <Form>
                                <Input type="search" autoComplete="off" name="search" style={search} onChange={this.handleInputChange} placeholder="Votre recherche ici" />
                                <ListGroup style={searchstyle}>
                                
                                    
                                    {this.state.selected_reviews && this.state.selected_reviews.map((review) =>(
                                        <Link as ={`/article/${review._id}`} key={review._id} href={`/article?id=${review._id}`}>
                                            <ListGroupItem tag="a" href="#" style={listgroupitem} action>{review.title.substring(0,20)}</ListGroupItem>
                                        </Link>
                                    ))}
                                   
                                    
                                
                                </ListGroup>
                            </Form>
                        </ NavItem>
                        <MediaQuery query="(min-device-width:768px)">
                            <NavItem style={{marginTop:"10px"}}>
                                <img src="/static/facebook.png" style={imgStyle} alt="facebook" />
                            </NavItem>
                        </MediaQuery>
                    </Nav>
                </Navbar>
            </div>
            </React.Fragment>
        );
    }
}





