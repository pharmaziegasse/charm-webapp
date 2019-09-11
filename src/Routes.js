//> React
// Contains all the functionality necessary to define React components
import React from 'react';
// DOM bindings for React Router
import { Route, Switch, Redirect } from 'react-router-dom';

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
  GenerateReport,
  ReportList,
  Anamnesis,
  CoachDashboard,
  NewCustomer,
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
        component={(props) => <CoachDashboard globalState={this.props.globalState} {...props} />}
        />
        <Route
        exact
        path='/add'
        component={(props) => <NewCustomer globalState={this.props.globalState} {...props} />}
        />
        <Route
        exact
        path='/report'
        component={(props) => <ReportList globalState={this.props.globalState} {...props} />}
        />
        <Route
        exact
        path='/report/add'
        component={(props) => <GenerateReport globalState={this.props.globalState} {...props} />}
        />
        <Route
        exact
        path='/report/edit'
        component={(props) => <ReportRevision globalState={this.props.globalState} {...props} />}
        />
        <Route 
        exact
        path='/admin'
        component={() => window.location = 'https://manage.pharmaziegasse.at'}
        />
        <Route 
        exact
        path='/api/graphiql'
        component={() => window.location = 'https://manage.pharmaziegasse.at/api/graphiql'}
        />
        <Route
          render={function () {
            return <Redirect to='/login' />;
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
