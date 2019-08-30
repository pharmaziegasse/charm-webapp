//> React
// Contains all the functionality necessary to define React components
import React from 'react';
// Link and Redirect from Router
import { Link, Redirect } from 'react-router-dom';

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
    MDBEdgeHeader,
    MDBFreeBird,
    MDBCol,
    MDBRow,
    MDBCardBody,
    MDBBtn,
    MDBAlert,
    MDBIcon,
} from "mdbreact";

//> Additional libraries
// Phone input
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/dist/style.css';

//> Backend Connection
// Apollo
import { graphql, withApollo } from 'react-apollo';
import { gql } from 'apollo-boost';

//> CSS
import './login.scss';

//> Queries and Mutations
const LOGIN_USER = gql`
    mutation tokenAuth($username: String!, $password: String!){
        tokenAuth(username: $username, password: $password) {
            token
        }
    }
`;

const USER_BY_EMAIL = gql`
    query(
        $token: String!
        $email: String!
    ) {
        usernameByEmail(
            token: $token,
            email: $email
        )
    }
`;

const USER_BY_PHONE = gql`
    query(
        $token: String!
        $phone: String!
    ) {
        usernameByPhone(
        token: $token,
        phone: $phone
        )
    }
`;

class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: "",
            phone: "",
            password: "",
            method: 'email',
        }
    }

    componentWillMount = () => {
        let method = localStorage.getItem('method');
        if(method){
            this.setState({
                method: method
            });
        }
    }

    handleChange = (e) => {
        this.setState({[e.target.type]: e.target.value})
    }

    handleSubmit = (e) => {
        // Prevent page from reloading
        e.preventDefault();
        // Validation
        e.target.className = "needs-validation was-validated";

        this._loginAnonymous("+436643409980", "admin");
    }

    _loginAnonymous = async (phone, password) => {

        await this.props.mutate({ variables: { "username": "simon", "password": "admin" } })
        .then(({ loading, data }) => {
            console.log(data);
            if(data !== undefined){
                if(data.tokenAuth !== undefined){
                    if(data.tokenAuth.token !== undefined){
                        
                        if(this.state.method === 'phone'){
                            this._getUsernameByMethod(data.tokenAuth.token, 'phone');
                        } else {
                            this._getUsernameByMethod(data.tokenAuth.token, 'email');
                        }
                        
                        //localStorage.setItem('wca',data.tokenAuth.token);
                        //this.props.handler(true);
                    }
                }
            }
        }).catch((loading, error) => {
            // Username or password is wrong
            this.props.handler(false);
        });
    };

    _getUsernameByMethod = async (token, method) => {
        let variables = {};
        let query = undefined;

        if(method === 'phone'){
            variables = { 
                "token": token,
                "phone": this.state.phone
            }
            query = USER_BY_PHONE;
        } else {
            variables = {
                "token": token,
                "email": this.state.email
            }
            query = USER_BY_EMAIL;
        }

        await this.props.client.query({
            query: query,
            variables: variables
        }).then(({data}) => {
            console.log(data);
            if(method === 'phone'){
                if(data.usernameByPhone !== undefined){
                    this._login(data.usernameByPhone);
                }
            } else {
                if(data.usernameByEmail !== undefined){
                    this._login(data.usernameByEmail);
                }
            }
            
        })
        .catch(error => {
            this.props.handler(false);
        })
    }

    _login = async (username) => {
        console.log(username);
        await this.props.mutate({ variables: { "username": username, "password": this.state.password } })
        .then(({ loading, data }) => {
            console.log(data);
            if(data !== undefined){
                if(data.tokenAuth !== undefined){
                    if(data.tokenAuth.token !== undefined){
                        localStorage.setItem('wca',data.tokenAuth.token);
                        this.props.handler(true);
                    }
                }
            }
        }).catch((loading, error) => {
            // Username or password is wrong
            this.props.handler(false);
        });
    }

    handlePhoneChange = (value) => {
        if(this.state.method === 'phone'){
            value = value.replace(/\s/g,'');
            if(this.state.email === ""){
                this.setState({
                    phone: value.trim()
                })
            } else {
                this.setState({
                    phone: value.trim(),
                    email: ""
                });
            }
            
        }
    }

    handleEmailChange = (e) => {
        if(this.state.method === 'email'){
            if(this.state.phone === ""){
                this.setState({
                    email: e.target.value
                })
            } else {
                this.setState({
                    email: e.target.value,
                    phone: ""
                });
            }
        }
    }

    switchMethod = (method) => {
        // Update state and set method
        this.setState({
            method: method
        }, () => localStorage.setItem('method',method));
    }


    render() {

        // Get global state with login information
        const { globalState } = this.props;

        /**
         * Redirect to Dashboard
         * If user is already logged in, redirect to Dashboard
         * This doubles as a neat way to redirect the user directly after login
         */
        if(globalState.logged){
            console.log("reached");
            return <Redirect to="/dashboard"/> 
        } 

        return (
        <div>
            <MDBEdgeHeader color="secondary-color lighten-3" />
            <MDBFreeBird id="login">
                <MDBRow>
                    <MDBCol
                    md="10"
                    className="mx-auto float-none white z-depth-1 py-2 px-2"
                    >
                        <MDBCardBody>
                            <MDBRow className="flex-center">
                                <MDBCol md="6">
                                    <form onSubmit={this.handleSubmit} className="needs-validation" noValidate>
                                        <p className="h4 text-center mb-4">Einloggen</p>
                                        {this.state.method === 'email' ? (
                                            <>
                                                <label htmlFor="defaultFormLoginEmailEx" className="grey-text">
                                                Deine E-Mail Adresse
                                                </label>
                                                <input
                                                type="email"
                                                id="defaultFormLoginEmailEx"
                                                className="form-control"
                                                value={this.state.email}
                                                onChange={this.handleEmailChange}
                                                required
                                                />
                                                <div className="invalid-feedback">
                                                    Bitte gib deine E-Mail Adresse an.
                                                </div>
                                                <div className="text-right">
                                                    <a
                                                    role="button"
                                                    className="blue-text"
                                                    onClick={() => this.switchMethod('phone')}
                                                    >
                                                    Über Telefonnummer einloggen
                                                    </a>
                                                </div>
                                                
                                            </>
                                        ) : (
                                            <>
                                                <label htmlFor="pho">Telefon Nummer</label>
                                                <ReactPhoneInput
                                                defaultCountry={'at'}
                                                preferredCountries={['at','de','ch']}
                                                value={this.state.phone}
                                                onChange={this.handlePhoneChange}
                                                inputExtraProps={{
                                                    className: 'w-100'
                                                }}
                                                />
                                                <div className="text-right">
                                                    <a
                                                    role="button"
                                                    className="blue-text"
                                                    onClick={() => this.switchMethod('email')}
                                                    >
                                                    Über E-Mail einloggen
                                                    </a>
                                                </div>
                                            </>
                                        ) }
                                        <br />
                                        <label htmlFor="defaultFormLoginPasswordEx" className="grey-text">
                                        Dein Passwort
                                        </label>
                                        <input
                                        type="password"
                                        id="defaultFormLoginPasswordEx"
                                        className="form-control"
                                        onChange={this.handleChange}
                                        required
                                        />
                                        <div className="invalid-feedback">
                                            Bitte gib ein Passwort an.
                                        </div>
                                        <div className="text-center mt-4">
                                            <MDBBtn color="success" type="submit">
                                                <MDBIcon icon="angle-right" className="pr-2" />Einloggen
                                            </MDBBtn>
                                        </div>
                                        <p className="text-muted text-center mt-3">
                                        Noch kein Mitglied? Jetzt einfach <Link to="/join">
                                        <strong>Mitglied werden</strong>
                                        </Link>!
                                        </p>
                                    </form>
                                </MDBCol>
                            </MDBRow>
                        </MDBCardBody>
                    </MDBCol>
                </MDBRow>
            </MDBFreeBird>
        </div>
        );
    }
}

const AuthWithMutation = graphql(LOGIN_USER)(withApollo(Login));

export default AuthWithMutation;

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
