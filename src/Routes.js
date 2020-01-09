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
  Questionnaire,
} from './components/pages/coach';
/**
 * Login: Login page
 */
import {
  Login,
  SetPassword,
} from './components/pages';

class Routes extends React.Component {

  // Handle login
  handleLogin = (status) => {
    // Call root component handler
    this.props.handler(status);
  }

  flushData = () => {
    this.props.flushData();
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
        path='/anamnesis/:uid'
        component={(props) => <Anamnesis globalState={this.props.globalState} {...props} />}
        />
        <Route
        exact
        path='/coach'
        component={(props) => <CoachDashboard 
        globalState={this.props.globalState} {...props}
        />
        }
        />
        <Route
        exact
        path='/reports/:uid'
        component={(props) => <ReportList globalState={this.props.globalState} {...props} />}
        />
        <Route
        exact
        path='/create/:uid'
        component={(props) => <GenerateReport 
        globalState={this.props.globalState} {...props} 
        flushData={this.flushData}
        />}
        />
        <Route
        exact
        path='/edit/:uid'
        component={(props) => <ReportRevision globalState={this.props.globalState} {...props} />}
        />
        <Route
        exact
        path='/reset'
        component={(props) => <SetPassword globalState={this.props.globalState} {...props} />}
        />
        <Route 
        exact
        path='/admin'
        component={() => window.location = 'https://manage.pharmaziegasse.at'}
        />
        <Route
        exact
        path='/form/:id'
        component={(props) => <Questionnaire globalState={this.props.globalState} {...props} />}
        />
        <Route 
        exact
        path='/api/graphiql'
        component={() => window.location = 'https://manage.pharmaziegasse.at/api/graphiql'}
        />
        <Route
        exact
        path='/test'
        component={(props) => <Dashboard globalState={this.props.globalState} {...props} />}
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
