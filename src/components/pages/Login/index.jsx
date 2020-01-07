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
    MDBSpinner,
} from "mdbreact";

//> Additional libraries
// Phone input
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

//> Backend Connection
// Apollo
import { graphql, withApollo } from 'react-apollo';
import { gql } from 'apollo-boost';
import * as compose from 'lodash.flowright';

//> CSS
import './login.scss';

//> Images
// Logo
import logo from '../../../assets/logo.png';

//> Queries and Mutations
// Login
const LOGIN_USER = gql`
    mutation tokenAuth($username: String!, $password: String!){
        tokenAuth(username: $username, password: $password) {
            token
        }
    }
`;
// Get user via email
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
// Get user via phone
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
// Reset password
const RESET_PSW = gql`
  mutation passwordResetActivation($username: String!) {
    passwordResetActivation(username: $username) {
      result
      message
      msgCode
    }
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
            error: false
        }
    }

    componentWillMount = () => {
      // Set page title
      document.title = "Login";

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
        this.setState({
            loading: true
        });
        // Prevent page from reloading
        e.preventDefault();
        // Validation
        e.target.className = "needs-validation was-validated";

        if(this.state.method){
          this._getUsernameByMethod(this.state.method);
        } else {
          this._getUsernameByMethod("email");
        }
    }

    _getUsernameByMethod = async (method) => {
        let variables = {};
        let query = undefined;
        const token = localStorage.getItem('fprint');

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
            this.setState({
                error: true,
                loading: false
            }, () => this.props.handler(false));
        })
    }

    _login = async (username) => {
        await this.props.mutate({ variables: { "username": username, "password": this.state.password } })
        .then(({ loading, data }) => {
            if(data !== undefined){
                if(data.tokenAuth !== undefined){
                    if(data.tokenAuth.token !== undefined){
                        localStorage.setItem('fprint',data.tokenAuth.token);
                        // Remove error message, but keep it loading
                        this.setState({
                            error: false,
                        }, () => this.props.handler(true));
                    }
                }
            }
        }).catch((loading, error) => {
            // Username or password is wrong
            this.setState({
                error: true,
                loading: false
            }, () => this.props.handler(false));
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

    resetPsw = () => {
      let query = undefined;
      let variables = {};
      const token = localStorage.getItem('fprint');

      if(this.state.method === "phone"){
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

      this.props.client.query({
        query: query,
        variables: variables
      }).then(({data}) => {
        console.log(data);
        if(data){
          let username = data.usernameByEmail;
          this.props.reset({
            variables: {
              username
            }
          }).then(({data}) => {
            if(data){
              if(data.passwordResetActivation.result){
                // Success
                console.log(data.passwordResetActivation.message);
                this.setState({
                  successReset: "Eine E-Mail wurde an "+this.state.email+" gesendet.",
                  errorReset: false
                });
              } else {
                // Fail
                console.log(data.passwordResetActivation.message);
                this.setState({
                  successReset: false,
                  errorReset: "Eine E-Mail wurde bereits in den letzten 15 Minuten an "+
                  this.state.email+" gesendet."
                });
              }
            }
          })
          .catch((error) => {
            console.warn(error);
          })
        }
      })
      .catch((error) => {
        console.warn(error);
      })
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
            return <Redirect to="/dashboard"/> 
        } 

        return (
        <div id="login">
            <MDBEdgeHeader color="secondary-color lighten-3" />
            <MDBFreeBird>
                <MDBRow>
                    <MDBCol
                    md="10"
                    className="mx-auto float-none white z-depth-1 py-2 px-2"
                    >
                        <MDBCardBody>
                            <MDBRow className="flex-center">
                            {this.state.loading ? (
                                <MDBCol md="12" className="py-5 text-center">
                                    <MDBSpinner big />
                                </MDBCol>
                            ) : (
                                <MDBCol md="6" className="text-center">
                                    {this.state.error &&
                                        <MDBAlert color="danger" className="text-center">
                                            Die eingegebene Kombination existiert nicht.
                                        </MDBAlert>
                                    }
                                    <img src={logo} className="img-fluid mb-4" alt="Pharmaziegasse logo"/>
                                    <form onSubmit={this.handleSubmit} className="needs-validation" noValidate>
                                        <p className="h4 text-center mb-5">Dein individuelles Beauty Programm</p>
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
                                                    <span
                                                    className="blue-text"
                                                    onClick={() => this.switchMethod('phone')}
                                                    >
                                                    Über Telefonnummer einloggen
                                                    </span>
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
                                                    <span
                                                    className="blue-text"
                                                    onClick={() => this.switchMethod('email')}
                                                    >
                                                    Über E-Mail einloggen
                                                    </span>
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
                                        <div className="text-right">
                                            <span
                                            className="blue-text"
                                            onClick={this.resetPsw}
                                            >
                                            Passwort vergessen?
                                            </span>
                                        </div>
                                        {this.state.errorReset &&
                                        <MDBAlert color="danger" className="text-center">
                                        <p>{this.state.errorReset}</p>
                                        </MDBAlert>
                                        }
                                        {this.state.successReset &&
                                        <MDBAlert color="success" className="text-center">
                                        <p>{this.state.successReset}</p>
                                        </MDBAlert>
                                        }
                                        <div className="text-center mt-4">
                                            <MDBBtn color="success" type="submit">
                                                <MDBIcon icon="angle-right" className="pr-2" />Einloggen
                                            </MDBBtn>
                                        </div>
                                        <p className="text-muted text-center mt-3">
                                        Noch keinen Zugang? Jetzt einfach <a href="https://www.pharmaziegasse.at/?join">
                                        <strong>ausprobieren</strong>
                                        </a>!
                                        </p>
                                    </form>
                                </MDBCol>
                            )}
                                
                            </MDBRow>
                        </MDBCardBody>
                    </MDBCol>
                </MDBRow>
            </MDBFreeBird>
        </div>
        );
    }
}

const AuthWithMutation = compose(
  graphql(LOGIN_USER),
  graphql(RESET_PSW, { name: 'reset' }),
)(withApollo(Login));

export default AuthWithMutation;

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
