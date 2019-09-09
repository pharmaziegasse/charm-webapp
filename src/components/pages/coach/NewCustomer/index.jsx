//> React
// Contains all the functionality necessary to define React components
import React from 'react';
// Redirect from Router
import { Link, Redirect } from 'react-router-dom';

//> Additional libraries
// Phone input
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/dist/style.css';
// Country list
import countryList from 'react-select-country-list';

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

// Country list
const countries = countryList().getData();

// Update data
const UPDATE_FORMS = gql`
    mutation createUser ($token: String!, $urlPath: String!, $values: GenericScalar!) {
        userUserFormPage(
            token: $token,
            url: $urlPath,
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
            Coaches: [],
            Countries: [],
            usePhoneAsCountry: true,
            phoneCountry: [],
        }
    }

    componentWillMount() {
        this._fetchAllCoaches();
        this._fetchAllCountries();
    }
    

    handleTextChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handlePhoneChange = (value, country) => {
        // Remove spaces from phone number
        value = value.replace(/\s/g,'');
        if(this.state.usePhoneAsCountry){
            this.setState({
                phone: value.trim(),
                country: {
                    name: country.name,
                    countryCode: country.countryCode.toUpperCase()
                },
                phoneCountry: {
                    name: country.name,
                    countryCode: country.countryCode.toUpperCase()
                }
            });
        } else {
            this.setState({
                phone: value.trim(),
                phoneCountry: {
                    name: country.name,
                    countryCode: country.countryCode.toUpperCase()
                }
            });
        }
    }

    handlePhoneByCountry = (e) => {
        if(e.target.checked){
            this.setState({ 
                usePhoneAsCountry: e.target.checked,
                country: this.state.phoneCountry
            });
        } else {
            this.setState({ 
                usePhoneAsCountry: e.target.checked,
                country: []
            });
        }
        
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

    handleCountrySelectChange = (value) => {
        this.setState({
            country: {
                name: "",
                countryCode: value[0]
            }
        });
    }

    _fetchAllCountries = () => {
        let allCountries = countries.map((c, i) => {
            return({
                text: c.label,
                value: c.value
            });
        });
        this.setState({
            Countries: allCountries
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
                "title": this.state.title,
                "coach_id": this.state.coach[0],
                "first_name": this.state.firstName,
                "last_name": this.state.lastName,
                "email": this.state.email,
                "birthdate": this.state.birthdate,
                "telephone": this.state.phone,
                "address": this.state.address,
                "city": this.state.city,
                "postal_code": this.state.zip,
                "country": this.state.country.countryCode,
            }

            console.log(values);

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
                <MDBRow className="flex-center mt-4 text-center">
                    <MDBCol md="12" className="mt-4" className="mt-4">
                        <h4 className="text-center font-weight-bold">Name</h4>
                    </MDBCol>
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
                    <MDBCol md="12" className="mt-4">
                        <h4 className="text-center font-weight-bold">Coach</h4>
                    </MDBCol>
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
                    <MDBCol md="12" className="mt-4">
                        <h4 className="text-center font-weight-bold">Kontaktdaten</h4>
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
                    <MDBCol md="4">
                        <label htmlFor="pho">Telefon Nummer<span>*</span></label>
                        <ReactPhoneInput
                        defaultCountry={'at'}
                        preferredCountries={['at','de','ch']}
                        value={this.state.phone}
                        onChange={this.handlePhoneChange}
                        enableSearchField={true}
                        containerClass="mb-3 react-tel-input"
                        required
                        />
                        <MDBInput
                        label="Land aus Telefon Nummer"
                        filled
                        onChange={(e => this.handlePhoneByCountry(e))}
                        checked={this.state.usePhoneAsCountry}
                        type="checkbox"
                        id="checkbox-country-in-phone"
                        />
                    </MDBCol>
                    <MDBCol md="12" className="mt-4">
                        <h4 className="text-center font-weight-bold">Wohnort</h4>
                    </MDBCol>
                    { !this.state.usePhoneAsCountry &&
                        <MDBCol md="3">
                            <MDBSelect
                            options={this.state.Countries}
                            className="select-countries"
                            label="Land"
                            getValue={this.handleCountrySelectChange}
                            search
                            required
                            />
                        </MDBCol>
                    }
                        <MDBCol md="2">
                            <div className="form-group">
                                <label htmlFor="ema">Postleitzahl (PLZ)</label>
                                <input
                                    type="text"
                                    name="zip"
                                    value={this.state.zip}
                                    onChange={this.handleTextChange}
                                    className="form-control"
                                    id="plz"
                                />
                            </div>
                        </MDBCol>
                        <MDBCol md="3">
                            <div className="form-group">
                                <label htmlFor="ema">Stadt</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={this.state.city}
                                    onChange={this.handleTextChange}
                                    className="form-control"
                                    id="cit"
                                />
                            </div>
                        </MDBCol>
                        <MDBCol md="4">
                            <div className="form-group">
                                <label htmlFor="ema">Adresse</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={this.state.address}
                                    onChange={this.handleTextChange}
                                    className="form-control"
                                    id="adr"
                                />
                            </div>
                        </MDBCol>
                    <MDBCol md="12" className="mt-4">
                        <h4 className="text-center font-weight-bold">Weitere daten</h4>
                    </MDBCol>
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
