
import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'

const wrapper = {

    height: "100%",
    borderRight:"4px solid black"

}

const nav = {
    position: "relative",
    top: "0",
    margin: "0",
    padding: "0",
    listStyle: "none"
}

const LiStyle = styled.li`
    line-height: 80px;
    border-bottom: 1px solid grey;
    background: ${props => props.selected? '#f7f8f9': '#ffffff'}
`



class Li extends React.Component {

    constructor(props){
        super(props);
        this.state = {hover: false};
        this.toggleHover=this.toggleHover.bind(this);
    }

    toggleHover() {
        this.setState(prevState => ({
            hover: !prevState.hover
        })
        )
    }

    render(){
        return(
            <LiStyle selected={this.state.hover} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}>
                {this.props.value}
            </LiStyle>
        )
    }




}




 export default class Sidebar extends React.Component {



    render(){

        return (

            <div style={wrapper}>
                <ul style={nav}>
                        <Li value={
                            <Link href="/">
                                <a> Accueil </a>
                            </Link>
                        } />
                        <Li value="Nos derniers tests" />
                        <Li value={
                            <Link href="/map">
                                <a> Carte </a>
                            </Link>
                        } />
                        <Li value={
                            <Link href="/community">
                                <a> Communauté </a>
                            </Link>
                        } />
                        <Li value={
                        <Link href="/admin/admin">
                        <a> Admin </a>
                        </Link>} />
                </ul>
            </div>


        )
    }

   
}