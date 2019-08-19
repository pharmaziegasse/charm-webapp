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
} from './components/pages/coach';
/**
 * Login: Login page
 */
import {
  Login
} from './components/pages';

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path='/dashboard' component={Dashboard} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/logout' component={localStorage.removeItem('wca')} />
        <Route exact path='/report' component={ReportList} />
        <Route exact path='/report/:id' component={ReportRevision} />
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
