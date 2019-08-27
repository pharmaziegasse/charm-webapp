//> React
// Contains all the functionality necessary to define React components
import React from 'react';

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
    MDBFooter,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBIcon,
} from 'mdbreact';

class Footer extends React.Component{
    render(){
        return(
            <MDBFooter color="unique-darkblue" className="mt-4">
                <div className="py-4">
                    <MDBContainer>
                        <MDBRow className="text-center">
                            <MDBCol md="4">
                                <a href="#">Referral Programm</a>
                            </MDBCol>
                            <MDBCol md="4">
                                <a href="#"><MDBIcon fab icon="facebook-f" className="pr-2" /></a>
                                <a href="#"><MDBIcon fab icon="instagram" className="pl-2" /></a>
                            </MDBCol>
                            <MDBCol md="4">
                                <a href="#">Fragen? Wir sind für Sie da!</a>
                            </MDBCol>
                        </MDBRow>
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
