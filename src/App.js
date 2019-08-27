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
import { graphql } from "react-apollo";
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


class App extends React.Component {

  state = {
    logged: false,
    username: undefined,
    coach: true,
  }

  componentWillMount = () => {
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
    });
  }

  _setLogged = (uname) => {
    this.setState({
      logged: true,
      username: uname
    });
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

  render() {
    return (
      <Router>
        <div className="flyout">
          <main className="mt-5">
            <Routes globalState={this.state} />
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
  )(App);

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
