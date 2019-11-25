//> React
// Contains all the functionality necessary to define React components
import React from 'react';
// Redirect from Router
import { Redirect } from 'react-router-dom';

//> Additional libraries
// Query String for get param fetching
import qs from 'query-string';

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBAlert,
  MDBIcon,
  MDBInput,
  MDBSpinner,
} from "mdbreact";

//> Backend Connection
// Apollo
import { graphql, withApollo } from "react-apollo";
import gql from 'graphql-tag';

//> Queries
// Set password
const SET_PSW = gql`
  mutation setPassword($username: String!, $aToken: String!, $psw: String!) {
    setPassword(
      activationToken: $aToken,
      password: $psw,
      username: $username
    ) {
      result
      message
      msgCode
    }
  }
`;
// Get username via email
const GET_USERNAME = gql`
  query getuname($token: String!, $email: String!) {
    usernameByEmail(token: $token, email: $email)
  }
`;

class SetPassword extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      password: "",
      passwordRepeat: "",
      error: false,
      activationToken: false,
      username: false,
    }
  }

  componentDidMount = () => {
    // Get activation token from URL
    const param = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
    const activationToken = param.token;

    // Get username
    let username = param.user;

    this.setState({
      activationToken,
      username,
    });
  }

  submitForm = () => {
    if(this.state.password){
      if(this.state.passwordRepeat){
        if(this.state.password === this.state.passwordRepeat){
          if(this.state.accessToken && this.state.username){
            this.props.set({
              variables: {
                "atoken": this.state.accessToken,
                "password": this.state.password,
                "username": this.state.username
              }
            })
            .then(({data}) => {
              console.log(data);
            })
            .catch(error => {
              console.error("Mutation error:",error);
            })
          } else {
            this.setState({
              error: "Der Service ist derzeit nicht verfügbar. Bitte versuchen Sie es etwas später."
            });
          }
        } else {
          this.setState({
            error: "Ihre Passwörter sind abweichend. Bitte überprüfen Sie Ihre Eingabe."
          });
        }
      } else {
        this.setState({
          error: "Bitte wiederholen Sie Ihr Passwort."
        });
      }
    } else {
      this.setState({
        error: "Bitte geben Sie ein neues Passwort ein."
      });
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {

    // Get global state with login information
    const { globalState } = this.props;

    if(this.state.username === undefined || this.state.activationToken === undefined){
      return <Redirect to="/login"/>;
    }

    return(
      <MDBContainer className="py-5">
        <MDBRow className="flex-center">
          <MDBCol md="6">
            <MDBCard className="text-center">
              <MDBCardBody>
                <h3>Passwort setzen</h3>
                {this.state.error &&
                <MDBAlert color="danger">
                  <p>{this.state.error}</p>
                </MDBAlert>
                }
                <MDBInput 
                type="password"
                outline
                label="Passwort"
                name="password"
                value={this.state.password}
                onChange={this.handleChange}
                />
                <MDBInput 
                type="password"
                outline
                label="Passwort wiederholen"
                name="passwordRepeat"
                value={this.state.passwordRepeat}
                onChange={this.handleChange}
                />
                <MDBBtn
                color="secondary"
                onClick={this.submitForm}
                >
                Passwort setzen
                </MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

export default graphql(
  SET_PSW, { name: 'set' }
)(withApollo(SetPassword));

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
