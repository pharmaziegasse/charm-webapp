//> React
// Contains all the functionality necessary to define React components
import React from 'react';
// Redirect from Router
//import { Link } from 'react-router-dom';

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

//> CSS
import './footer.scss';

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
                {globalState.coach !== undefined && globalState.logged &&
                <div className="py-4">
                    <MDBContainer>
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
                                        href="mailto:support@aichner-christian.com"
                                        >
                                            <li className="list-unstyled">
                                                <MDBIcon icon="medkit" />Support
                                            </li>
                                        </a>
                                    </MDBCol>
                                    <MDBCol md="4">
                                        <li 
                                        className="list-unstyled clickable"
                                        onClick={() => this.logout()}
                                        >
                                            <MDBIcon icon="sign-out-alt" />Logout
                                        </li>
                                    </MDBCol>
                                </MDBRow>
                            )
                        }
                    </MDBContainer>
                </div>
                }
                <div className="footer-copyright text-center py-3">
                    <MDBContainer fluid>
                    <div>
                        &copy; 2018 - {new Date().getFullYear()} Copyright: PHARMAZIEGASSE<sup>®</sup>
                    </div>
                    <div>
                        <small className="text-muted">
                            Alpha release
                            <span className="pl-2 pr-2">·</span>
                            Version v{process.env.REACT_APP_VERSION}
                            <span className="pl-2 pr-2">·</span>
                            <a 
                            href="https://github.com/pharmaziegasse/charm-webapp"
                            rel="noopener noreferrer"
                            target="_blank"
                            >
                            <MDBIcon fab icon="github" className="pr-2"/>
                            View on GitHub
                            </a>
                            <span className="pl-2 pr-2">·</span>
                            <a 
                            href="https://github.com/pharmaziegasse/charm-webapp/issues/new?template=bug_report.md"
                            rel="noopener noreferrer"
                            target="_blank"
                            >
                            <MDBIcon icon="bug" className="pr-2"/>
                            Report bug
                            </a>
                        </small>
                    </div>
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
