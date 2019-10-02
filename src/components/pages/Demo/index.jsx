//> React
// Contains all the functionality necessary to define React components
import React from 'react';

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBNavbar,
  MDBNavbarNav,
  MDBNavbarBrand,
  MDBCollapse,
  MDBNavLink,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBNavbarToggler,
  MDBFormInline,
  MDBCard,
  MDBCardHeader,
  MDBCardTitle,
  MDBCardText,
  MDBDropdown,
  MDBDropdownItem,
  MDBNavItem,
  MDBCardBody,
  MDBBadge,
  MDBBtn,
  MDBAlert,
  MDBIcon,
  MDBSpinner,
} from "mdbreact";

//> CSS
import './demo.scss';

class Demo extends React.Component {
  state = {
    isOpen: false
  };

  toggleCollapse = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }
  render() {
    return (
      <div id="demo">
        <MDBNavbar color="indigo" dark expand="md">
            <MDBRow className="w-100 flex-center">
              <MDBCol md="4">
                <MDBNavbarNav>
                  
                  <img
                  className="img-fluid"
                  style={{maxWidth: '200px'}}
                  src="https://www.pharmaziegasse.at/static/media/white.b858081a.png"
                  alt="Pharmaziegasse Logo"
                  />
                </MDBNavbarNav>
              </MDBCol>
              <MDBCol md="4">
                <input
                  type="text"
                  name="search"
                  placeholder="Search for people"
                  id="searchbox"
                  className="form-control"
                />
              </MDBCol>
              <MDBCol md="4">
                <MDBNavbarNav right>
                  <MDBNavItem>
                    <MDBDropdown>
                      <MDBDropdownToggle nav caret>
                        <MDBIcon icon="user" />
                      </MDBDropdownToggle>
                    </MDBDropdown>
                  </MDBNavItem>
                  <MDBNavItem>
                    <MDBNavLink className="waves-effect waves-light" to="#!">
                      <MDBIcon far icon="question-circle" />
                    </MDBNavLink>
                  </MDBNavItem>
                </MDBNavbarNav>
              </MDBCol>
            </MDBRow>
        </MDBNavbar>
        <MDBRow>
          <MDBCol md="2">
            <MDBCard>
              <MDBCardHeader color="deep-orange lighten-1">Customer</MDBCardHeader>
              <MDBCardBody className="text-center">
                <MDBCardTitle>Simone Prast</MDBCardTitle>
                <MDBCardText>
                  <p>
                  <MDBBadge color="primary" className="ml-1 mr-1">Primary</MDBBadge>
                  <MDBBadge color="primary" className="ml-1 mr-1">Primary</MDBBadge>
                  </p>
                </MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol md="6">

          </MDBCol>
          <MDBCol md="4">

          </MDBCol>
        </MDBRow>
      </div>
    );
  }
}

export default Demo;

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
