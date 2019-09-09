//> React
// Contains all the functionality necessary to define React components
import React from 'react';
// Redirect from Router
import { Link } from 'react-router-dom';

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
    MDBFooter,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBIcon,
    MDBBtn,
} from 'mdbreact';

class Footer extends React.PureComponent{
    logout = () => {
        // Remove the token
        localStorage.removeItem('wca');
        // Redirect to login
        window.location.href = '/login'; 
    }

    render(){
        // Get global state with login information
        const { globalState } = this.props;

        return(
            <MDBFooter color="unique-darkblue" className="mt-4">
                <div className="py-4">
                    <MDBContainer>
                    {
                        globalState.logged ? (
                            <>
                                {!globalState.coach ? (
                                        <MDBRow className="text-center flex-center">
                                            <MDBCol md="4">
                                                <a href="#!">Referral Programm</a>
                                            </MDBCol>
                                            <MDBCol md="4">
                                                <a href="#!"><MDBIcon fab icon="facebook-f" className="pr-2" /></a>
                                                <a href="#!"><MDBIcon fab icon="instagram" className="pl-2" /></a>
                                            </MDBCol>
                                            <MDBCol md="4">
                                                <a href="#!">Fragen? Wir sind für Sie da!</a>
                                            </MDBCol>
                                        </MDBRow>
                                    ) : (
                                        <MDBRow className="text-center flex-center">
                                            <MDBCol md="4">
                                                <a 
                                                href="https://kisy.aichner-christian.com/?goto=Charm&token=asdf" 
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                >
                                                <MDBIcon icon="medkit" className="pr-2" />Technischer Support
                                                </a>
                                            </MDBCol>
                                            <MDBCol md="4">
                                                <MDBBtn
                                                color="white"
                                                rounded
                                                size="md"
                                                onClick={() => this.logout()}
                                                >
                                                <MDBIcon icon="sign-out-alt" className="pr-2" />Logout
                                                </MDBBtn>
                                            </MDBCol>
                                        </MDBRow>
                                    )
                                }
                            </>
                        ) : (
                            <p>Noch nicht eingeloggt content</p>
                        )
                    }
                        
                    </MDBContainer>
                </div>
                <div className="footer-copyright text-center py-3">
                    <MDBContainer fluid>
                        &copy; 2018 - {new Date().getFullYear()} Copyright: Pharmaziegasse<sup>®</sup>
                    </MDBContainer>
                </div>
            </MDBFooter>
        )
    }
}

export default Footer;

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
