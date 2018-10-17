import React from 'react'
import {withRouter} from 'next/router'

import fetch from 'isomorphic-unfetch'
import ArticleForm from '../components/admin/addPreview'

import Page from '../layouts/main'

const Article = (props) => (

    <Page>
        <ArticleForm title={props.data.title} author={props.data.author} content={props.data.content} />
    </Page>


)


Article.getInitialProps = async function(context){

    const{id} = context.query
    const res = await fetch(`http://localhost:3000/review/${id}`)
    const data = await res.json()

    return {
        data
    }

}


export default Article
