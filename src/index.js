//> React
// Contains all the functionality necessary to define React components
import React from 'react';
// This serves as an entry point to the DOM and server renderers for React
import ReactDOM from 'react-dom';

//> Font Awesome
// Font Awesome is an awesome icon library
import '@fortawesome/fontawesome-free/css/all.min.css';

//> Connecting to backend
// Apollo
import { ApolloProvider } from 'react-apollo';
import { HttpLink } from "apollo-link-http";
import { InMemoryCache, IntrospectionFragmentMatcher } from "apollo-cache-inmemory";

//> Bootstrap
import 'bootstrap-css-only/css/bootstrap.min.css';

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import 'mdbreact/dist/css/mdb.css';

//> CSS
// Root SCSS file
import './index.scss';

//> Components
// Root component
import App from './App';

import registerServiceWorker from './registerServiceWorker';

// Render the root component to <div id="root"></div>
ReactDOM.render( 
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('root')
);

registerServiceWorker();

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
