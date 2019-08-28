//> React
// Contains all the functionality necessary to define React components
import React from 'react';
// DOM bindings for React Router
import { Route, Switch } from 'react-router-dom';

//> Components
/**
 * Dashboard: Basic Charm front-end for customers
 */
import {
  Dashboard
} from './components/pages/customer';
/**
 * ReportRevision: Page for coaches to review beauty reports
 */
import {
  ReportRevision,
  ReportList,
  Anamnesis,
  Coach,
} from './components/pages/coach';
/**
 * Login: Login page
 */
import {
  Login
} from './components/pages';

class Routes extends React.Component {

  // Handle login
  handleLogin = (status) => {
    // Call root component handler
    this.props.handler(status);
  }

  render() {
    return (
      <Switch>
        <Route
        exact
        path='/dashboard'
        component={(props) => <Dashboard globalState={this.props.globalState} {...props} />}
        />
        <Route
        exact
        path='/login'
        component={(props) => <Login handler = {this.handleLogin} globalState={this.props.globalState} {...props} />}
        />
        <Route
        exact
        path='/anamnesis'
        component={(props) => <Anamnesis globalState={this.props.globalState} {...props} />}
        />
        <Route
        exact
        path='/coach'
        component={(props) => <Coach globalState={this.props.globalState} {...props} />}
        />
        <Route
        exact
        path='/report'
        component={(props) => <ReportList globalState={this.props.globalState} {...props} />}
        />
        <Route
        exact
        path='/report/edit'
        component={(props) => <ReportRevision globalState={this.props.globalState} {...props} />}
        />
        <Route
          render={function () {
            return <h1>Not Found</h1>;
          }}
        />
      </Switch>
    );
  }
}

export default Routes;

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
