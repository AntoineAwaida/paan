
import Page from '../../layouts/main'

import reviews from '../../components/reviews'

import AddForm from '../../components/admin/addForm'

import { Alert, Table, Card, Container, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap'

import Router from 'next/router'


const btnstyle = {
    marginLeft: "10px"
}




class Admin extends React.Component {



    constructor(props){

        super(props);
        this.state = {visibleAdd:false, addSubmitted:false, modif: false,reviewlist:null, review:null};
        this.toggleAddForm = this.toggleAddForm.bind(this);
        this.handleAddSubmitted = this.handleAddSubmitted.bind(this);
        this.deleteReview = this.deleteReview.bind(this);
        this.editReview= this.editReview.bind(this);
    }

        
        

    async componentDidMount(){

        let api = 'http://localhost:3000/retrieveuser'
        let res = await fetch(api)
        let data = null;
    
        if (res.status === 204){
    
            Router.push('/auth/login')
    
        }
    
        else if (res.status === 200){
    
    
    
          const data = await res.json()
    
        if(data.admin != true) {
            Router.push('/')
        }

        }
        

        api = 'http://localhost:3000/review';
        res = await fetch(api)
        data = await res.json()
    
        this.setState({
            reviewlist: data
        })

    }
    

    async componentDidUpdate(){

        const api = 'http://localhost:3000/review';
        const res = await fetch(api)
        const data = await res.json()
    

        if (data.length != this.state.reviewlist.length || this.state.addSubmitted ){

            this.setState({
                reviewlist: data
            })

        } 
            

    }



    handleAddSubmitted(object) {
        this.setState( 
            {
                addSubmitted: object,
                review:null
            }
        )
    }


    toggleAddForm() {
        
        this.setState(prevState => ({
            visibleAdd: !prevState.visibleAdd,
            addSubmitted: false
        }))

    }

    deleteReview(id) {

        const sure = confirm("Etes-vous sûr?")

        sure? 
        fetch('/review/' + id, {
            method: 'delete'
        })
        .then(this.setState(prevState => ({
            modif:!prevState.modif
        })))
        : null;
    }

    editReview(review_id) {

        this.toggleAddForm();
        let myreview = '';
        this.state.reviewlist.map(function(review){

            if (review._id == review_id){

                myreview = review;

            }

        }

    )

    this.setState({
        review: myreview
    })

    }

    render() {

        return(
            <Page>
            <br />
            <Container>
                    <Button color="success" onClick={this.toggleAddForm}> {this.state.visibleAdd ? "Fermer" : "Ajouter un article" } </Button>
                    {this.state.visibleAdd ? <AddForm value={this.state.visibleAdd} review={this.state.review} onSubmission={this.toggleAddForm} submitted={this.handleAddSubmitted} />
                    : <ReviewList onDelete={this.deleteReview} onEdit = {this.editReview} modif={this.state.modif} reviewlist={this.state.reviewlist} /> }
            </Container>
            <SubmittedAlert displayed={this.state.addSubmitted} />
            < br />
            Rq: un problème subsiste si la requête POST n'a pas été correctement envoyée, j'aimerais en être notifié...
            </Page>
        )

    }




  

}



class ReviewList extends React.Component {

    constructor(props){
        super(props);
        this.delete = this.delete.bind(this);
        this.edit = this.edit.bind(this);
    }


    delete(e) {
        this.props.onDelete(e.target.value);
    }


    edit(e) {

        this.props.onEdit(e.target.value);

    }

    

    

    render () {
       
        return (
            <React.Fragment>
            <br /> 
                <div>
                    <Table>
                        <thead>
                            <tr>
                                <th> Titre </th>
                                <th> Auteur </th>
                                <th> Date de soumission </th>
                                <th> Action </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.props.reviewlist &&
                                this.props.reviewlist.map((review) => (
                                    <tr key={review._id}>
                                        <td> {review.title} </td>
                                        <td> {review.author} </td>
                                        <td> {review.date_of_submit} </td>
                                        <td> <Button color ="danger" style={btnstyle} value={review._id} onClick={this.delete}> Supprimer </Button>
                                        <Button color="info" style={btnstyle} value={review._id} onClick={this.edit}> Editer </Button></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </div>
            </React.Fragment>
        )
    }

}


ReviewList.getInitialProps = reviews;


function SubmittedAlert(props) {

    if(!props.displayed) {
        return null;
    }

    return (

        props.displayed === true ?
        <div>
            <br />
            <Alert color="success">
                L'article a bien été ajouté!
            </Alert>
        </div>

        : 
        
            props.displayed =="pending" ?
                <div>
                    <br />
                    <Alert color="warning">
                        En cours d'envoi
                    </Alert>
                </div>
            
            :

                <div>
                    <br />
                        <Alert color="danger">
                            Erreur lors de l'envoi.
                        </Alert>
                </div>
    )

}








export default Admin