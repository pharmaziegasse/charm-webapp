//> React
// Contains all the functionality necessary to define React components
import React from 'react';
// Redirect from Router
import { Link, Redirect } from 'react-router-dom';

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
    MDBContainer,
    MDBCollapse,
    MDBCard,
    MDBCardBody,
    MDBCollapseHeader,
    MDBProgress,
    MDBRow,
    MDBCol,
    MDBInput,
    MDBBtn,
    MDBIcon,
} from 'mdbreact';

//> Backend Connection
// Apollo
import { graphql } from "react-apollo";
import gql from 'graphql-tag';

//> CSS
import './newcustomer.scss';

// Update data
const UPDATE_FORMS = gql`
    mutation createAn ($token: String!, $values: GenericScalar!, $urlpath: String!) {
        anamneseAnFormPage(
            token: $token,
            url: $urlpath,
            values: $values
        ) {
            result
            errors {
                name
                errors
            }
        }
    }
`;

class NewCustomer extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            
        }
    }

    render() {
        // Get global state with login information
        const { globalState } = this.props;

        //> Route protection
        // Only logged in uses can access this page
        if(!globalState.logged) return <Redirect to="/login"/>
        // If logged in but not coach
        if(globalState.logged && !globalState.coach) return <Redirect to="/dashboard"/> 

        return(
            <MDBContainer id="coach">
                <h2 className="text-center font-weight-bold">Create customer</h2>
                <div className="text-left mt-4">
                    <Link to="/coach">
                        <MDBBtn color="red">
                            <MDBIcon icon="angle-left" className="pr-2" />Zurück
                        </MDBBtn>
                    </Link>
                </div>
            </MDBContainer>
        )
    }
}

export default NewCustomer;

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
