import React from 'react'
import {withRouter} from 'next/router'

import fetch from 'isomorphic-unfetch'
import ArticleForm from '../components/admin/addPreview'

import Page from '../layouts/main'

import Commentaires from '../components/articles/commentaires'

export default class Article extends React.Component {

    constructor(props){
        super(props);
        this.state = {user:null};
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
            
            <Page>
                <ArticleForm title={this.props.data.title} author={this.props.data.author} content={this.props.data.content} />
                {
                
                this.state.user &&
                <Commentaires article={this.props.data._id} user={this.state.user} />
            
                }
            </Page>

        )


    }



}




Article.getInitialProps = async function(context){


    
    const{id} = context.query
    const res = await fetch(`http://localhost:3000/review/${id}`)
    const data = await res.json()

    return {
        data
    }

}
