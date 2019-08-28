//> React
// Contains all the functionality necessary to define React components
import React from 'react';
// Link and Redirect from Router
import { Link, Redirect } from 'react-router-dom';

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
    MDBEdgeHeader,
    MDBFreeBird,
    MDBCol,
    MDBRow,
    MDBCardBody,
    MDBBtn,
    MDBAlert,
} from "mdbreact";

//> Backend Connection
// Apollo
import { graphql, Query } from "react-apollo";
import { gql } from "apollo-boost";

//> Queries and Mutations
const LOGIN_USER = gql`
    mutation tokenAuth($username: String!, $password: String!){
        tokenAuth(username: $username, password: $password) {
            token
        }
    }
`;

class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: "",
        }
    }

    handleChange = (e) => {
        this.setState({[e.target.type]: e.target.value})
    }

    handleSubmit = (e) => {
        // Prevent page from reloading
        e.preventDefault();
        // Validation
        e.target.className = "needs-validation was-validated";

        this._login("simon", "admin");
    }

    _login = async (email, password) => {
        await this.props.mutate({ variables: { "username": email, "password": password } })
        .then(({ loading, data }) => {
            if(data !== undefined){
                if(data.tokenAuth !== undefined){
                    if(data.tokenAuth.token !== undefined){
                        localStorage.setItem('wca',data.tokenAuth.token);
                        this.props.handler(true);
                    }
                }
            }
        }).catch((loading, error) => {
            // Username or password is wrong
            this.props.handler(false);
        });
    };

    render() {

        // Get global state with login information
        const { globalState } = this.props;

        /* Redirect to Dashboard
         * If user is already logged in, redirect to Dashboard
         * This doubles as a neat way to redirect the user directly after login
         */
        if(globalState.logged){
            console.log("reached");
            return <Redirect to="/dashboard"/> 
        } 

        return (
        <div>
            <MDBEdgeHeader color="secondary-color lighten-3" />
            <MDBFreeBird>
                <MDBRow>
                    <MDBCol
                    md="10"
                    className="mx-auto float-none white z-depth-1 py-2 px-2"
                    >
                        <MDBCardBody>
                            <MDBRow className="justify-content-center">
                                <MDBCol md="6">
                                    <form onSubmit={this.handleSubmit} className="needs-validation" noValidate>
                                        <p className="h4 text-center mb-4">Sign in</p>
                                        <label htmlFor="defaultFormLoginEmailEx" className="grey-text">
                                        Your email
                                        </label>
                                        <input
                                        type="email"
                                        id="defaultFormLoginEmailEx"
                                        className="form-control"
                                        onChange={this.handleChange}
                                        required
                                        />
                                        <div className="invalid-feedback">
                                            Please enter an E-Mail
                                        </div>
                                        <br />
                                        <label htmlFor="defaultFormLoginPasswordEx" className="grey-text">
                                        Your password
                                        </label>
                                        <input
                                        type="password"
                                        id="defaultFormLoginPasswordEx"
                                        className="form-control"
                                        onChange={this.handleChange}
                                        required
                                        />
                                        <div className="invalid-feedback">
                                            Please enter a password
                                        </div>
                                        <div className="text-center mt-4">
                                            <MDBBtn color="success" type="submit">
                                            <i className="fas fa-key pr-2"></i>Login
                                            </MDBBtn>
                                        </div>
                                        <p className="text-muted text-center mt-3">
                                        Not a member yet? No problem, just <Link to="/join">
                                        <strong>join us</strong>
                                        </Link>!
                                        </p>
                                    </form>
                                </MDBCol>
                            </MDBRow>
                        </MDBCardBody>
                    </MDBCol>
                </MDBRow>
            </MDBFreeBird>
        </div>
        );
    }
}

const AuthWithMutation = graphql(LOGIN_USER)(Login);

export default AuthWithMutation;

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
