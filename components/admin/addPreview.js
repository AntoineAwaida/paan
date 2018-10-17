import React from 'react'
/** 
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const {document} = (new JSDOM('<!doctype html><html><body></body></html>')).window;
global.document = document;
global.window = document.defaultView;

const DOMPurify = createDOMPurify(document);

const clean = DOMPurify.sanitize(dirty);


**/
export default class AddPreview extends React.Component {

    constructor(props){
        super(props);
    }

    createMarkupTitle() {
        return { __html: '<h3>' + this.props.title + '</h3>'};
    }

    createMarkupAuthor() {
        return { __html: '<i> Ecrit par ' + this.props.author + '</i>'};
    }

    createMarkupContent() {
        return { __html: this.props.content + '<br />'}
    }

    render(){

        return (
            this.props &&
            <React.Fragment>
                
            <div dangerouslySetInnerHTML={this.createMarkupTitle()} />
            <div dangerouslySetInnerHTML={this.createMarkupAuthor()} />
            <br />
            <br />
            <div dangerouslySetInnerHTML={this.createMarkupContent()} />
            </React.Fragment>
        )

    }

}