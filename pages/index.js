

import Head from '../components/head'
import Page from '../layouts/main'
import MediaQuery from 'react-responsive'
import styled from 'styled-components'

import NoSSR from 'react-no-ssr'

import fetch from 'isomorphic-unfetch'
import Link from 'next/link'
import { ListGroup, ListGroupItem, ButtonToolbar, ButtonGroup, Card, CardText, CardHeader, CardBody, Button } from 'reactstrap';


import Article from '../components/admin/addPreview'


import 'react-chat-widget/lib/styles.css';

const articles = {
borderBottom: "4px solid grey",
padding:"10px",
borderRadius: "0px"
}

let Widget = ''
let addResponseMessage= ''



export default class Index extends React.Component {

  constructor(props){

    super(props);
    this.state = {reviewlist:null,appIsMounted:false}

  }



  async componentDidMount(){

    let result = await import('react-chat-widget')
      Widget = result.Widget
      addResponseMessage = result.addResponseMessage
      this.setState({
          appIsMounted: true
      })

      addResponseMessage("Welcome to this awesome chat!");

    

    const api = 'http://localhost:3000/review';
    const res = await fetch(api)
    const data = await res.json()

    this.setState({
        reviewlist: data
    })

}

handleNewUserMessage = (newMessage) => {
  // Now send the message throught the backend API
}

  render(){


    return(

      <Page>
      <div>
        <Head title="Paan" />
        {/** <Card>
          <CardBody>
              <CardHeader>Hello Next.js!</CardHeader>
              <br/>
              <CardText>Bootstrap 4 power!</CardText>
              <Button color="danger">OK</Button>
          </CardBody>
        </Card> **/}
      </div>
      <ListGroup>
        {this.state.reviewlist && this.state.reviewlist.map((review) => (
          <Link as ={`/article/${review._id}`} key={review._id} href={`/article?id=${review._id}`}>
          <ListGroupItem tag="a" href="#" key={review._id} action style={articles}>
            
             <Article title={review.title} content={review.content} author={review.author} />
            
          </ListGroupItem>
          </Link>
        ))}
      </ListGroup>
    </Page>

    )


  }
 
}


