import React from 'react';
import Page from '../layouts/main'

import fetch from 'isomorphic-unfetch'
 
export default class Community extends React.Component {

  constructor(props) {
    super(props);
  }

  render(){
    return(
      <Page>

      </Page>
    )
  }

}

Community.getInitialProps = async function({req}){

  const api = 'http://localhost:3000/retrieveuser'
  const res = await fetch(api)
  const data = await res.json()

  return {
    user:data
  }

}
