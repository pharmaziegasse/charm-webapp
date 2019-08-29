//> React
// Contains all the functionality necessary to define React components
import React from 'react';
// Redirect from Router
import { Link, Redirect } from 'react-router-dom';

//> Additional libraries
// Phone input
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/dist/style.css';

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

//> Backend Connection
// Apollo
import { graphql } from "react-apollo";
import gql from 'graphql-tag';

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
            isCustomer: true,
            coach: "",
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
            newsletter: "",
        }
    }

    handleTextChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handlePhoneChange = (value) => {
        this.setState({
            phone: value
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
                            options={coaches}
                            className="select-coach"
                            label="Coach"
                            getValue={this.handleSelectChange}
                            search
                            />
                        </MDBCol>
                    </MDBCol>
                    <MDBCol md="4">
                        
                            <label htmlFor="pho">Telefon Nummer</label>
                            <ReactPhoneInput
                            defaultCountry={'at'}
                            preferredCountries={['at','de','ch']}
                            value={this.state.phone}
                            onChange={this.handlePhoneChange}
                            enableSearchField={true}
                            />
                        
                    </MDBCol>
                    <MDBCol md="4">
                        <div className="form-group">
                            <label htmlFor="ema">E-Mail</label>
                            <input
                                type="email"
                                name="email"
                                value={this.state.email}
                                onChange={this.handleTextChange}
                                className="form-control"
                                id="ema"
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
                    <MDBCol md="12" className="flex-center text-center my-4">
                        <MDBCol md="4">
                            <div className="form-group">
                                <MDBInput label="Verifiziert" filled type="checkbox" id="checkbox1" />
                                <small><strong>Handelt es sich um eine echte Person?</strong><br/>
                                Für gewöhnlich werden KundInnen erst nach einem Erstgespräch oder Bilder-Upload 
                                verifiziert.</small>
                            </div>
                        </MDBCol>
                    </MDBCol>
                    <MDBCol md="12">

                    </MDBCol>
                </MDBRow>
                
            </MDBContainer>
        )
    }
}

export default NewCustomer;

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
