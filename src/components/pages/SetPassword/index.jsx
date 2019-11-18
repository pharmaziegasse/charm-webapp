//> React
// Contains all the functionality necessary to define React components
import React from 'react';
// Redirect from Router
import { Redirect } from 'react-router-dom';

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBAlert,
  MDBIcon,
  MDBInput,
  MDBSpinner,
} from "mdbreact";

class SetPassword extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            
        }
    }

  render() {

    // Get global state with login information
    const { globalState } = this.props;

    /**
      * Redirect to Dashboard
      * If user is already logged in, redirect to Dashboard
      * This doubles as a neat way to redirect the user directly after login
      */
    if(!globalState.logged){
        return <Redirect to="/login"/> 
    } 

    return(
      <MDBContainer className="py-5">
        <MDBRow className="flex-center">
          <MDBCol md="6">
            <MDBCard className="text-center">
              <MDBCardBody>
                <h3>Passwort setzen</h3>
                <MDBInput 
                type="password"
                outline
                label="Passwort"
                name="password1"
                />
                <MDBInput 
                type="password"
                outline
                label="Passwort wiederholen"
                name="password2"
                />
                <MDBBtn
                color="secondary"
                >
                Passwort setzen
                </MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

export default SetPassword;

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
