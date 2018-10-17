import React from 'react'

import {Card, Button,Col} from 'reactstrap'

import Link from 'next/link'

export default class UserInfo extends React.Component {

render() {


    return(

        this.props.user? 

            
            <React.Fragment>
            <Col>
            <Link href={`/profile/`}>
                <img style={{borderRadius:"50px", marginTop:"8px", cursor:"pointer"}} src={this.props.user.photoURL}/>
            </Link>
            </Col>
            <Col>
            <Card>
            <Button className="btn-sm">{this.props.user.username}</Button>
            </Card>
            <Card>
            <Button className="btn-sm">
                <Link href='/auth/logout'>
                    <a> Se déconnecter </a>
                </Link>
            </Button>
            </Card>
            
            
            </Col>
            </React.Fragment>
            
            
        :
            <React.Fragment>
                <Card>
            <Button className="btn-sm">
                <Link href='/auth/local'>
                    <a> S'inscrire </a>
                </Link>
            </Button>
            </Card>
            <Card>
                <Button className="btn-sm">
                    <Link href='/auth/login'>
                        <a> Se connecter </a>
                    </Link>
                </Button>
            </Card>
            </React.Fragment>
            


    )



}
    


}

