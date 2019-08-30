//> React
// Contains all the functionality necessary to define React components
import React from 'react';
// DOM bindings for React Router
import { BrowserRouter as Router } from 'react-router-dom';

//> Components
/**
 * Footer: Global Footer
 * Navbar: Global navigation bar
 */
import {
  Footer,
  Navbar,
} from './components/molecules';
// Routes
import Routes from './Routes';

//> Backend Connection
// Apollo
import { graphql, withApollo } from "react-apollo";
import { ApolloClient, HttpLink, InMemoryCache, gql } from "apollo-boost";
import * as compose from 'lodash.flowright';

const VERIFY_TOKEN = gql`
  mutation verify($token: String!) {
      verifyToken(token: $token) {
      payload
      }
  }
`;

const REFRESH_TOKEN = gql`
  mutation refresh($token: String!) {
    refreshToken(token: $token) {
      payload
      token
    }
  }
`;

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
      coach {
        id
        firstName
        lastName
        email
      }
      title    
      firstName
      lastName
      birthdate
      telephone
      address
      city
      postalCode
      userSet{
        id
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
    coach: false,
    loaded: false,
    userdata: {}
  }

  componentWillMount = () => {
    if(localStorage.getItem('wca') !== null){
      try {
        // Verify Token on first load
        this._verifyToken();
        // Refresh token every 4 minutes
        setInterval(async () => {
          this._verifyToken();
        }, 240000);
      } catch(e) {
        console.log(e);
      }
    } else {
      this.setState({
        loaded: true
      });
    }
  }

  _getUserData = () => {
    this.props.client.query({
        query: GET_DATA,
        variables: { "token": localStorage.getItem("wca") }
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

  _verifyToken = () => {
    this.props.verify({
      variables: { "token": localStorage.getItem('wca') }
    })
    .then(({data}) => {
        if(data !== undefined){
          if(data.verifyToken !== null){
            this._isLogged(
              data.verifyToken.payload.exp,
              data.verifyToken.payload.origIat,
              data.verifyToken.payload.username
            );
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
      variables: { "token": localStorage.getItem('wca') }
    })
    .then(({data}) => {
        if(data !== undefined){
          localStorage.setItem('wca', data.refreshToken.token);
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

  render() {
    console.log(this.state);
    return (
      <Router>
        <div className="flyout">
          <main className="mt-5">
            {this.state.loaded &&
            <Routes handler={this.handler} globalState={this.state} />
            }
          </main>
          <Footer globalState={this.state} />
        </div>
      </Router>
    );
  }
}

export default compose(
  graphql(VERIFY_TOKEN, { name: 'verify' }),
  graphql(REFRESH_TOKEN, { name: 'refresh' }),
  )(withApollo(App));

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
