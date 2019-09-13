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
import { gql } from "apollo-boost";
import * as compose from 'lodash.flowright';

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBInput,
    MDBBtn,
    MDBIcon,
    MDBDatePicker,
    MDBSelect,
    MDBSpinner,
    MDBAlert,
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
        pages (token: $token) {
            ... on UserUserFormPage {
                urlPath
            }
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
            urlPath: undefined,
            error: false,
            success: false,
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
        // Note: Handling dates in JavaScript is like hunting K'lor'slugs on Korriban. A huge waste of time.
        let dateS = new Date(value);

        // Get the year
        let year = dateS.getFullYear();
        // Get the month ( January is 0! )
        let month = ("0" + (dateS.getMonth() + 1)).slice(-2);
        // Get the day of the month
        let day = ("0" + (dateS.getDate())).slice(-2);

        /**
         * Combine to achieve YYYY-MM-DD format like Captain Planet.
         * LET OUR POWERS COMBINE!
         * You certainly feel like Captain Planet when you get it to work.
         */ 
        let date = year+"-"+month+"-"+day;

        this.setState({
            birthdate: date
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
                let urlPaths = data.pages.map((page, i) => {
                    if(page.urlPath !== undefined){
                        if(page.__typename === "UserUserFormPage"){
                            return page.urlPath;
                        }
                    }
                });
                this.setState({
                    Coaches: coaches,
                    urlPath: urlPaths.filter(function(el) { return el; })
                });
            }
        })
        .catch(error => {
            console.log("Error",error);
        })
    }

    _createUser = () => {
        if(this.state.email.trim() !== "" && this.state.phone.trim() !== "" && this.state.coach.length >= 1 ){
            
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

            let urlPath = this.state.urlPath[0];

            if(urlPath !== undefined && this.state.coach[0] !== undefined){
                this.setState({
                    loading: true
                });
                this.props.update({
                    variables: { 
                        "token": localStorage.getItem("wca"),
                        "urlPath": urlPath,
                        "values": values
                    }
                }).then(({data}) => {
                    this.setState({
                        loading: false
                    });
                    if(data.userUserFormPage.result === "OK"){
                        this.setState({
                            error: false,
                            success: true
                        });
                    } else if (data.userUserFormPage.result === "FAIL"){
                        console.log("Errors",data.userUserFormPage.errors);
                    }
                })
                .catch(error => {
                    console.log("Error",error);
                })
            }

            console.log(values);

        } else {
            this.setState({
                error: true
            });
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
                { this.state.success ? (
                    <div className="w-100 h-100 flex-center">
                        <h2 className="green-text text-center"><MDBIcon icon="check"/><br/>Customer created</h2>
                    </div>
                ) : (
                    <MDBRow className="flex-center mt-4 text-center">
                        { this.state.error &&
                            <MDBCol md="7">
                                <MDBAlert color="danger">
                                    <p className="lead">Sie haben einige Pflichtfelder nicht ausgefüllt.</p>
                                    <p>Bitte füllen Sie mindestens alle Felder, welche 
                                    mit <strong>*</strong> gekennzeichnet sind aus.</p>
                                </MDBAlert>
                            </MDBCol>
                        }
                        <MDBCol md="12" className="mt-4">
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
                                valueDefault={null}
                                keyboard
                                />
                            </div>
                        </MDBCol>
                    </MDBRow>
                ) }
                <div className="text-center">
                { !this.state.success &&
                    <>
                        { !this.state.loading ? (
                            <MDBBtn
                            color="green"
                            onClick={() => this._createUser()}
                            >
                            <MDBIcon icon="check" className="pr-2" />Erstellen
                            </MDBBtn>
                        ) : (
                            <MDBSpinner />
                        ) }
                    </>
                }
                
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
