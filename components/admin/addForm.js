import { Alert, Table, Card, Container, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap'
import AddPreview from '../../components/admin/addPreview'

import cloneDeep from 'lodash/cloneDeep';

const btnstyle = {
    marginLeft: "10px"
}

const centerimage = {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    width: "50%"
}



class AddForm extends React.Component {


    constructor(props) {

        super(props);
        this.props.review ?
        this.state = {

            author: this.props.review.author,
            content: this.props.review.content,
            title: this.props.review.title,
            adress: this.props.review.adress,
            position: this.props.review.position,
            id: this.props.review._id
        }

        :

        this.state = {

            author: '',
            content: '',
            title: '',
            adress:'',
            position:null,
            id: null
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleAdressChange = this.handleAdressChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleBold = this.handleBold.bind(this);
        this.handlePicture = this.handlePicture.bind(this);

    }


    handlePicture() {

        const url = prompt("Url de l'image?")

        url &&

        this.setState({
            content: this.state.content + '<img height=400 src="' + url + '" />'
        })



    }

    handleBold() {

        this.setState({
            content: this.state.content + '<b></b>'
        })

    }
    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;


        this.setState({
            [name]: value
        })

        


    }

    handleAdressChange(event) {

        const target = event.target;
        const value = target.value;
        const name = target.name;


        this.setState({
            [name]: value
        })



        this.getGeoCoding(this.state.adress)
    }


    handleSubmit(event) {

        this.props.submitted("pending");


        this.state.id ? this.submitEditForm(this.state):  
        this.submitForm(this.state)

        
        event.preventDefault();

        this.props.onSubmission();

    }

    async getGeoCoding(adress) {

            const api = 'https://maps.googleapis.com/maps/api/geocode/json?address='+adress.replace(/ /g,"+")+'&key=AIzaSyD7K54GCHqFa8Yn9C9MDdQFmwgDSgLGGgw';
            const res = await fetch(api)
            let data = await res.json()

            if(data.results[0]){
            
            data = data.results[0].geometry.location

        
            const latitude = data.lat;
            const longitude = data.lng;

            data = {latitude:latitude,longitude:longitude}

            console.log(data)
            this.setState({
                position:data
            }) 

        }
    }

    submitEditForm (data) {
        fetch('/review/' + this.state.id, {
          method: 'put',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }).then((res) => {
          res.status === 200 ? this.props.submitted(true)
          : this.props.submitted("error") 
        })
      }

    submitForm (data) {
        fetch('/review', {
          method: 'post',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }).then((res) => {
          res.status === 200 ? this.props.submitted(true)
          : this.props.submitted("error") 
        })
      }


    render() {
        return (
            
            this.props.value &&
            
            <React.Fragment>
            <Button style={btnstyle} onClick = {this.handleBold}> Gras </Button>
            <Button style={btnstyle} onClick = {this.handlePicture}> Image </Button>
            <br />
            <br />
                <Form onSubmit={this.handleSubmit} encType="multipart/form-data">
                    <FormGroup>
                        <Label for="author">Auteur</Label>
                        <Input type="text" value={this.state.author} name="author" id="author" onChange={this.handleInputChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="title">Titre</Label>
                        <Input type="text" value={this.state.title} name="title" id="title"  onChange={this.handleInputChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="content">Contenu</Label>
                        <Input type="textarea" style={{height: 400}} value={this.state.content} name="content" id="content"  onChange={this.handleInputChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="adress">Adresse</Label>
                        <Input type="text" value={this.state.adress} name="adress" id="adress" onChange={this.handleAdressChange} />
                    </FormGroup>
                    {/**<FormGroup>
                        <Label for="file">Image</Label>
                        <Input type="file" name="sampleFile" id="sampleFile" />
                    </FormGroup>**/}
                    <FormGroup>
                        <Button type="submit" value="Submit" color="danger"> Ajouter! </Button>
                    </FormGroup>
                </Form>
            <br />

            { this.state.position ? "Latitude: " + this.state.position.latitude + " ; Longitude: " + this.state.position.longitude : ''}
            <AddPreview author={this.state.author} title={this.state.title} content={this.state.content} />
            </React.Fragment>
            

            
        )
    }


}

export default AddForm;