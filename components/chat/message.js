import React from 'react';


const right = {
    textAlign:"right"
}

const left = {
    textAlign:"left"
}


export default class Message extends React.Component {


    constructor(props){
        super(props);
    }

    render(){
        return(
    
            <div style={this.props.fromMe? right: left}>
            
             {this.props.message}
            </div>
                
    
        )
    }

}