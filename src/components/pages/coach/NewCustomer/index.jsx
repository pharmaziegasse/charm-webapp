//> React
// Contains all the functionality necessary to define React components
import React from 'react';
// Redirect from Router
import { Link, Redirect } from 'react-router-dom';

//> Additional libraries
// Phone input
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/dist/style.css';

//> Backend Connection
// Apollo
import { graphql, withApollo } from "react-apollo";
import { ApolloClient, HttpLink, InMemoryCache, gql } from "apollo-boost";
import * as compose from 'lodash.flowright';

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
    MDBContainer,
    MDBCollapse,
    MDBCard,
    MDBCardBody,
    MDBCollapseHeader,
    MDBProgress,
    MDBRow,
    MDBCol,
    MDBInput,
    MDBBtn,
    MDBIcon,
    MDBSwitch,
    MDBDatePicker,
    MDBSelect,
} from 'mdbreact';

//> CSS
import './newcustomer.scss';

// Update data
const UPDATE_FORMS = gql`
    mutation createAn ($token: String!, $values: GenericScalar!, $urlpath: String!) {
        anamneseAnFormPage(
            token: $token,
            url: $urlpath,
            values: $values
        ) {
            result
            errors {
                name
                errors
            }
        }
    }
`;

const GET_COACHES = gql`
    query ($token: String!) {
        coachAll(token: $token) {
            id
            firstName
            lastName
        }
    }
`;

const coaches = [
    {
    text: "Option 1",
    value: "1"
    },
    {
    text: "Option 2",
    value: "2"
    },
    {
    text: "Option 3",
    value: "3"
    }
]

class NewCustomer extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            coach: [],
            verified: false,
            title: "",
            firstName: "",
            lastName: "",
            email: "",
            birthdate: "",
            phone: "",
            address: "",
            city: "",
            zip: "",
            country: "",
            Coaches: []
        }
    }

    componentWillMount() {
        this._fetchAllCoaches();
    }
    

    handleTextChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handlePhoneChange = (value) => {
        // Remove spaces from phone number
        value = value.replace(/\s/g,'');
        this.setState({
            phone: value.trim()
        });
    }

    getPickerValue = (value) => {
        this.setState({
            birthdate: value
        });
    }

    handleSelectChange = (value) => {
        this.setState({
            coach: value
        });
    }

    _fetchAllCoaches = async () => {
        this.props.client.query({
        query: GET_COACHES,
        variables: { "token": localStorage.getItem("wca") }
        }).then(({data}) => {
            if(data.coachAll){
                let coaches = data.coachAll.map((coach, i) => {
                    return({
                        text: coach.firstName + " " + coach.lastName,
                        value: coach.id
                    });
                });
                this.setState({
                    Coaches: coaches
                });
            }
        })
        .catch(error => {
            console.log("Error",error);
        })
    }

    _createUser = () => {
        if(this.state.email.trim() !== "" && this.state.phone.trim() !== "" && this.state.coach.length >= 1 ){
            let email = this.state.email.trim();
            // The phone input has already been trimmed on input
            let phone = this.state.phone;
            let coachId = this.state.coach[0];

            // Get all values and prepare them for API handling

            const values = {
                "coach_id": this.state.coach[0],
                "first_name": this.state.firstName,
                "last_name": this.state.lastName,
                "email": this.state.email,
                "birthdate": this.state.birthdate,
                "telephone": this.state.phone,
                "address": this.state.address,
                "city": this.state.city,
                "postal_code": this.state.zip,
                "country": this.state.country,
            }

        } else {
            console.log("Required fields not filled in");
        }
    }

    render() {
        // Get global state with login information
        const { globalState } = this.props;

        //> Route protection
        // Only logged in uses can access this page
        if(!globalState.logged) return <Redirect to="/login"/>
        // If logged in but not coach
        if(globalState.logged && !globalState.coach) return <Redirect to="/dashboard"/> 

        console.log(this.state);

        return(
            <MDBContainer id="newcustomer">
                <h2 className="text-center font-weight-bold">Create customer</h2>
                <div className="text-left mt-4">
                    <Link to="/coach">
                        <MDBBtn color="red">
                            <MDBIcon icon="angle-left" className="pr-2" />Zurück
                        </MDBBtn>
                    </Link>
                </div>
                <MDBRow className="flex-center mt-4">
                    <MDBCol md="1">
                        <div className="form-group">
                            <label htmlFor="tit">Titel</label>
                            <input
                                type="text"
                                name="title"
                                value={this.state.title}
                                onChange={this.handleTextChange}
                                className="form-control"
                                id="tit"
                            />
                        </div>
                    </MDBCol>
                    <MDBCol md="3">
                        <div className="form-group">
                            <label htmlFor="firstN">Vorname</label>
                            <input
                                type="text"
                                name="firstName"
                                value={this.state.firstName}
                                onChange={this.handleTextChange}
                                className="form-control"
                                id="firstN"
                            />
                        </div>
                    </MDBCol>
                    <MDBCol md="3">
                        <div className="form-group">
                            <label htmlFor="lastN">Nachname</label>
                            <input
                                type="text"
                                name="lastName"
                                value={this.state.lastName}
                                onChange={this.handleTextChange}
                                className="form-control"
                                id="lastN"
                            />
                        </div>
                    </MDBCol>
                    <MDBCol md="12" className="flex-center text-center my-4">
                        <MDBCol md="4">
                            <MDBSelect
                            options={this.state.Coaches}
                            className="select-coach"
                            label={<>Coach<span>*</span></>}
                            getValue={this.handleSelectChange}
                            search
                            required
                            />
                        </MDBCol>
                    </MDBCol>
                    <MDBCol md="4">
                        <label htmlFor="pho">Telefon Nummer<span>*</span></label>
                        <ReactPhoneInput
                        defaultCountry={'at'}
                        preferredCountries={['at','de','ch']}
                        value={this.state.phone}
                        onChange={this.handlePhoneChange}
                        enableSearchField={true}
                        required
                        />
                    </MDBCol>
                    <MDBCol md="4">
                        <div className="form-group">
                            <label htmlFor="ema">E-Mail<span>*</span></label>
                            <input
                                type="email"
                                name="email"
                                value={this.state.email}
                                onChange={this.handleTextChange}
                                className="form-control"
                                id="ema"
                                required
                            />
                        </div>
                    </MDBCol>
                    <MDBCol md="12" className="my-4 flex-center text-center">
                        <MDBCol md="4">
                            <div className="form-group">
                                <label htmlFor="pho">Geburtsdatum</label>
                                <MDBDatePicker 
                                value={this.state.birthdate}
                                className="date-picker"
                                getValue={this.getPickerValue}
                                disableFuture={true}
                                format='DD.MM.YYYY'
                                initialFocusedDate="01.01.1980"
                                keyboard
                                />
                            </div>
                        </MDBCol>
                    </MDBCol>
                </MDBRow>
                <div className="text-center">
                    <MDBBtn
                    color="green"
                    onClick={() => this._createUser()}
                    >
                    <MDBIcon icon="check" className="pr-2" />Erstellen
                    </MDBBtn>
                </div>
            </MDBContainer>
        )
    }
}

export default compose(
    graphql(UPDATE_FORMS, { name: 'update' }),
)(withApollo(NewCustomer));


/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
