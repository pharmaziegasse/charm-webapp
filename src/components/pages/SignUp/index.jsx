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
import 'react-phone-input-2/dist/style.css';

//> Backend Connection
// Apollo
import { graphql, withApollo } from 'react-apollo';
import { gql } from 'apollo-boost';
import * as compose from 'lodash.flowright';

//> CSS
import './signup.scss';

//> Images
// Logo
import logo from '../../../assets/logo.png';

class SignUp extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      email: "",
      address: "",
      fullname: "",
      password: "",
      error: false
    }
  }

  componentWillMount = () => {
    // Set page title
    document.title = "Dein individuelles Beauty Programm";

    let method = localStorage.getItem('method');
    if(method){
      this.setState({
        method: method
      });
    }
  }

  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  handlePhoneChange = (value) => {
      this.setState({
        phone: value.trim()
      });
    }

  handleSubmit = (e) => {
    this.setState({
      loading: true
    });
    // Prevent page from reloading
    e.preventDefault();
    // Validation
    e.target.className = "needs-validation was-validated";
  }

  render() {

      // Get global state with login information
      const { globalState } = this.props;

      return (
      <div id="signup">
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
                                      <p className="h4 text-center mb-5">
                                      Erhalte JETZT dein individuelles Beauty Programm
                                      </p>
                                      <label htmlFor="defaultFormLoginNameEx" className="grey-text">
                                        Vollständiger Name
                                      </label>
                                      <input
                                      type="text"
                                      id="defaultFormLoginNameEx"
                                      className="form-control"
                                      name="fullname"
                                      value={this.state.fullname}
                                      onChange={this.handleChange}
                                      required
                                      />
                                      <div className="invalid-feedback">
                                        Bitte trage deinen vollständigen Namen ein
                                      </div>
                                      <label htmlFor="defaultFormLoginEmailEx" className="grey-text">
                                      Deine E-Mail Adresse
                                      </label>
                                      <input
                                      type="email"
                                      id="defaultFormLoginEmailEx"
                                      className="form-control"
                                      name="email"
                                      value={this.state.email}
                                      onChange={this.handleChange}
                                      required
                                      />
                                      <div className="invalid-feedback">
                                        Bitte gib deine E-Mail Adresse an.
                                      </div>
                                      <label htmlFor="pho">Telefon Nummer</label>
                                      <ReactPhoneInput
                                      defaultCountry={'at'}
                                      name="phone"
                                      preferredCountries={['at','de','ch']}
                                      value={this.state.phone}
                                      onChange={this.handlePhoneChange}
                                      inputExtraProps={{
                                          className: 'w-100'
                                      }}
                                      />
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
                                      Schon einen Zugang? Jetzt einfach <a href="https://charm.pharmaziegasse.at">
                                      <strong>einloggen</strong>
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

export default SignUp;

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
