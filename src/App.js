//> React
// Contains all the functionality necessary to define React components
import React from 'react';
// DOM bindings for React Router
import { BrowserRouter as Router } from 'react-router-dom';

//> Components
/**
 * Footer: Global Footer
 */
import {
  Footer,
} from './components/molecules';
import {
  ScrollToTop
} from './components/atoms';
// Routes
import Routes from './Routes';

//> Backend Connection
// Apollo
import { graphql, withApollo } from 'react-apollo';
import { gql } from 'apollo-boost';
import * as compose from 'lodash.flowright';

//> Queries and Mutations
// Login
const LOGIN_USER = gql`
  mutation tokenAuth($username: String!, $password: String!){
    tokenAuth(username: $username, password: $password) {
      token
    }
  }
`;
// Verify token
const VERIFY_TOKEN = gql`
  mutation verify($token: String!) {
    verifyToken(token: $token) {
      payload
    }
  }
`;
// Refresh token
const REFRESH_TOKEN = gql`
  mutation refresh($token: String!) {
    refreshToken(token: $token) {
      payload
      token
    }
  }
`;
// Get data
const GET_DATA = gql`
  query ($token: String!) {
    userSelf(token: $token) {
      id
      lastLogin
      email
      isActive
      isStaff
      isCoach
      isCustomer
      title    
      firstName
      lastName
      birthdate
      telephone
      address
      city
      postalCode
      userSet{
        anamneseSet{
          id
        }
        beautyreportSet{
          id
        }
        id
        customerId
        firstName
        lastName
        email
        telephone
      }
      country
      newsletter
      verified
    }
  }
`;


class App extends React.Component {

  state = {
    logged: false,
    username: undefined,
    coach: undefined,
    loaded: false,
    userdata: {},
    flush: false,
  }

  componentDidMount = () => {
    if(localStorage.getItem('fprint') !== null){
      try {
        // Verify Token on first load
        this._verifyToken();
        // Refresh token every 4 minutes
        setInterval(async () => {
          this._verifyToken();
        }, 180000);
      } catch(e) {
        console.log(e);
      }
    } else {
      this.setState({
        loaded: true
      }, () => this._loginAnonymous());
    }
  }

  _getUserData = () => {
    this.props.client.query({
        query: GET_DATA,
        variables: { "token": localStorage.getItem("fprint") }
    }).then(({data}) => {
        if(data.userSelf !== undefined){
          this.setState({
            userdata: data.userSelf,
            coach: data.userSelf.isCoach,
            loaded: true
          });
        }
    })
    .catch(error => {
        console.log("Error",error);
    })
  }

  _loginAnonymous = async () => {
    await this.props.login({ variables: { "username": "simon", "password": "admin" } })
    .then(({ loading, data }) => {
      if(data){
        if(data.tokenAuth){
          if(data.tokenAuth.token){
            localStorage.setItem('fprint', data.tokenAuth.token);
          }
        }
      }
    }).catch((loading, error) => {
      // Username or password is wrong
      this.handler(false);
    });
  };

  _verifyToken = () => {
    this.props.verify({
      variables: { "token": localStorage.getItem('fprint') }
    })
    .then(({data}) => {
        if(data){
          if(data.verifyToken){
            if(data.verifyToken.payload.username !== "simon"){
              this._isLogged(
                data.verifyToken.payload.exp,
                data.verifyToken.payload.origIat,
                data.verifyToken.payload.username
              );
            } else {
              // Is anonymous user
              this.setState({
                logged: false,
                username: undefined,
                loaded: true,
              });
            }
          } else {
            this._notLogged();
          }
        } else {
          this._notLogged();
        }
    })
    .catch(error => {
        console.error("Mutation error:",error);
    })
  }

  _notLogged = () => {
    this.setState({
      logged: false,
      username: undefined,
      loaded: true
    });
  }

  _setLogged = (uname) => {
    this.setState({
      logged: true,
      username: uname,
    }, () => this._getUserData());
  }

  _isLogged = (exp, orig, uname) => {
    /**
     * Generate current timestamp
     * Ref: https://flaviocopes.com/how-to-get-timestamp-javascript/
     */
    let currentTS = ~~(Date.now() / 1000);
    // Check if the token is still valid
    if(currentTS > exp){
      console.log("Token has expired. User should be logged out.");
      this._notLogged();
    } else {
      // Only if anything has changed, update the data
      if(this.state.logged !== true){
        if(this.state.username !== uname){
          this._setLogged(uname);
        }
      }
      this._refeshToken();
    }
  }

  _refeshToken = () => {
    this.props.refresh({
      variables: { "token": localStorage.getItem('fprint') }
    })
    .then(({data}) => {
        if(data !== undefined){
          localStorage.setItem('fprint', data.refreshToken.token);
        }
    })
    .catch(error => {
        console.error("Mutation error:",error);
    })
  }

  handler = (logged) => {
    if(logged){
      this._verifyToken();
    }
  }

  flushData = () => {
    this.setState({
      flush: !this.state.flush
    })
  }

  render() {
    console.log("Updated", this.state);
    return (
      <Router>
        <ScrollToTop>
          <div className="flyout">
            <main>
              {this.state.loaded &&
              <Routes 
              handler={this.handler}
              globalState={this.state}
              flushData={this.flushData}
              />
              }
            </main>
            <Footer globalState={this.state} />
          </div>
        </ScrollToTop>
      </Router>
    );
  }
}

export default compose(
  graphql(VERIFY_TOKEN, { name: 'verify' }),
  graphql(REFRESH_TOKEN, { name: 'refresh' }),
  graphql(LOGIN_USER, {name: 'login'}),
)(withApollo(App));

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
